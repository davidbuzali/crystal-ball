import test from "node:test";
import assert from "node:assert/strict";
import { displayValue, formatAmountMxn, practiceClaim, safeParseOrganizedClaim } from "../src/lib/claim.mjs";

test("the central practice claim matches the declared scenario", () => {
  const result = safeParseOrganizedClaim(practiceClaim);
  assert.equal(result.success, true);
  assert.equal(result.data.claimedRequester, "Diego");
  assert.equal(result.data.claimedRelationship, "Hijo");
  assert.equal(result.data.amountMxn, 20_000);
  assert.equal(result.data.deadline, "30 minutos");
  assert.equal(result.data.familyCodeMentioned, true);
  assert.equal(result.data.verificationStatus, "not_independently_verified");
});

test("missing values are shown as No identificado", () => {
  assert.equal(displayValue(null), "No identificado");
  assert.equal(displayValue(""), "No identificado");
  assert.equal(formatAmountMxn(null), "No identificado");
});

test("unknown AI fields and authenticity conclusions are rejected", () => {
  const result = safeParseOrganizedClaim({
    ...practiceClaim,
    authenticity: "safe",
  });
  assert.equal(result.success, false);
});

test("the verification status cannot be changed by model output", () => {
  const result = safeParseOrganizedClaim({
    ...practiceClaim,
    verificationStatus: "verified",
  });
  assert.equal(result.success, false);
});

test("pressure signals are restricted to an allowlist", () => {
  const result = safeParseOrganizedClaim({
    ...practiceClaim,
    pressureSignals: [...practiceClaim.pressureSignals, "definitely fraudulent"],
  });
  assert.equal(result.success, false);
});
