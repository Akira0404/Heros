import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import heroiRoutes from './routes/heroiRoutes.js';
import guildaRoutes from './routes/guildaRoutes.js';
import missaoRoutes from './routes/missaoRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/herois', heroiRoutes);
app.use('/api/guildas', guildaRoutes);
app.use('/api/missoes', missaoRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));