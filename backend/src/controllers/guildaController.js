import * as Guilda from '../models/guildaModel.js';

export async function listar(req, res) {
  try {
    const guildas = await Guilda.findAll();
    return res.json(guildas);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}