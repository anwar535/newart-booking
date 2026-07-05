import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_working_hours",
  title: "Get studio working hours",
  description: "Return NewArt Studio's weekly working hours and locations.",
  inputSchema: {} as Record<string, z.ZodTypeAny>,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: "NewArt Studio — Sat–Thu 9:00–22:00, Fri 16:00–22:00. Locations: Riyadh, Jeddah, Online.",
      },
    ],
    structuredContent: {
      hours: {
        sat_thu: { open: "09:00", close: "22:00" },
        fri: { open: "16:00", close: "22:00" },
      },
      locations: ["Riyadh", "Jeddah", "Online"],
      closing_time: "22:00",
    },
  }),
});
