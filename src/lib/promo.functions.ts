import { createServerFn } from "@tanstack/react-start";

// Server-side promo validation. The code and discount rules live on the server
// so the client cannot read the code from the bundle or fabricate a discount.
const PROMO_CODES: Record<string, { percent: number }> = {
  NEWART10: { percent: 10 },
};

export const validatePromo = createServerFn({ method: "POST" })
  .inputValidator((data: { code: unknown; subtotal: unknown }) => {
    const code = typeof data?.code === "string" ? data.code.trim().toUpperCase().slice(0, 32) : "";
    const subtotalNum = Number(data?.subtotal);
    const subtotal = Number.isFinite(subtotalNum) && subtotalNum >= 0 ? Math.floor(subtotalNum) : 0;
    return { code, subtotal };
  })
  .handler(async ({ data }) => {
    const promo = PROMO_CODES[data.code];
    if (!promo) {
      return { valid: false as const };
    }
    const discount = Math.round((data.subtotal * promo.percent) / 100);
    return {
      valid: true as const,
      code: data.code,
      percent: promo.percent,
      discount,
    };
  });
