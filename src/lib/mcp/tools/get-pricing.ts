import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const HOUR_PRICING: Record<number, number> = {
  1: 200, 2: 350, 3: 500, 4: 650, 5: 750, 6: 850, 7: 900, 8: 1000,
};

export default defineTool({
  name: "get_pricing",
  title: "Get studio pricing",
  description: "Return the NewArt Studio hourly pricing matrix (1–8 hours) in SAR.",
  inputSchema: {
    hours: z
      .number()
      .int()
      .min(1)
      .max(8)
      .optional()
      .describe("Optional specific hour count (1–8) to price."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ hours }) => {
    if (hours) {
      const price = HOUR_PRICING[hours];
      return {
        content: [{ type: "text", text: `${hours}h = ${price} SAR` }],
        structuredContent: { hours, price_sar: price, currency: "SAR" },
      };
    }
    const rows = Object.entries(HOUR_PRICING).map(
      ([h, p]) => `${h}h: ${p} SAR`,
    );
    return {
      content: [{ type: "text", text: rows.join("\n") }],
      structuredContent: { pricing: HOUR_PRICING, currency: "SAR" },
    };
  },
});
