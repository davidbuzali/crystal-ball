export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateUploadMetadata(file) {
  if (!file) return "Selecciona una imagen para continuar.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Usa una imagen PNG, JPEG o WebP.";
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return "La imagen está vacía o no se pudo leer.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "La imagen debe pesar 5 MB o menos.";
  }
  return null;
}

export function hasValidImageSignature(bytes, mimeType) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 12) return false;
  if (mimeType === "image/png") {
    return [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  }
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
  }
  if (mimeType === "image/webp") {
    const header = new TextDecoder().decode(bytes.slice(0, 12));
    return header.startsWith("RIFF") && header.slice(8, 12) === "WEBP";
  }
  return false;
}

export function dataUrlPayload(dataUrl) {
  const separator = dataUrl.indexOf(",");
  if (!dataUrl.startsWith("data:") || separator < 0) throw new Error("invalid_data_url");
  return dataUrl.slice(separator + 1);
}
