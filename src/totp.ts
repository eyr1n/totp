async function hotp(
  key: Uint8Array,
  count: number,
  digit: number
): Promise<string> {
  const imported = await crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    false,
    ["sign"]
  );

  const countView = new DataView(new ArrayBuffer(8));
  countView.setBigUint64(0, BigInt(count), false);

  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", imported, countView.buffer)
  );

  const offset = signature[signature.length - 1] & 0x0f;
  signature[offset] &= 0x7f;
  const value = new DataView(signature.buffer, offset, 4).getUint32(0, false);

  return value.toString().slice(-digit);
}

export async function totp(
  key: Uint8Array,
  seconds: number,
  digit: number,
  step: number
) {
  const T = Math.floor(seconds / step);
  return await hotp(key, T, digit);
}
