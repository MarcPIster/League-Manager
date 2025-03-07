import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth';
import cors from 'cors';
import {connectDataBase, SUCCEED} from "./controllers/connectToDatabase";

dotenv.config({ path: './.env' });

async function main() {
  const app = express();
  const PORT = process.env.PORT || 5000;
  const allowedOrigins = process.env.FRONTEND_URL || '';
  app.use(bodyParser.json());


  app.use(cors({
    origin: allowedOrigins,
  }));

  const status = await connectDataBase();
  if (status !== SUCCEED) {
    console.error('Failed to connect to database');
    return;
  }

  app.use('/api/auth', authRouter);
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

try {
  main();
} catch (e) {
  console.error(e);
}