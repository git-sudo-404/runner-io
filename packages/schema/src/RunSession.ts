import { z } from "zod";

export const RunSessionSchema = z.object({
  playerID: z.string().uuid(),
  runSessionID: z.string().uuid(),

  startTime: z.number().int(),
  endtime: z.number().int(),

  distanceCovered: z.number().nonnegative(),
  durationInSeconds: z.number().int(),

  status: z.enum(["active", "paused", "aborted", "completed"]),
});

export type RunSessionType = z.infer<typeof RunSessionSchema>;
