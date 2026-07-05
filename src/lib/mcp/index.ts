import { defineMcp } from "@lovable.dev/mcp-js";
import getPricingTool from "./tools/get-pricing";
import getWorkingHoursTool from "./tools/get-working-hours";

export default defineMcp({
  name: "newart-studio-mcp",
  title: "NewArt Studio MCP",
  version: "0.1.0",
  instructions:
    "Tools for NewArt Studio's booking platform. Use `get_pricing` for the hourly space-booking price matrix (1–8 hours, SAR) and `get_working_hours` for weekly hours and locations.",
  tools: [getPricingTool, getWorkingHoursTool],
});
