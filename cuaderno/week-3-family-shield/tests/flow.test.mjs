import test from "node:test";
import assert from "node:assert/strict";
import { remainingContacts, resolveVerificationOutcome, trustedContacts } from "../src/lib/flow.mjs";

test("verification options come only from pre-established contacts", () => {
  assert.deepEqual(
    trustedContacts.map(({ id, name }) => ({ id, name })),
    [
      { id: "diego", name: "Diego" },
      { id: "laura", name: "Laura" },
      { id: "roberto", name: "Roberto" },
    ],
  );
  assert.equal(trustedContacts.some((contact) => "phone" in contact || "url" in contact), false);
});

test("an unavailable primary contact continues to a backup", () => {
  assert.equal(resolveVerificationOutcome("unavailable", ["diego"]), "continue");
  assert.deepEqual(remainingContacts(["diego"]).map((contact) => contact.id), ["laura", "roberto"]);
});

test("denial immediately enters Protocol Only", () => {
  assert.equal(resolveVerificationOutcome("denied", ["diego"]), "protocol");
});

test("exhausting all contacts enters Protocol Only", () => {
  assert.equal(resolveVerificationOutcome("unavailable", ["diego", "laura", "roberto"]), "protocol");
});

test("independent confirmation records confirmation without a payment action", () => {
  assert.equal(resolveVerificationOutcome("confirmed", ["diego"]), "confirmed");
});
