import { base32 } from "./base32";
import { totp } from "./totp";

(async () => {
  const params = new URLSearchParams(location.search);

  const key = base32(params.get("key") ?? "");
  const digit = parseInt(params.get("digit") ?? "6");
  const step = parseInt(params.get("step") ?? "30");

  const code = await totp(key!, Date.now() / 1000, digit, step);
  document.querySelector<HTMLDivElement>("#code")!.innerText = code;
  navigator.clipboard.writeText(code);
})();
