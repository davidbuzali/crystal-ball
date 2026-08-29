import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

async function builtText() {
  const assetNames = await readdir(new URL("../dist/assets/", import.meta.url));
  const javascript = assetNames.filter((name) => name.endsWith(".js"));
  const chunks = await Promise.all(javascript.map((name) => readFile(new URL(`../dist/assets/${name}`, import.meta.url), "utf8")));
  return chunks.join("\n");
}

test("the production build contains critical safety copy", async () => {
  const content = await builtText();
  for (const expected of [
    "NO PAGUES TODAVÍA",
    "Este análisis NO confirma si el mensaje es real o falso.",
    "Verificar por otro canal",
    "PROTOCOLO ONLY",
    "ANÁLISIS SIMULADO",
    "LLAMADA SIMULADA",
    "Tú conservas la decisión final.",
  ]) {
    assert.match(content, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("the production build has no payment action or authenticity score", async () => {
  const content = await builtText();
  for (const forbidden of ["Pagar ahora", "Transferir ahora", "autenticidad: 98", "mensaje seguro"]) {
    assert.doesNotMatch(content, new RegExp(forbidden, "i"));
  }
});
