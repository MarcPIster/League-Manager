// Backend/src/app.ts
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth';
import playerRouter from './routes/player';
import gameRouter from './routes/game';
import teamRouter from './routes/teams';
import { importData } from './utils/importData';
import cors from 'cors';
import { connectDataBase, SUCCEED } from "./controllers/connectToDatabase";

dotenv.config({ path: './.env' });

async function main() {
  const app = express();
  const PORT = process.env.PORT || 5000;
  const allowedOrigins = process.env.FRONTEND_URL || '';

  // Middleware
  app.use(bodyParser.json());
  app.use(cors({
    origin: allowedOrigins,
  }));

  // Connect to database
  const status = await connectDataBase();
  if (status !== SUCCEED) {
    console.error('Failed to connect to database');
    return;
  }
  await importData();

  // Register routes
  app.use('/api/auth', authRouter);
  app.use('/api/players', playerRouter);
  app.use('/api/games', gameRouter);
  app.use('/api/teams', teamRouter);

  // Global error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

try {
  main();
} catch (e) {
  console.error(e);
}