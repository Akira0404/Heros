import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import heroiRoutes from './routes/heroiRoutes.js';
import guildaRoutes from './routes/guildaRoutes.js';
import missaoRoutes from './routes/missaoRoutes.js';
import catalogoRoutes from './routes/catalogoRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
  ],
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/herois', heroiRoutes);
app.use('/api/guildas', guildaRoutes);
app.use('/api/missoes', missaoRoutes);
app.use('/api/catalogo', catalogoRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));