import pool from '../config/db.js';

export async function findByHeroi(heroiId) {
  const [rows] = await pool.query(
    'SELECT * FROM missoes WHERE heroi_id = ? ORDER BY criado_em DESC',
    [heroiId]
  );
  return rows;
}

export async function create({ descricao, status, recompensa_ouro, heroi_id }) {
  const [result] = await pool.query(
    'INSERT INTO missoes (descricao, status, recompensa_ouro, heroi_id) VALUES (?, ?, ?, ?)',
    [descricao, status || 'Em andamento', recompensa_ouro || 0, heroi_id]
  );
  return { id: result.insertId, descricao, status, recompensa_ouro, heroi_id };
}