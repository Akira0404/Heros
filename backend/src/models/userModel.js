import pool from '../config/db.js';

export async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = ?', [id]);
  return rows[0];
}

export async function create({ nome, email, senha }) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha]
  );
  return { id: result.insertId, nome, email };
}

export async function update(id, { nome, email }) {
  await pool.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
}

export async function updateSenha(id, senha) {
  await pool.query('UPDATE usuarios SET senha = ? WHERE id = ?', [senha, id]);
}