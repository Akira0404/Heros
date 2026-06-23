import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as User from '../models/userModel.js';
import {
  cadastroSchema,
  loginSchema,
  perfilUpdateSchema,
  senhaUpdateSchema,
} from '../validators/authValidator.js';

export async function cadastrar(req, res) {
  try {
    const dados = cadastroSchema.parse(req.body);

    const existente = await User.findByEmail(dados.email);
    if (existente) {
      return res.status(400).json({ erro: 'E-mail já cadastrado' });
    }

    const hash = await bcrypt.hash(dados.senha, 10);
    const usuario = await User.create({ ...dados, senha: hash });

    return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso', usuario });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ erros: err.errors });
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function login(req, res) {
  try {
    const dados = loginSchema.parse(req.body);

    const usuario = await User.findByEmail(dados.email);
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ erros: err.errors });
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function perfil(req, res) {
  try {
    const usuario = await User.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    return res.json(usuario);
  } catch {
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function atualizarPerfil(req, res) {
  try {
    const dados = perfilUpdateSchema.parse(req.body);
    await User.update(req.usuario.id, dados);
    return res.json({ mensagem: 'Perfil atualizado com sucesso' });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ erros: err.errors });
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function atualizarSenha(req, res) {
  try {
    const dados = senhaUpdateSchema.parse(req.body);

    const usuario = await User.findByEmail(req.usuario.email);

    const senhaValida = await bcrypt.compare(dados.senhaAtual, usuario.senha);
    if (!senhaValida) return res.status(400).json({ erro: 'Senha atual incorreta' });

    const novoHash = await bcrypt.hash(dados.novaSenha, 10);
    await User.updateSenha(req.usuario.id, novoHash);

    return res.json({ mensagem: 'Senha alterada com sucesso' });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ erros: err.errors });
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}