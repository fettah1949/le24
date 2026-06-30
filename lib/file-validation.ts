const SIGNATURES: { mime: string; ext: string; bytes: number[]; offset?: number }[] = [
  { mime: "image/jpeg", ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/gif", ext: "gif", bytes: [0x47, 0x49, 0x46] },
  { mime: "image/webp", ext: "webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
];

export function detectImageType(
  buffer: Buffer
): { mime: string; ext: string } | null {
  for (const sig of SIGNATURES) {
    const offset = sig.offset ?? 0;
    if (buffer.length < offset + sig.bytes.length) continue;

    const match = sig.bytes.every(
      (byte, i) => buffer[offset + i] === byte
    );

    if (match) return { mime: sig.mime, ext: sig.ext };
  }

  // WEBP also needs RIFF header at start
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }

  return null;
}
