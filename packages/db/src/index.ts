import { Pool } from "pg";

const pool = new Pool({
  user: "user",
  password: "password",
  host: "localhost",
  database: "runneriodb",
  port: 5432,
});

console.log(await pool.query("SELECT NOW()"));
console.log(await pool.query("desc Player"));
console.log(await pool.query("desc Tick"));
console.log(await pool.query("desc RunSession"));
console.log(await pool.query("desc UserSettings"));
