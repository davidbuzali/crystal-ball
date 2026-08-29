import test from "node:test";
import assert from "node:assert/strict";
import { hasValidImageSignature, MAX_IMAGE_BYTES, validateUploadMetadata } from "../src/lib/upload.mjs";

test("valid supported image metadata is accepted", () => {
  for (const type of ["image/png", "image/jpeg", "image/webp"]) {
    assert.equal(validateUploadMetadata({ type, size: 120_000 }), null);
  }
});

test("empty, unsupported, and oversized files are rejected", () => {
  assert.match(validateUploadMetadata(null), /Selecciona/);
  assert.match(validateUploadMetadata({ type: "image/svg+xml", size: 100 }), /PNG, JPEG o WebP/);
  assert.match(validateUploadMetadata({ type: "image/png", size: 0 }), /vacía/);
  assert.match(validateUploadMetadata({ type: "image/png", size: MAX_IMAGE_BYTES + 1 }), /5 MB/);
});

test("file signatures must agree with the declared MIME type", () => {
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4]);
  const webp = new TextEncoder().encode("RIFF0000WEBP");
  const jpeg = new Uint8Array([0xff, 0xd8, 1, 2, 3, 4, 5, 6, 7, 8, 0xff, 0xd9]);

  assert.equal(hasValidImageSignature(png, "image/png"), true);
  assert.equal(hasValidImageSignature(webp, "image/webp"), true);
  assert.equal(hasValidImageSignature(jpeg, "image/jpeg"), true);
  assert.equal(hasValidImageSignature(png, "image/jpeg"), false);
});
