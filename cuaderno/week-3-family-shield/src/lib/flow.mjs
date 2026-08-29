export const trustedContacts = Object.freeze([
  { id: "diego", name: "Diego", role: "Número guardado antes de la emergencia" },
  { id: "laura", name: "Laura", role: "Persona de confianza 1" },
  { id: "roberto", name: "Roberto", role: "Persona de confianza 2" },
]);

export const contactOutcomes = Object.freeze([
  { id: "confirmed", label: "Confirmó la emergencia por un canal independiente" },
  { id: "denied", label: "Negó la emergencia" },
  { id: "unavailable", label: "No respondió / no fue posible confirmar" },
]);

export function remainingContacts(attemptedIds) {
  const attempted = new Set(attemptedIds);
  return trustedContacts.filter((contact) => !attempted.has(contact.id));
}

export function resolveVerificationOutcome(outcome, attemptedIds) {
  if (outcome === "confirmed") return "confirmed";
  if (outcome === "denied") return "protocol";
  if (outcome === "unavailable" && remainingContacts(attemptedIds).length === 0) return "protocol";
  return "continue";
}
