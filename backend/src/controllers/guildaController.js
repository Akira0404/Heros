import * as Guilda from '../models/guildaModel.js';
import * as Heroi from '../models/heroiModel.js';
import { guildaSchema } from '../validators/guildaValidator.js';

export async function listar(req, res) {
  try {
    const guildas = await Guilda.findByUsuario(req.usuario.id);
    return res.json(guildas);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function listarTodas(req, res) {
  try {
    const guildas = await Guilda.findAll();
    return res.json(guildas);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function detalhes(req, res) {
  try {
    const guilda = await Guilda.findById(req.params.id);
    if (!guilda) return res.status(404).json({ erro: 'Guilda não encontrada' });

    const herois = await Guilda.getHeroisDaGuilda(req.params.id, req.usuario.id);
    return res.json({ ...guilda, herois });
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function criar(req, res) {
  try {
    const dados = guildaSchema.parse(req.body);

    const guilda = await Guilda.create({ nome: dados.nome, criador_id: req.usuario.id });
    return res.status(201).json(guilda);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ erros: err.errors });
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function moverHeroi(req, res) {
  try {
    const heroi = await Heroi.findById(req.params.heroiId);
    if (!heroi) return res.status(404).json({ erro: 'Herói não encontrado' });
    if (heroi.usuario_id !== req.usuario.id) return res.status(403).json({ erro: 'Acesso negado' });

    const guilda = await Guilda.findById(Number(req.body.guilda_id));
    if (!guilda) return res.status(404).json({ erro: 'Guilda não encontrada' });

    await Heroi.moverGuilda(req.params.heroiId, req.body.guilda_id);

    return res.json({ mensagem: 'Herói movido para a guilda com sucesso' });
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}