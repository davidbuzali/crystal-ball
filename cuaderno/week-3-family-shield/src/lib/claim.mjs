import { z } from "zod";

export const pressureSignalValues = [
  "urgencia",
  "número no guardado",
  "instrucción de no llamar",
  "presión emocional",
  "secreto solicitado",
  "canal proporcionado por el solicitante",
  "solicitud de comprobante",
];

const optionalShortText = z.string().trim().min(1).max(160).nullable();

export const organizedClaimSchema = z
  .object({
    claimedRequester: optionalShortText,
    claimedRelationship: optionalShortText,
    claimedEvent: optionalShortText,
    amountMxn: z.number().finite().nonnegative().max(1_000_000_000).nullable(),
    deadline: optionalShortText,
    requestedAction: optionalShortText,
    pressureSignals: z.array(z.enum(pressureSignalValues)).max(7),
    familyCodeMentioned: z.boolean(),
    verificationStatus: z.literal("not_independently_verified"),
  })
  .strict();

export const practiceClaim = Object.freeze({
  claimedRequester: "Diego",
  claimedRelationship: "Hijo",
  claimedEvent: "Accidente y detención en el Ministerio Público",
  amountMxn: 20_000,
  deadline: "30 minutos",
  requestedAction: "Transferir dinero y enviar el comprobante",
  pressureSignals: [
    "urgencia",
    "número no guardado",
    "instrucción de no llamar",
    "presión emocional",
    "canal proporcionado por el solicitante",
    "solicitud de comprobante",
  ],
  familyCodeMentioned: true,
  verificationStatus: "not_independently_verified",
});

export function parseOrganizedClaim(input) {
  return organizedClaimSchema.parse(input);
}

export function safeParseOrganizedClaim(input) {
  return organizedClaimSchema.safeParse(input);
}

export function displayValue(value) {
  return value === null || value === undefined || value === "" ? "No identificado" : value;
}

export function formatAmountMxn(value) {
  if (value === null || value === undefined) return "No identificado";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}
