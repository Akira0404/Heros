import * as Heroi from '../models/heroiModel.js';
import { heroiSchema, heroiUpdateSchema } from '../validators/heroiValidator.js';

export async function listar(req, res) {
  try {
    const herois = await Heroi.findByUsuario(req.usuario.id);
    return res.json(herois);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function detalhes(req, res) {
  try {
    const heroi = await Heroi.findById(req.params.id);
    if (!heroi) return res.status(404).json({ erro: 'Herói não encontrado' });
    if (heroi.usuario_id !== req.usuario.id) return res.status(403).json({ erro: 'Acesso negado' });
    return res.json(heroi);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function criar(req, res) {
  try {
    const dados = heroiSchema.parse({
      ...req.body,
      nivel_poder: Number(req.body.nivel_poder),
      guilda_id: Number(req.body.guilda_id),
    });

    const heroi = await Heroi.create({ ...dados, usuario_id: req.usuario.id });
    return res.status(201).json(heroi);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ erros: err.errors });
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function atualizar(req, res) {
  try {
    const dados = heroiUpdateSchema.parse({
      ...req.body,
      nivel_poder: Number(req.body.nivel_poder),
    });

    const heroi = await Heroi.findById(req.params.id);
    if (!heroi) return res.status(404).json({ erro: 'Herói não encontrado' });
    if (heroi.usuario_id !== req.usuario.id) return res.status(403).json({ erro: 'Acesso negado' });

    await Heroi.update(req.params.id, dados);
    return res.json({ mensagem: 'Herói atualizado com sucesso' });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ erros: err.errors });
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function remover(req, res) {
  try {
    const heroi = await Heroi.findById(req.params.id);
    if (!heroi) return res.status(404).json({ erro: 'Herói não encontrado' });
    if (heroi.usuario_id !== req.usuario.id) return res.status(403).json({ erro: 'Acesso negado' });

    await Heroi.remove(req.params.id);
    return res.json({ mensagem: 'Herói dispensado com sucesso' });
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function estatisticas(req, res) {
  try {
    const stats = await Heroi.getEstatisticas(req.usuario.id);
    return res.json(stats);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}