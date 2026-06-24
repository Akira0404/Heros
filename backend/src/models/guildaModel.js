import pool from '../config/db.js';

export async function findAll() {
  const [rows] = await pool.query(
    `SELECT g.*,
       COUNT(h.id) as total_herois,
       COALESCE(SUM(h.nivel_poder), 0) as poder_total
     FROM guildas g
     LEFT JOIN herois h ON h.guilda_id = g.id
     GROUP BY g.id
     ORDER BY poder_total DESC`
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM guildas WHERE id = ?', [id]);
  return rows[0];
}

export async function findByUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT DISTINCT g.*,
       COUNT(h.id) as total_herois,
       COALESCE(SUM(h.nivel_poder), 0) as poder_total
     FROM guildas g
     LEFT JOIN herois h ON h.guilda_id = g.id AND h.usuario_id = ?
     GROUP BY g.id
     ORDER BY g.nome`,
    [usuarioId]
  );
  return rows;
}

export async function create({ nome, criador_id }) {
  const [result] = await pool.query(
    'INSERT INTO guildas (nome, criador_id) VALUES (?, ?)',
    [nome, criador_id]
  );
  return { id: result.insertId, nome, criador_id };
}

export async function getHeroisDaGuilda(guildaId, usuarioId) {
  const [rows] = await pool.query(
    `SELECT h.*, g.nome AS nome_guilda, u.nome AS nome_recrutador
     FROM herois h
     INNER JOIN guildas g ON h.guilda_id = g.id
     INNER JOIN usuarios u ON h.usuario_id = u.id
     WHERE h.guilda_id = ? AND h.usuario_id = ?
     ORDER BY h.nome`,
    [guildaId, usuarioId]
  );
  return rows;
}