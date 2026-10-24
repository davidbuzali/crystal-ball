import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_CYCLE, SAMPLE_CYCLE, STATUS_LABEL } from "./data.ts";
import { compareRoutes, INPUT_BOUNDS, makeExport, projectCycleTwo, simulatedSensor, validateCycle } from "./logic.ts";
import type { Constraints, CycleInput, EvidenceStatus, SensorMode, SensorSummary } from "./types.ts";

const DEFAULT_CONSTRAINTS: Constraints = {
  maxAnnualCost: 250000,
  maxCycleHours: 40,
  minTraceability: 3,
  minDataControl: 3,
};

const FIELD_COPY: Record<keyof CycleInput, { label: string; suffix: string; hint: string }> = {
  skuCount: { label: "SKU en el ciclo", suffix: "SKU", hint: "Total incluido en la reconciliación." },
  changedSkus: { label: "SKU modificados", suffix: "SKU", hint: "Altas, bajas o revisión de empaque." },
  evidenceCompleteness: { label: "Evidencia completa", suffix: "%", hint: "Campos respaldados por fuente." },
  exceptions: { label: "Excepciones abiertas", suffix: "casos", hint: "Faltantes o contradicciones." },
  firstCycleHours: { label: "Esfuerzo ciclo 1", suffix: "h", hint: "Trabajo total, incluido el manual." },
  reviewHours: { label: "Revisión humana", suffix: "h", hint: "No se elimina de la estimación." },
  internalHourlyCost: { label: "Costo interno por hora", suffix: "MXN", hint: "Costo cargado, no salario personal." },
  externalCycleFee: { label: "Honorario externo actual", suffix: "MXN", hint: "Por ciclo; usa 0 si no aplica." },
  cyclesPerYear: { label: "Ciclos comparables por año", suffix: "ciclos", hint: "Frecuencia esperada." },
};

