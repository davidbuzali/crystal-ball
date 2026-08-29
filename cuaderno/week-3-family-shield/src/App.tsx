import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { displayValue, formatAmountMxn, parseOrganizedClaim, practiceClaim } from "./lib/claim.mjs";
import { contactOutcomes, remainingContacts, resolveVerificationOutcome, trustedContacts } from "./lib/flow.mjs";
import { dataUrlPayload, validateUploadMetadata } from "./lib/upload.mjs";

type Step = "start" | "upload" | "processing" | "summary" | "analysis-error" | "verify" | "outcome";
type AnalysisMode = "live" | "simulated";
type Result = "confirmed" | "protocol" | null;

type OrganizedClaim = {
  claimedRequester: string | null;
  claimedRelationship: string | null;
  claimedEvent: string | null;
  amountMxn: number | null;
  deadline: string | null;
  requestedAction: string | null;
  pressureSignals: string[];
  familyCodeMentioned: boolean;
  verificationStatus: "not_independently_verified";
};

const configuredMode: AnalysisMode = import.meta.env.VITE_ANALYSIS_MODE === "live" ? "live" : "simulated";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("file_read_failed"));
    reader.readAsDataURL(file);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("practice_image_failed"));
    image.src = url;
  });
}

async function loadPracticeFile(): Promise<File> {
  const response = await fetch("/demo/family-emergency-message.svg", { cache: "no-store" });
  if (!response.ok) throw new Error("practice_image_failed");
  const svgBlob = await response.blob();
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = 760;
    canvas.height = 1080;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas_unavailable");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("practice_image_failed"))), "image/png");
    });
    return new File([pngBlob], "caso-ficticio-diego.png", { type: "image/png" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function App() {
  const [step, setStep] = useState<Step>("start");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [claim, setClaim] = useState<OrganizedClaim | null>(null);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(configuredMode);
  const [attemptedContactIds, setAttemptedContactIds] = useState<string[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableContacts = useMemo(() => remainingContacts(attemptedContactIds), [attemptedContactIds]);
  const activeContact = trustedContacts.find((contact) => contact.id === activeContactId) ?? null;
  const showStopRule = ["summary", "analysis-error", "verify", "outcome"].includes(step);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  useEffect(() => {
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timeout = window.setTimeout(resetScroll, 100);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [step]);

  function reset() {
    setStep("start");
    setFile(null);
    setPrivacyAccepted(false);
    setUploadError(null);
    setAnalysisError(null);
    setClaim(null);
    setAnalysisMode(configuredMode);
    setAttemptedContactIds([]);
    setActiveContactId(null);
    setVerificationNotice(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function acceptFile(nextFile: File | null) {
    const error = validateUploadMetadata(nextFile);
    setUploadError(error);
    if (error) {
      setFile(null);
      return;
    }
    setFile(nextFile);
    setClaim(null);
    setAnalysisError(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0] ?? null);
  }

  async function usePracticeCase() {
    setUploadError(null);
    try {
      const practiceFile = await loadPracticeFile();
      acceptFile(practiceFile);
      setPrivacyAccepted(true);
      setStep("upload");
    } catch {
      setUploadError("No pudimos cargar el caso de práctica. Intenta de nuevo.");
      setStep("upload");
    }
  }

  async function analyze() {
    const validationError = validateUploadMetadata(file);
    if (validationError || !privacyAccepted || !file) {
      setUploadError(validationError ?? "Confirma que usarás solamente el caso ficticio.");
      return;
    }

    setStep("processing");
    setAnalysisError(null);

    try {
      if (configuredMode === "simulated") {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        setClaim(parseOrganizedClaim(practiceClaim));
        setAnalysisMode("simulated");
      } else {
        const dataUrl = await readFileAsDataUrl(file);
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name.slice(0, 120),
            mimeType: file.type,
            size: file.size,
            data: dataUrlPayload(dataUrl),
          }),
        });
        if (!response.ok) throw new Error("analysis_failed");
        const payload = await response.json();
        setClaim(parseOrganizedClaim(payload.claim));
        setAnalysisMode(payload.mode === "simulated" ? "simulated" : "live");
      }
      setStep("summary");
    } catch {
      setAnalysisError("No pudimos organizar la imagen. Puedes continuar directamente con la verificación independiente.");
      setStep("analysis-error");
    }
  }

  function recordContactOutcome(outcomeId: string) {
    if (!activeContactId) return;
    const attempted = [...new Set([...attemptedContactIds, activeContactId])];
    setAttemptedContactIds(attempted);
    const next = resolveVerificationOutcome(outcomeId, attempted);

    if (next === "confirmed") {
      setResult("confirmed");
      setStep("outcome");
    } else if (next === "protocol") {
      setResult("protocol");
      setStep("outcome");
    } else {
      setVerificationNotice(`No fue posible confirmar con ${activeContact?.name}. Intenta con otro contacto establecido.`);
    }
    setActiveContactId(null);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#main" aria-label="Family Shield, ir al contenido principal">
          <span className="brand-mark" aria-hidden="true">FS</span>
          <span>Family Shield</span>
        </a>
        <span className="practice-badge">CASO FICTICIO · PRÁCTICA</span>
      </header>

      <main id="main" className="main-card">
        {step !== "start" && step !== "outcome" && (
          <nav className="progress" aria-label="Progreso">
            <span className={step === "upload" ? "current" : "done"}>1. Mensaje</span>
            <span className={["processing", "summary", "analysis-error"].includes(step) ? "current" : step === "verify" ? "done" : ""}>2. Revisar</span>
            <span className={step === "verify" ? "current" : ""}>3. Verificar</span>
          </nav>
        )}

        {showStopRule && (
          <div className="stop-banner" role="status">
            <strong>NO PAGUES TODAVÍA</strong>
            <span>La solicitud no ha sido verificada por un canal independiente.</span>
          </div>
        )}

        {step === "start" && (
          <section className="hero" aria-labelledby="start-title">
            <p className="eyebrow">Una pausa antes de una decisión irreversible</p>
            <h1 id="start-title">Pausa antes de pagar</h1>
            <p className="lead">
              Organiza una solicitud urgente y verifica por otro canal. Family Shield no comprueba quién envió el mensaje.
            </p>
            <div className="rule-card">
              <span aria-hidden="true">!</span>
              <p><strong>La regla familiar</strong>Una palabra correcta llama tu atención; solo una confirmación independiente autoriza continuar.</p>
            </div>
            <div className="button-stack">
              <button className="primary-button" onClick={() => setStep("upload")}>Revisar una solicitud urgente</button>
              <button className="secondary-button" onClick={usePracticeCase}>Usar caso de práctica</button>
            </div>
            <p className="microcopy">No mueve dinero, no accede a tu banco y no analiza audio.</p>
          </section>
        )}

        {step === "upload" && (
          <section aria-labelledby="upload-title">
            <p className="eyebrow">Paso 1 de 3</p>
            <h1 id="upload-title">Agrega la captura del mensaje</h1>
            <div className="privacy-note">
              <strong>Privacidad del prototipo</strong>
              <p>La imagen puede enviarse a un proveedor externo de IA para un análisis único. Para esta entrega usa solamente el caso ficticio; no subas mensajes privados reales.</p>
            </div>
            <label className="file-zone" htmlFor="screenshot">
              <span className="file-zone-title">Seleccionar captura</span>
              <span>PNG, JPEG o WebP · máximo 5 MB</span>
              <input ref={fileInputRef} id="screenshot" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
            </label>
            {uploadError && <p className="field-error" role="alert">{uploadError}</p>}
            {file && previewUrl && (
              <div className="file-preview">
                <img src={previewUrl} alt="Vista previa del mensaje ficticio seleccionado" />
                <div>
                  <strong>{file.name}</strong>
                  <span>{Math.max(1, Math.round(file.size / 1024))} KB</span>
                  <button className="text-button" onClick={() => acceptFile(null)}>Quitar imagen</button>
                </div>
              </div>
            )}
            <label className="consent-row">
              <input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} />
              <span>Confirmo que usaré solamente información ficticia para esta práctica.</span>
            </label>
            <div className="button-stack">
              <button className="primary-button" onClick={analyze} disabled={!file || !privacyAccepted}>Organizar la solicitud</button>
              <button className="secondary-button" onClick={usePracticeCase}>Cargar caso ficticio</button>
            </div>
          </section>
        )}

        {step === "processing" && (
          <section className="centered-state" aria-labelledby="processing-title" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p className="eyebrow">Paso 2 de 3</p>
            <h1 id="processing-title">Organizando lo que dice el mensaje...</h1>
            <p className="lead"><strong>Esto no comprobará quién lo envió.</strong></p>
            <button className="text-button" onClick={reset}>Cancelar y empezar de nuevo</button>
          </section>
        )}

        {step === "summary" && claim && (
          <section aria-labelledby="summary-title">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Paso 2 de 3</p>
                <h1 id="summary-title">Esto es lo que solicita el mensaje</h1>
              </div>
              <span className={`mode-badge ${analysisMode}`}>{analysisMode === "simulated" ? "ANÁLISIS SIMULADO" : "ANÁLISIS CON IA"}</span>
            </div>
            <div className="claim-grid">
              <ClaimItem label="Dice ser" value={`${displayValue(claim.claimedRequester)} · ${displayValue(claim.claimedRelationship)}`} />
              <ClaimItem label="Cantidad solicitada" value={formatAmountMxn(claim.amountMxn)} />
              <ClaimItem label="Emergencia declarada" value={displayValue(claim.claimedEvent)} wide />
              <ClaimItem label="Tiempo declarado" value={displayValue(claim.deadline)} />
              <ClaimItem label="Acción solicitada" value={displayValue(claim.requestedAction)} wide />
            </div>
            <div className="warning-card" role="alert">
              <strong>Este análisis NO confirma si el mensaje es real o falso.</strong>
              <p>Solo organiza lo que aparece en la captura. La identidad sigue sin verificarse.</p>
            </div>
            <div className="signals-card">
              <h2>Señales de presión presentes</h2>
              <ul>{claim.pressureSignals.length ? claim.pressureSignals.map((signal) => <li key={signal}>{signal}</li>) : <li>No identificadas</li>}</ul>
            </div>
            {claim.familyCodeMentioned && (
              <div className="code-note">
                <strong>El mensaje menciona una palabra familiar.</strong>
                <p>Eso llama tu atención, pero no autoriza un pago. La palabra pudo ser robada, escuchada o usada bajo presión.</p>
              </div>
            )}
            <button className="primary-button" onClick={() => setStep("verify")}>Verificar por otro canal</button>
          </section>
        )}

        {step === "analysis-error" && (
          <section aria-labelledby="analysis-error-title">
            <p className="eyebrow">La tecnología no respondió</p>
            <h1 id="analysis-error-title">Aún puedes verificar de forma segura</h1>
            <p className="lead" role="alert">{analysisError}</p>
            <div className="warning-card">
              <strong>No uses ningún número o enlace incluido en el mensaje.</strong>
              <p>Continúa con un contacto que ya conocías antes de recibir la solicitud.</p>
            </div>
            <button className="primary-button" onClick={() => setStep("verify")}>Ir a verificación independiente</button>
          </section>
        )}

        {step === "verify" && (
          <section aria-labelledby="verify-title">
            <p className="eyebrow">Paso 3 de 3</p>
            <h1 id="verify-title">Verifica por un canal independiente</h1>
            <p className="lead">Usa únicamente un contacto que ya conocías antes de recibir el mensaje. No uses números, cuentas ni enlaces enviados por el solicitante.</p>
            {verificationNotice && <p className="notice" role="status">{verificationNotice}</p>}
            <div className="contact-list">
              {availableContacts.map((contact) => (
                <button key={contact.id} className="contact-card" onClick={() => { setActiveContactId(contact.id); setVerificationNotice(null); }}>
                  <span className="contact-avatar" aria-hidden="true">{contact.name.slice(0, 1)}</span>
                  <span><strong>{contact.name}</strong><small>{contact.role}</small></span>
                  <span aria-hidden="true">Llamar</span>
                </button>
              ))}
            </div>
            {activeContact && (
              <div className="call-panel" role="dialog" aria-modal="true" aria-labelledby="call-title">
                <span className="mode-badge simulated">LLAMADA SIMULADA</span>
                <h2 id="call-title">Registrar resultado con {activeContact.name}</h2>
                <p>Family Shield no escucha ni graba la conversación.</p>
                <div className="button-stack">
                  {contactOutcomes.map((outcome) => (
                    <button key={outcome.id} className={outcome.id === "confirmed" ? "secondary-button" : "outcome-button"} onClick={() => recordContactOutcome(outcome.id)}>{outcome.label}</button>
                  ))}
                  <button className="text-button" onClick={() => setActiveContactId(null)}>Cancelar</button>
                </div>
              </div>
            )}
            <button className="text-button danger-text" onClick={() => { setResult("protocol"); setStep("outcome"); }}>No pude confirmar con nadie</button>
          </section>
        )}

        {step === "outcome" && result && (
          <section className={`outcome-state ${result}`} aria-labelledby="outcome-title">
            <p className="eyebrow">Resultado del protocolo</p>
            {result === "confirmed" ? (
              <>
                <div className="outcome-icon" aria-hidden="true">✓</div>
                <h1 id="outcome-title">Confirmación independiente registrada</h1>
                <p className="lead">La confirmación fue reportada por ti después de usar un canal establecido. Family Shield no realiza ni autoriza pagos.</p>
                <div className="control-card"><strong>Tú conservas la decisión final.</strong><span>Detente si todavía tienes dudas o recibes instrucciones contradictorias.</span></div>
              </>
            ) : (
              <>
                <div className="outcome-icon" aria-hidden="true">!</div>
                <h1 id="outcome-title">PROTOCOLO ONLY</h1>
                <p className="protocol-copy">No pagues todavía. La verificación independiente no se completó.</p>
                <p className="lead">Esperar es la acción correcta. Seguir el protocolo no significa que hayas fallado ni que no te importe tu familia.</p>
              </>
            )}
            <button className="primary-button" onClick={reset}>Empezar una práctica nueva</button>
            <p className="microcopy">Al reiniciar, la captura y el resultado se borran de esta sesión.</p>
          </section>
        )}
      </main>

      <footer>
        <p>Prototipo académico · No autentica personas · No mueve dinero · No almacena el caso</p>
      </footer>
    </div>
  );
}

function ClaimItem({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <dl className={`claim-item${wide ? " wide" : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

export default App;
