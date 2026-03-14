// This File contains the Schema & Types for the heartbeat signal sent by the player during a run
// This is the micro signal that's sent like every few seconds during a run

import { z } from "zod";
import { LocationSchema } from "./lib/other.js";

export const TickSchema = z.object({
  playerID: z.string().uuid(),
  location: LocationSchema,

  runSessionID: z.string().uuid(),

  timestamp: z.number().positive().int(),
  accuracy: z.number().nonnegative(),

  speed: z.number().nonnegative().optional(),
  altitude: z.number().optional(),
});

export type TickType = z.infer<typeof TickSchema>;
