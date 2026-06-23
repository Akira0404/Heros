import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const [, token] = header.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}