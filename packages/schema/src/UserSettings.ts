// This file contains the shcema and types for the user prefernce / settings .

import { z } from "zod";

export const UserSettingsSchema = z.object({
  playerID: z.string().uuid(),

  preferredDistanceUnit: z.enum(["kilometers", "miles"]).default("kilometers"),

  isProfilePublic: z.boolean().default(true),

  allowFriendsStatusNotification: z.boolean().default(true),
});

export type UserSettingsType = z.infer<typeof UserSettingsSchema>;
