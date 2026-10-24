import type { CycleInput, RouteAssumption } from "./types.ts";

export const DEFAULT_CYCLE: CycleInput = {
  skuCount: 280,
  changedSkus: 34,
  evidenceCompleteness: 68,
  exceptions: 19,
  firstCycleHours: 62,
  reviewHours: 11,
  internalHourlyCost: 420,
  externalCycleFee: 38000,
  cyclesPerYear: 4,
};

export const SAMPLE_CYCLE: CycleInput = {
  skuCount: 24,
  changedSkus: 6,
  evidenceCompleteness: 72,
  exceptions: 4,
  firstCycleHours: 9.5,
  reviewHours: 2,
  internalHourlyCost: 420,
  externalCycleFee: 9500,
  cyclesPerYear: 4,
};

export const ROUTES: RouteAssumption[] = [
  {
    key: "spreadsheet",
    name: "Mejorar la hoja actual",
    shortName: "Hoja",
    description: "Plantilla versionada, reglas y revisión interna.",
    hourFactor: 0.94,
    fixedAnnualCost: 18000,
    feeFactor: 0,
    traceability: 2,
    dataControl: 4,
    status: "estimated",
    caveat: "El control sigue dependiendo de disciplina manual y una persona clave.",
  },
  {
    key: "consultant",
    name: "Consultor especializado",
    shortName: "Consultor",
    description: "Acompañamiento externo por ciclo y control compartido.",
    hourFactor: 0.7,
    fixedAnnualCost: 12000,
    feeFactor: 1,
    traceability: 3,
    dataControl: 2,
    status: "estimated",
    caveat: "La eficiencia depende del contrato, formatos y disponibilidad del consultor.",
  },
  {
    key: "partner",
    name: "Plataforma aliada",
    shortName: "Aliada",
    description: "Adaptar un producto existente antes de inventar otro.",
    hourFactor: 0.46,
    fixedAnnualCost: 210000,
    feeFactor: 0.15,
    traceability: 4,
    dataControl: 3,
    status: "estimated",
    caveat: "Precio, cobertura mexicana y esfuerzo de implantación requieren cotización real.",
  },
  {
    key: "adapter",
    name: "Adaptador local",
    shortName: "Adaptador",
    description: "Capa estrecha sobre sistemas y proveedor existentes.",
    hourFactor: 0.58,
    fixedAnnualCost: 285000,
    feeFactor: 0.1,
    traceability: 4,
    dataControl: 4,
    status: "estimated",
    caveat: "No se justifica hasta que varios pilotos pagados revelen el mismo hueco recurrente.",
  },
];

export const STATUS_LABEL = {
  measured: "Medido",
  provided: "Declarado",
  estimated: "Estimación sintética",
  missing: "Falta evidencia",
} as const;

