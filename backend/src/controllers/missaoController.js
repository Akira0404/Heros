import * as Missao from '../models/missaoModel.js';
import * as Heroi from '../models/heroiModel.js';
import { missaoSchema } from '../validators/missaoValidator.js';

export async function listarPorHeroi(req, res) {
  try {
    const heroi = await Heroi.findById(req.params.heroiId);
    if (!heroi) return res.status(404).json({ erro: 'Herói não encontrado' });
    if (heroi.usuario_id !== req.usuario.id) return res.status(403).json({ erro: 'Acesso negado' });

    const missoes = await Missao.findByHeroi(req.params.heroiId);
    return res.json(missoes);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function criar(req, res) {
  try {
    const heroi = await Heroi.findById(req.params.heroiId);
    if (!heroi) return res.status(404).json({ erro: 'Herói não encontrado' });
    if (heroi.usuario_id !== req.usuario.id) return res.status(403).json({ erro: 'Acesso negado' });

    const dados = missaoSchema.parse({
      ...req.body,
      recompensa_ouro: req.body.recompensa_ouro ? Number(req.body.recompensa_ouro) : undefined,
    });

    const missao = await Missao.create({ ...dados, heroi_id: Number(req.params.heroiId) });
    return res.status(201).json(missao);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ erros: err.errors });
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}