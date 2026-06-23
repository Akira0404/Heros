import pool from '../config/db.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM guildas ORDER BY nome');
  return rows;
}