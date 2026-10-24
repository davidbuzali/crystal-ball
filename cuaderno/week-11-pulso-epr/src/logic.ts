import { ROUTES } from "./data.ts";
import type { Constraints, CycleInput, Projection, RouteResult, SensorSummary } from "./types.ts";

export const INPUT_BOUNDS: Record<keyof CycleInput, { min: number; max: number }> = {
  skuCount: { min: 1, max: 100000 },
  changedSkus: { min: 0, max: 100000 },
  evidenceCompleteness: { min: 0, max: 100 },
  exceptions: { min: 0, max: 100000 },
  firstCycleHours: { min: 0.25, max: 10000 },
  reviewHours: { min: 0, max: 5000 },
  internalHourlyCost: { min: 0, max: 100000 },
  externalCycleFee: { min: 0, max: 10000000 },
  cyclesPerYear: { min: 1, max: 52 },
};

export function validateCycle(input: CycleInput): string[] {
  const errors: string[] = [];
  for (const [key, bounds] of Object.entries(INPUT_BOUNDS)) {
    const value = input[key as keyof CycleInput];
    if (!Number.isFinite(value) || value < bounds.min || value > bounds.max) {
      errors.push(`${key} debe estar entre ${bounds.min} y ${bounds.max}.`);
    }
  }
  if (input.changedSkus > input.skuCount) errors.push("Los SKU modificados no pueden superar el total de SKU.");
  if (input.exceptions > input.skuCount * 10) errors.push("Las excepciones superan el límite de 10 por SKU.");
  return errors;
}

export function simulatedSensor(input: CycleInput): SensorSummary {
  return {
    mode: "simulated",
    activeMinutes: Math.round(input.firstCycleHours * 60),
    checkpoints: Math.max(3, Math.round(input.skuCount / 12)),
    interruptions: Math.max(1, Math.round(input.exceptions / 5)),
    motionSamples: 0,
  };
}

export function projectCycleTwo(input: CycleInput, sensor: SensorSummary): Projection {
  const completenessPenalty = (100 - input.evidenceCompleteness) / 100;
  const changeRatio = input.changedSkus / Math.max(1, input.skuCount);
  const exceptionRatio = input.exceptions / Math.max(1, input.skuCount);
  const observedHours = sensor.mode === "measured" && sensor.activeMinutes >= 15
    ? Math.max(input.firstCycleHours, sensor.activeMinutes / 60)
    : input.firstCycleHours;
  const base = Math.max(
    0.5,
    observedHours * (0.58 + completenessPenalty * 0.34) +
      input.reviewHours * 0.45 +
      input.skuCount * 0.012 +
      input.changedSkus * 0.055 +
      input.exceptions * 0.08,
  );
  const uncertainty = sensor.mode === "simulated" ? 0.24 : 0.18;
  const low = base * (1 - uncertainty);
  const high = base * (1 + uncertainty + completenessPenalty * 0.08);
  const candidates = [
    { score: completenessPenalty, label: "Evidencia incompleta", direction: "sube" as const },
    { score: changeRatio, label: "Proporción de SKU modificados", direction: "sube" as const },
    { score: exceptionRatio, label: "Excepciones por SKU", direction: "sube" as const },
    { score: input.reviewHours / Math.max(1, input.firstCycleHours), label: "Carga de revisión humana", direction: "sube" as const },
    { score: Math.max(0, input.evidenceCompleteness - 50) / 100, label: "Completitud disponible", direction: "baja" as const },
  ].sort((a, b) => b.score - a.score).slice(0, 3);

  return {
    lowHours: round(low),
    baseHours: round(base),
    highHours: round(high),
    confidence: sensor.mode === "measured" && sensor.activeMinutes >= 15 && sensor.checkpoints >= 1 && input.evidenceCompleteness >= 70
      ? "limitada"
      : "exploratoria",
    modelVersion: "SYN-LIN-0.3",
    drivers: candidates.map((item, index) => ({
      label: item.label,
      direction: item.direction,
      impact: index === 0 ? "alto" : index === 1 ? "medio" : "bajo",
    })),
  };
}

export function compareRoutes(
  input: CycleInput,
  projection: Projection,
  constraints: Constraints,
): RouteResult[] {
  return ROUTES.map((route) => {
    const cycleHours = round(projection.baseHours * route.hourFactor);
    const annualCost = Math.round(
      route.fixedAnnualCost +
      input.externalCycleFee * route.feeFactor * input.cyclesPerYear +
      cycleHours * input.internalHourlyCost * input.cyclesPerYear,
    );
    const passes = {
      cost: annualCost <= constraints.maxAnnualCost,
      time: cycleHours <= constraints.maxCycleHours,
      traceability: route.traceability >= constraints.minTraceability,
      dataControl: route.dataControl >= constraints.minDataControl,
    };
    return { ...route, cycleHours, annualCost, passes, eligible: Object.values(passes).every(Boolean) };
  });
}

export function makeExport(
  input: CycleInput,
  sensor: SensorSummary,
  projection: Projection,
  routes: RouteResult[],
  reviewed: boolean,
) {
  if (!reviewed) throw new Error("Se requiere revisión humana antes de exportar.");
  return {
    schema: "pulso-epr-assessment@1",
    generatedAt: new Date().toISOString(),
    limitations: [
      "No acredita cumplimiento regulatorio.",
      "No demuestra reciclaje, recuperación ni beneficio humano.",
      "Las proyecciones y supuestos de ruta son sintéticos hasta validación real.",
    ],
    aggregateCycle: input,
    sensor,
    projection,
    routes: routes.map(({ key, name, cycleHours, annualCost, passes, eligible, status, caveat }) => ({
      key, name, cycleHours, annualCost, passes, eligible, status, caveat,
    })),
    humanReview: { assumptionsReviewed: true, regulatoryApproval: false },
  };
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