function App() {
  const [cycle, setCycle] = useState<CycleInput>(DEFAULT_CYCLE);
  const [mode, setMode] = useState<SensorMode>("simulated");
  const [sensor, setSensor] = useState<SensorSummary>(() => simulatedSensor(DEFAULT_CYCLE));
  const [constraints, setConstraints] = useState<Constraints>(DEFAULT_CONSTRAINTS);
  const [running, setRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const [motionState, setMotionState] = useState<"idle" | "enabled" | "unavailable" | "denied">("idle");
  const [toast, setToast] = useState("");
  const startRef = useRef<number | null>(null);

  const errors = useMemo(() => validateCycle(cycle), [cycle]);
  const projection = useMemo(() => projectCycleTwo(cycle, sensor), [cycle, sensor]);
  const routes = useMemo(() => compareRoutes(cycle, projection, constraints), [cycle, projection, constraints]);
  const eligibleCount = routes.filter((route) => route.eligible).length;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (startRef.current) setElapsedSeconds(Math.floor((Date.now() - startRef.current) / 1000));
    }, 250);
    const onVisibility = () => {
      if (document.hidden) setSensor((current) => ({ ...current, interruptions: current.interruptions + 1 }));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [running]);

  useEffect(() => {
    if (motionState !== "enabled") return;
    let lastSample = 0;
    const onMotion = () => {
      const now = Date.now();
      if (now - lastSample < 1000) return;
      lastSample = now;
      setSensor((current) => ({ ...current, motionSamples: Math.min(999, current.motionSamples + 1) }));
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [motionState]);

  function updateCycle(key: keyof CycleInput, value: number) {
    setCycle((current) => ({ ...current, [key]: value }));
    setReviewed(false);
    if (mode === "simulated") {
      setSensor(simulatedSensor({ ...cycle, [key]: value }));
    }
  }

  function selectMode(nextMode: SensorMode) {
    setMode(nextMode);
    setReviewed(false);
    setRunning(false);
    setElapsedSeconds(0);
    startRef.current = null;
    setSensor(nextMode === "simulated"
      ? simulatedSensor(cycle)
      : { mode: "measured", activeMinutes: 0, checkpoints: 0, interruptions: 0, motionSamples: 0 });
  }

  function toggleTimer() {
    if (running) {
      setRunning(false);
      startRef.current = null;
      setSensor((current) => ({ ...current, activeMinutes: Math.round((elapsedSeconds / 60) * 10) / 10 }));
      return;
    }
    setMode("measured");
    setSensor((current) => ({ ...current, mode: "measured" }));
    startRef.current = Date.now() - elapsedSeconds * 1000;
    setRunning(true);
  }

  async function requestMotion() {
    const motion = DeviceMotionEvent as typeof DeviceMotionEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
    if (!("DeviceMotionEvent" in window)) {
      setMotionState("unavailable");
      return;
    }
    try {
      const result = motion.requestPermission ? await motion.requestPermission() : "granted";
      setMotionState(result === "granted" ? "enabled" : "denied");
    } catch {
      setMotionState("denied");
    }
  }

  function loadSample() {
    setCycle(SAMPLE_CYCLE);
    setMode("simulated");
    setSensor(simulatedSensor(SAMPLE_CYCLE));
    setReviewed(false);
    setToast("Muestra inventada de 24 SKU cargada.");
  }

  function reset() {
    setCycle(DEFAULT_CYCLE);
    setMode("simulated");
    setSensor(simulatedSensor(DEFAULT_CYCLE));
    setConstraints(DEFAULT_CONSTRAINTS);
    setRunning(false);
    setElapsedSeconds(0);
    setReviewed(false);
    setToast("Evaluación restablecida.");
  }

  function exportAssessment() {
    try {
      const payload = makeExport(cycle, sensor, projection, routes, reviewed);
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "pulso-epr-evaluacion.json";
      anchor.click();
      URL.revokeObjectURL(url);
      setToast("Evaluación agregada exportada. No contiene identidad ni texto libre.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "No fue posible exportar.");
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Pulso EPR, ir al inicio">
          <span className="brand-mark">P</span>
          <span>Pulso <strong>EPR</strong></span>
        </a>
        <nav aria-label="Secciones">
          <a href="#medir">Medir</a>
          <a href="#proyectar">Proyectar</a>
          <a href="#comparar">Comparar</a>
        </nav>
        <button className="quiet-button" type="button" onClick={reset}>Reiniciar</button>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <div className="eyebrow">Diagnóstico comercial · México · Prototipo educativo</div>
          <h1 id="hero-title">Mide antes de comprar.<br /><em>Adapta antes de inventar.</em></h1>
          <p>Compara el costo y el esfuerzo de tu siguiente ciclo de evidencia de empaques. Conserva la incertidumbre y deja visible el trabajo humano.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#medir">Iniciar diagnóstico <span aria-hidden="true">↓</span></a>
            <button className="text-button" type="button" onClick={loadSample}>Usar muestra inventada de 24 SKU</button>
          </div>
          <div className="trust-row" aria-label="Características de privacidad">
            <span>Sin cuenta</span><span>Sin archivos</span><span>Sin rastreo</span><span>Cálculo local</span>
          </div>
        </section>

        <aside className="limit-banner" role="note">
          <span className="limit-icon" aria-hidden="true">!</span>
          <div>
            <strong>No demuestra cumplimiento ni reciclaje.</strong>
            <p>Compara escenarios operativos con datos agregados. No interpreta la ley, no emite declaraciones y no prueba beneficio ambiental o humano.</p>
          </div>
          <Status status="estimated" label="Prototipo" />
        </aside>

        <section className="stage" id="medir" aria-labelledby="measure-title">
          <StageHeader number="01" title="Define y mide un ciclo" kicker="Carga visible" description="Incluye el trabajo que suele desaparecer de una cotización: excepciones, revisión y seguimiento." />
          <div className="measure-grid">
            <form className="panel input-panel" onSubmit={(event) => event.preventDefault()}>
              <div className="panel-heading">
                <div>
                  <p className="micro-label">Datos agregados</p>
                  <h3 id="measure-title">Radiografía del ciclo</h3>
                </div>
                <Status status="provided" label="Declarado por ti" />
              </div>
              <div className="fields-grid">
                {(Object.keys(FIELD_COPY) as (keyof CycleInput)[]).map((key) => (
                  <NumberField key={key} fieldKey={key} value={cycle[key]} onChange={(value) => updateCycle(key, value)} />
                ))}
              </div>
              {errors.length > 0 && (
                <div className="error-box" role="alert">
                  <strong>Revisa {errors.length === 1 ? "este dato" : "estos datos"}:</strong>
                  <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
                </div>
              )}
            </form>

            <div className="panel sensor-panel">
              <div className="panel-heading">
                <div>
                  <p className="micro-label">Teléfono como sensor</p>
                  <h3>Pulso de trabajo</h3>
                </div>
                <Status status={mode === "measured" ? "measured" : "estimated"} label={mode === "measured" ? "Medición local" : "Feed simulado"} />
              </div>
              <div className="segmented" aria-label="Modo del sensor">
                <button type="button" aria-pressed={mode === "measured"} onClick={() => selectMode("measured")}>Medir aquí</button>
                <button type="button" aria-pressed={mode === "simulated"} onClick={() => selectMode("simulated")}>Simular</button>
              </div>
              {mode === "measured" ? (
                <div className="timer-card">
                  <p>Tiempo activo en esta sesión</p>
                  <strong className="timer">{formatTimer(elapsedSeconds)}</strong>
                  <button className="primary-button full" type="button" onClick={toggleTimer}>{running ? "Detener medición" : "Iniciar medición"}</button>
                  <button className="secondary-button full" type="button" onClick={() => setSensor((current) => ({ ...current, checkpoints: current.checkpoints + 1 }))}>+ Marcar punto de conciliación</button>
                </div>
              ) : (
                <div className="sim-card">
                  <span className="sim-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
                  <div><strong>Feed simulado activo</strong><p>Derivado de los valores del formulario. No proviene de un proceso real.</p></div>
                </div>
              )}
              <dl className="sensor-stats">
                <div><dt>Minutos activos</dt><dd>{sensor.activeMinutes.toLocaleString("es-MX")}</dd></div>
                <div><dt>Puntos marcados</dt><dd>{sensor.checkpoints}</dd></div>
                <div><dt>Interrupciones</dt><dd>{sensor.interruptions}</dd></div>
                <div><dt>Muestras de movimiento</dt><dd>{sensor.motionSamples}</dd></div>
              </dl>
              <button className="sensor-permission" type="button" onClick={requestMotion} disabled={motionState === "enabled"}>
                {motionState === "enabled" ? "Movimiento activado" : motionState === "unavailable" ? "Movimiento no disponible" : motionState === "denied" ? "Permiso no concedido" : "Activar movimiento opcional"}
              </button>
              <p className="fine-print">El movimiento solo cuenta muestras mientras esta página está abierta. No identifica a una persona ni sale del navegador.</p>
            </div>
          </div>
        </section>

        <section className="stage projection-stage" id="proyectar" aria-labelledby="projection-title">
          <StageHeader number="02" title="Proyecta el segundo ciclo" kicker="Modelo explicable" description="Una hipótesis visible que debe competir contra una regla simple y contra datos reales del siguiente ciclo." />
          <div className="projection-grid">
            <article className="projection-card">
              <div className="panel-heading">
                <div><p className="micro-label">Rango de esfuerzo</p><h3 id="projection-title">{projection.lowHours}–{projection.highHours} horas</h3></div>
                <Status status="estimated" label={`ML sintético · ${projection.modelVersion}`} />
              </div>
              <div className="range-track" aria-label={`Estimación entre ${projection.lowHours} y ${projection.highHours} horas`}>
                <span style={{ width: `${Math.min(92, Math.max(20, projection.baseHours))}%` }} />
              </div>
              <div className="range-labels"><span>{projection.lowHours} h · bajo</span><strong>{projection.baseHours} h · base</strong><span>{projection.highHours} h · alto</span></div>
              <div className="projection-note">
                <strong>Confianza {projection.confidence}</strong>
                <p>Coeficientes entrenados con escenarios inventados. No hay historial real suficiente para afirmar precisión.</p>
              </div>
            </article>
            <article className="drivers-card">
              <p className="micro-label">Qué mueve el rango</p>
              <h3>Tres impulsores principales</h3>
              <ol className="drivers-list">
                {projection.drivers.map((driver, index) => (
                  <li key={driver.label}><span>{index + 1}</span><div><strong>{driver.label}</strong><small>Impacto {driver.impact} · {driver.direction} el esfuerzo</small></div></li>
                ))}
              </ol>
              <details>
                <summary>Ver fórmula y límites</summary>
                <p>La base combina el ciclo 1, evidencia incompleta, SKU, cambios, excepciones y revisión. El rango añade 18% de incertidumbre con medición suficiente o 24% con feed simulado.</p>
              </details>
            </article>
          </div>
        </section>

        <section className="stage" id="comparar" aria-labelledby="compare-title">
          <StageHeader number="03" title="Compara rutas, no promesas" kicker="Lógica de mercado" description="Tú defines los límites. Una ruta pasa solo si cumple todos; el sistema puede devolver ninguna." />
          <div className="constraints-panel">
            <div>
              <p className="micro-label">Condiciones duras</p>
              <h3 id="compare-title">Tu puerta de decisión</h3>
            </div>
            <Constraint label="Costo anual máximo" value={constraints.maxAnnualCost} suffix="MXN" min={50000} max={1000000} step={10000} onChange={(value) => setConstraints({ ...constraints, maxAnnualCost: value })} />
            <Constraint label="Horas máximas por ciclo" value={constraints.maxCycleHours} suffix="h" min={5} max={200} step={5} onChange={(value) => setConstraints({ ...constraints, maxCycleHours: value })} />
            <SelectConstraint label="Trazabilidad mínima" value={constraints.minTraceability} onChange={(value) => setConstraints({ ...constraints, minTraceability: value })} />
            <SelectConstraint label="Control de datos mínimo" value={constraints.minDataControl} onChange={(value) => setConstraints({ ...constraints, minDataControl: value })} />
          </div>

          <div className={`decision-summary ${eligibleCount ? "has-match" : "no-match"}`} role="status">
            <span aria-hidden="true">{eligibleCount ? "✓" : "∅"}</span>
            <div>
              <strong>{eligibleCount ? `${eligibleCount} ${eligibleCount === 1 ? "ruta pasa" : "rutas pasan"} tus cuatro condiciones` : "Ninguna ruta está validada con estas condiciones"}</strong>
              <p>{eligibleCount ? "Pasar el filtro permite investigar; no equivale a comprar, construir ni acreditar cumplimiento." : "No fuerces una ganadora. Ajusta solo una condición que realmente puedas negociar o busca mejor evidencia."}</p>
            </div>
          </div>

          <div className="routes-grid">
            {routes.map((route) => (
              <article className={`route-card ${route.eligible ? "eligible" : ""}`} key={route.key}>
                <div className="route-topline"><span className="route-index">{route.shortName.slice(0, 1)}</span><Status status={route.status} /></div>
                <h3>{route.name}</h3>
                <p className="route-description">{route.description}</p>
                <div className="route-metrics">
                  <div><small>Esfuerzo / ciclo</small><strong>{route.cycleHours} h</strong></div>
                  <div><small>Costo anual</small><strong>{money(route.annualCost)}</strong></div>
                </div>
                <ul className="checks">
                  <Check passed={route.passes.cost}>Dentro del costo máximo</Check>
                  <Check passed={route.passes.time}>Dentro del tiempo máximo</Check>
                  <Check passed={route.passes.traceability}>Trazabilidad {scoreLabel(route.traceability)}</Check>
                  <Check passed={route.passes.dataControl}>Control de datos {scoreLabel(route.dataControl)}</Check>
                </ul>
                <p className="caveat"><strong>Por comprobar:</strong> {route.caveat}</p>
                <div className={`route-verdict ${route.eligible ? "pass" : "fail"}`}>{route.eligible ? "Pasa el filtro · no es recomendación" : "No pasa todas las condiciones"}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="stage shadow-stage" aria-labelledby="shadow-title">
          <StageHeader number="04" title="Mira la carga que queda en sombra" kicker="Cláusula de sombra" description="Una mejora comercial no cuenta si externaliza trabajo, borra evidencia o fabrica una historia ambiental." />
          <div className="shadow-grid">
            <article className="burden-card">
              <div className="panel-heading"><div><p className="micro-label">Chequeo de carga</p><h3 id="shadow-title">Quién hace el trabajo</h3></div><Status status="missing" label="Requiere evidencia" /></div>
              <div className="burden-table" role="table" aria-label="Personas y cargas del proceso">
                <BurdenRow actor="Liderazgo de cumplimiento" task="Resuelve excepciones y conserva la responsabilidad." status="Visible" />
                <BurdenRow actor="Proveedores" task="Entrega especificaciones y corrige contradicciones." status="Por medir" />
                <BurdenRow actor="Consultor u operador" task="Interpreta reglas y prepara salidas." status="Por cotizar" />
                <BurdenRow actor="Finanzas / dirección" task="Aprueba gasto y riesgo residual." status="Revisión" />
                <BurdenRow actor="Evidencia en papel" task="Debe tener una ruta de revisión humana; nunca exclusión automática." status="Protegida" />
              </div>
            </article>
            <article className="blocked-claims">
              <p className="micro-label">Afirmaciones bloqueadas</p>
              <h3>Lo que este resultado no puede decir</h3>
              <ul>
                <li><span>×</span>“Cumplimos con la regulación mexicana.”</li>
                <li><span>×</span>“Este empaque fue reciclado.”</li>
                <li><span>×</span>“La ruta mejora la vida de pepenadores.”</li>
                <li><span>×</span>“La inversión produce un retorno 10:1.”</li>
                <li><span>×</span>“El adaptador local debe construirse.”</li>
              </ul>
            </article>
          </div>

          <div className="review-gate">
            <div className="review-copy">
              <span className="review-icon" aria-hidden="true">✓</span>
              <div><p className="micro-label">Puerta humana</p><h3>Revisa supuestos antes de exportar</h3><p>Esta confirmación aprueba la lectura de los supuestos; no aprueba cumplimiento, impacto ni compra.</p></div>
            </div>
            <label className="review-check">
              <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />
              <span>Revisé rangos, costos, trabajo oculto y evidencia faltante.</span>
            </label>
            <button className="primary-button export-button" type="button" disabled={!reviewed || errors.length > 0} onClick={exportAssessment}>Exportar evaluación JSON</button>
            <p className="fine-print">Solo agregados · sin identidad · sin texto libre · sin envío a servidor</p>
          </div>
        </section>
      </main>

      <footer>
        <div><span className="brand footer-brand"><span className="brand-mark">P</span><span>Pulso <strong>EPR</strong></span></span><p>Prototipo educativo de David Buzali · Business Bending, Week 11.</p></div>
        <div><strong>Regla de salida</strong><p>Una estimación abre una investigación. Solo un segundo ciclo comparable prueba ahorro recurrente.</p></div>
      </footer>

      {toast && <button className="toast" type="button" onClick={() => setToast("")} aria-live="polite">{toast}<span aria-hidden="true">×</span></button>}
    </div>
  );
}

function StageHeader({ number, title, kicker, description }: { number: string; title: string; kicker: string; description: string }) {
  return <div className="stage-header"><div className="stage-number">{number}</div><div><p className="micro-label">{kicker}</p><h2>{title}</h2></div><p>{description}</p></div>;
}

function Status({ status, label }: { status: EvidenceStatus; label?: string }) {
  return <span className={`status status-${status}`}>{label ?? STATUS_LABEL[status]}</span>;
}

function NumberField({ fieldKey, value, onChange }: { fieldKey: keyof CycleInput; value: number; onChange: (value: number) => void }) {
  const copy = FIELD_COPY[fieldKey];
  const bounds = INPUT_BOUNDS[fieldKey];
  return (
    <label className="number-field">
      <span>{copy.label}</span>
      <div><input type="number" value={value} min={bounds.min} max={bounds.max} step={fieldKey === "firstCycleHours" || fieldKey === "reviewHours" ? 0.5 : 1} onChange={(event) => onChange(Number(event.target.value))} /><em>{copy.suffix}</em></div>
      <small>{copy.hint}</small>
    </label>
  );
}

function Constraint({ label, value, suffix, min, max, step, onChange }: { label: string; value: number; suffix: string; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return <label className="constraint"><span>{label}</span><div><input type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} /><em>{suffix}</em></div></label>;
}

function SelectConstraint({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="constraint"><span>{label}</span><select value={value} onChange={(event) => onChange(Number(event.target.value))}><option value={1}>Baja</option><option value={2}>Media</option><option value={3}>Alta</option><option value={4}>Muy alta</option></select></label>;
}

function Check({ passed, children }: { passed: boolean; children: React.ReactNode }) {
  return <li className={passed ? "check-pass" : "check-fail"}><span aria-hidden="true">{passed ? "✓" : "×"}</span>{children}</li>;
}

function BurdenRow({ actor, task, status }: { actor: string; task: string; status: string }) {
  return <div className="burden-row" role="row"><strong role="cell">{actor}</strong><span role="cell">{task}</span><em role="cell">{status}</em></div>;
}

function formatTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function money(value: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
}

function scoreLabel(value: number) {
  return ["", "bajo", "medio", "alto", "muy alto"][value];
}

export default App;

