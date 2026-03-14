// This file contains the schema & types for the Player stats
// This is the info of the player

import { z } from "zod";
import { LocationSchema } from "./lib/other.js";

export const PlayerSchema = z.object({
  playerID: z.string().uuid(),
  playerName: z.string(),

  playerCity: z.string(),
  playerCountry: z.string(),
  location: LocationSchema,

  totalRunDistanceSoFar: z.number().nonnegative(),
  totalRunTimeSoFar: z.number().nonnegative(),

  distanceRunToday: z.number().nonnegative(),
  runTimeToday: z.number().nonnegative(),

  totalRunsSoFar: z.number().nonnegative(),
});

export type PlayerType = z.infer<typeof PlayerSchema>;
