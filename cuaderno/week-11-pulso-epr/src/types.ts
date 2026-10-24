export type SensorMode = "measured" | "simulated";
export type EvidenceStatus = "measured" | "provided" | "estimated" | "missing";

export type CycleInput = {
  skuCount: number;
  changedSkus: number;
  evidenceCompleteness: number;
  exceptions: number;
  firstCycleHours: number;
  reviewHours: number;
  internalHourlyCost: number;
  externalCycleFee: number;
  cyclesPerYear: number;
};

export type SensorSummary = {
  mode: SensorMode;
  activeMinutes: number;
  checkpoints: number;
  interruptions: number;
  motionSamples: number;
};

export type ProjectionDriver = {
  label: string;
  impact: "alto" | "medio" | "bajo";
  direction: "sube" | "baja";
};

export type Projection = {
  lowHours: number;
  baseHours: number;
  highHours: number;
  confidence: "exploratoria" | "limitada";
  modelVersion: string;
  drivers: ProjectionDriver[];
};

export type Constraints = {
  maxAnnualCost: number;
  maxCycleHours: number;
  minTraceability: number;
  minDataControl: number;
};

export type RouteKey = "spreadsheet" | "consultant" | "partner" | "adapter";

export type RouteAssumption = {
  key: RouteKey;
  name: string;
  shortName: string;
  description: string;
  hourFactor: number;
  fixedAnnualCost: number;
  feeFactor: number;
  traceability: number;
  dataControl: number;
  status: EvidenceStatus;
  caveat: string;
};

export type RouteResult = RouteAssumption & {
  cycleHours: number;
  annualCost: number;
  passes: {
    cost: boolean;
    time: boolean;
    traceability: boolean;
    dataControl: boolean;
  };
  eligible: boolean;
};

