import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_CYCLE, SAMPLE_CYCLE } from "../src/data.ts";
import { compareRoutes, makeExport, projectCycleTwo, simulatedSensor, validateCycle } from "../src/logic.ts";
import type { Constraints, SensorSummary } from "../src/types.ts";

test("validates relational and bounded cycle inputs", () => {
  assert.deepEqual(validateCycle(SAMPLE_CYCLE), []);
  const errors = validateCycle({ ...SAMPLE_CYCLE, skuCount: 5, changedSkus: 6, evidenceCompleteness: 101 });
  assert.ok(errors.some((error) => error.includes("evidenceCompleteness")));
  assert.ok(errors.some((error) => error.includes("modificados")));
});

test("simulated sensor is deterministic and explicitly simulated", () => {
  const first = simulatedSensor(SAMPLE_CYCLE);
  const second = simulatedSensor(SAMPLE_CYCLE);
  assert.deepEqual(first, second);
  assert.equal(first.mode, "simulated");
  assert.equal(first.activeMinutes, 570);
});

test("switching to measured mode alone does not increase confidence", () => {
  const emptyMeasurement: SensorSummary = {
    mode: "measured",
    activeMinutes: 0,
    checkpoints: 0,
    interruptions: 0,
    motionSamples: 0,
  };
  assert.equal(projectCycleTwo(SAMPLE_CYCLE, emptyMeasurement).confidence, "exploratoria");
});

test("confidence remains limited even with a meaningful measured sample", () => {
  const measured: SensorSummary = {
    mode: "measured",
    activeMinutes: 30,
    checkpoints: 2,
    interruptions: 1,
    motionSamples: 0,
  };
  assert.equal(projectCycleTwo(SAMPLE_CYCLE, measured).confidence, "limitada");
});

test("route eligibility requires every hard constraint", () => {
  const projection = projectCycleTwo(SAMPLE_CYCLE, simulatedSensor(SAMPLE_CYCLE));
  const strict: Constraints = { maxAnnualCost: 1, maxCycleHours: 1, minTraceability: 4, minDataControl: 4 };
  assert.equal(compareRoutes(SAMPLE_CYCLE, projection, strict).filter((route) => route.eligible).length, 0);

  const permissive: Constraints = { maxAnnualCost: 1000000, maxCycleHours: 200, minTraceability: 1, minDataControl: 1 };
  assert.equal(compareRoutes(SAMPLE_CYCLE, projection, permissive).every((route) => route.eligible), true);
});

test("export stays aggregate and is blocked before human review", () => {
  const sensor = simulatedSensor(DEFAULT_CYCLE);
  const projection = projectCycleTwo(DEFAULT_CYCLE, sensor);
  const constraints: Constraints = { maxAnnualCost: 250000, maxCycleHours: 40, minTraceability: 3, minDataControl: 3 };
  const routes = compareRoutes(DEFAULT_CYCLE, projection, constraints);
  assert.throws(() => makeExport(DEFAULT_CYCLE, sensor, projection, routes, false), /revisión humana/);

  const exported = JSON.stringify(makeExport(DEFAULT_CYCLE, sensor, projection, routes, true));
  assert.doesNotMatch(exported, /email|nombre|teléfono|dirección/i);
  assert.match(exported, /regulatoryApproval":false/);
});

