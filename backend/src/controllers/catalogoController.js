import catalogoHerois from '../data/catalogoHerois.js';
import * as Heroi from '../models/heroiModel.js';

export function listarCatalogo(req, res) {
  try {
    const { classe, busca } = req.query;
    let resultado = [...catalogoHerois];

    if (classe) {
      resultado = resultado.filter(
        (h) => h.classe.toLowerCase() === classe.toLowerCase()
      );
    }

    if (busca) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(
        (h) =>
          h.nome.toLowerCase().includes(termo) ||
          h.descricao.toLowerCase().includes(termo)
      );
    }

    return res.json(resultado);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function recrutarDoCatalogo(req, res) {
  try {
    const { index, guilda_id } = req.body;
    const heroiCatalogo = catalogoHerois[index];

    if (!heroiCatalogo) {
      return res.status(404).json({ erro: 'Herói do catálogo não encontrado' });
    }

    if (!guilda_id) {
      return res.status(400).json({ erro: 'Selecione uma guilda para o herói' });
    }

    const heroi = await Heroi.create({
      nome: heroiCatalogo.nome,
      classe: heroiCatalogo.classe,
      nivel_poder: heroiCatalogo.nivel_poder,
      avatar_url: heroiCatalogo.avatar_url,
      guilda_id: Number(guilda_id),
      usuario_id: req.usuario.id,
    });

    return res.status(201).json({
      mensagem: `${heroiCatalogo.nome} foi recrutado!`,
      heroi,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}