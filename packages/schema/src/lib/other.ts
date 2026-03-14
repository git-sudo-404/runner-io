import { z } from "zod";

export const LocationSchema = z.object({
  lat: z.number().optional(),
  lon: z.number().optional(),
});

export type LocationType = z.infer<typeof LocationSchema>;
