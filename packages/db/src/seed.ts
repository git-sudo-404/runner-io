import { v4 as uuidv4 } from "uuid";
import { pool } from "./index.js"; // Adjust if using tsx (e.g., "./index")
import {
  PlayerType,
  RunSessionType,
  TickType,
  UserSettingsType,
} from "@repo/schema";

// --- HELPER FUNCTIONS ---
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) =>
  Math.random() * (max - min) + min;

async function seed() {
  console.log("🌱 Starting massive seeding process (100 Players)...");
  console.log("⏳ This may take 5-15 seconds depending on your machine...\n");

  try {
    // 1. Clean the database
    await pool.query("TRUNCATE Player, RunSession, Tick, UserSettings CASCADE");

    const TOTAL_PLAYERS = 100;
    let totalSessionsCreated = 0;
    let totalTicksCreated = 0;

    // --- LOOP 1: PLAYERS ---
    for (let p = 1; p <= TOTAL_PLAYERS; p++) {
      const playerID = uuidv4();

      // Random starting location (Around New York)
      const startLat = 40.7128 + randomFloat(-0.05, 0.05);
      const startLng = -74.006 + randomFloat(-0.05, 0.05);

      const playerData: PlayerType = {
        playerID: playerID,
        playerName: `Runner_${p}`,
        playerCity: "New York",
        playerCountry: "USA",
        // Note: Using 'lng' here. Change to 'lon' if your Zod schema uses 'lon'!
        location: { lat: startLat, lon: startLng },
        totalRunDistanceSoFar: parseFloat(randomFloat(50, 500).toFixed(2)),
        totalRunTimeSoFar: randomInt(10000, 50000),
        distanceRunToday: parseFloat(randomFloat(0, 10).toFixed(2)),
        runTimeToday: randomInt(0, 3600),
        totalRunsSoFar: randomInt(10, 100),
      };

      await pool.query(
        `INSERT INTO Player (
          playerID, playerName, playerCity, playerCountry, location, 
          totalRunDistanceSoFar, totalRunTimeSoFar, distanceRunToday, runTimeToday, totalRunsSoFar
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          playerData.playerID,
          playerData.playerName,
          playerData.playerCity,
          playerData.playerCountry,
          playerData.location,
          playerData.totalRunDistanceSoFar,
          playerData.totalRunTimeSoFar,
          playerData.distanceRunToday,
          playerData.runTimeToday,
          playerData.totalRunsSoFar,
        ],
      );

      // --- LOOP 1.5: USER SETTINGS ---
      const settingsData: UserSettingsType = {
        playerID: playerID,
        preferredDistanceUnit: Math.random() > 0.5 ? "kilometers" : "miles",
        isProfilePublic: Math.random() > 0.2, // 80% chance of being true
        allowFriendsStatusNotification: true,
      };

      await pool.query(
        `INSERT INTO UserSettings (playerID, preferredDistanceUnit, isProfilePublic, allowFriendsStatusNotification) 
         VALUES ($1, $2, $3, $4)`,
        [
          settingsData.playerID,
          settingsData.preferredDistanceUnit,
          settingsData.isProfilePublic,
          settingsData.allowFriendsStatusNotification,
        ],
      );

      // --- LOOP 2: RUN SESSIONS (5 to 10 per player) ---
      const sessionCount = randomInt(5, 10);

      for (let s = 1; s <= sessionCount; s++) {
        const runSessionID = uuidv4();
        // Generate a random time in the last 30 days
        const startTime = Date.now() - randomInt(100000, 2592000000);
        const duration = randomInt(900, 3600); // 15 to 60 minutes
        const distance = parseFloat(randomFloat(2, 10).toFixed(2));

        const sessionData: RunSessionType = {
          runSessionID: runSessionID,
          playerID: playerID,
          startTime: startTime,
          endtime: startTime + duration * 1000,
          distanceCovered: distance,
          durationInSeconds: duration,
          status: "completed",
        };

        await pool.query(
          `INSERT INTO RunSession (runSessionID, playerID, startTime, endTime, distanceCovered, durationInSeconds, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            sessionData.runSessionID,
            sessionData.playerID,
            sessionData.startTime,
            sessionData.endtime,
            sessionData.distanceCovered,
            sessionData.durationInSeconds,
            sessionData.status,
          ],
        );
        totalSessionsCreated++;

        // --- LOOP 3: TICKS (5 heartbeats per session to show movement) ---
        for (let t = 0; t < 5; t++) {
          const tickData: TickType = {
            playerID: playerID,
            runSessionID: runSessionID,
            // Slightly modify lat/lng to simulate moving during the run
            location: {
              lat: startLat + t * 0.002,
              lon: startLng + t * 0.002,
            },
            timestamp: startTime + t * ((duration * 1000) / 5), // Spaced evenly throughout the run
            accuracy: parseFloat(randomFloat(3, 10).toFixed(1)),
            speed: parseFloat(randomFloat(8, 15).toFixed(1)),
            altitude: parseFloat(randomFloat(10, 50).toFixed(1)),
          };

          await pool.query(
            `INSERT INTO Tick (runSessionID, playerID, location, timestamp, accuracy, speed, altitude) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              tickData.runSessionID,
              tickData.playerID,
              tickData.location,
              tickData.timestamp,
              tickData.accuracy,
              tickData.speed,
              tickData.altitude,
            ],
          );
          totalTicksCreated++;
        }
      }

      // Progress Tracker
      if (p % 10 === 0 || p === TOTAL_PLAYERS) {
        console.log(`✅ Processed ${p}/${TOTAL_PLAYERS} players...`);
      }
    }

    console.log("\n🎉 Seeding Complete!");
    console.log(
      `📊 Stats: 100 Players | ${totalSessionsCreated} Sessions | ${totalTicksCreated} Ticks`,
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await pool.end();
  }
}

seed();
