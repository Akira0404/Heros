import pool from '../config/db.js';

export async function findByUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT h.*, g.nome AS nome_guilda, u.nome AS nome_recrutador
     FROM herois h
     INNER JOIN guildas g ON h.guilda_id = g.id
     INNER JOIN usuarios u ON h.usuario_id = u.id
     WHERE h.usuario_id = ?
     ORDER BY h.criado_em DESC`,
    [usuarioId]
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT h.*, g.nome AS nome_guilda, u.nome AS nome_recrutador
     FROM herois h
     INNER JOIN guildas g ON h.guilda_id = g.id
     INNER JOIN usuarios u ON h.usuario_id = u.id
     WHERE h.id = ?`,
    [id]
  );
  return rows[0];
}

export async function create({ nome, classe, nivel_poder, avatar_url, guilda_id, usuario_id }) {
  const [result] = await pool.query(
    'INSERT INTO herois (nome, classe, nivel_poder, avatar_url, guilda_id, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, classe, nivel_poder, avatar_url, guilda_id, usuario_id]
  );
  return { id: result.insertId, nome, classe, nivel_poder, avatar_url, guilda_id };
}

export async function update(id, { nome, classe, nivel_poder }) {
  await pool.query(
    'UPDATE herois SET nome = ?, classe = ?, nivel_poder = ? WHERE id = ?',
    [nome, classe, nivel_poder, id]
  );
}

export async function remove(id) {
  await pool.query('DELETE FROM herois WHERE id = ?', [id]);
}

export async function getEstatisticas(usuarioId) {
  const [total] = await pool.query(
    'SELECT COUNT(*) as total FROM herois WHERE usuario_id = ?', [usuarioId]
  );
  const [media] = await pool.query(
    'SELECT COALESCE(ROUND(AVG(nivel_poder)), 0) as media FROM herois WHERE usuario_id = ?', [usuarioId]
  );
  const [guilda] = await pool.query(
    `SELECT g.nome, SUM(h.nivel_poder) as poder_total
     FROM herois h
     INNER JOIN guildas g ON h.guilda_id = g.id
     WHERE h.usuario_id = ?
     GROUP BY g.id
     ORDER BY poder_total DESC
     LIMIT 1`,
    [usuarioId]
  );

  return {
    totalHerois: total[0].total,
    mediaPoder: media[0].media,
    guildaMaisForte: guilda[0]?.nome || 'Nenhuma',
  };
}