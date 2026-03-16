import { Pool } from "pg";

export const pool = new Pool({
  user: "user",
  password: "password",
  host: "localhost",
  database: "runneriodb",
  port: 5432,
});

console.log(await pool.query("SELECT * from Player;"));
