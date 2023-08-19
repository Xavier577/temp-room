import express from 'express';
import { v1Router } from './routes';
import http from 'http';
import Logger from './logger';
import Env from './shared/utils/env';
import { AppEnv } from './shared/enums';
import cors from 'cors';
import { Mongo } from './mongo';
import { websocketServer } from './websocket/server';

async function main() {
  const app = express();

  await Mongo.connect({ url: Env.get<string>('MONGO_DATABASE_URL') });

  app.use(cors({ origin: 'http://localhost:2000' })); // allow any origin for now
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1', v1Router);

  const server = http.createServer(app);
  const PORT = Env.get<string>('PORT');

  Env.get<string>('NODE_ENV') !== AppEnv.PRODUCTION &&
    server.on('listening', () => {
      console.log(`listening on http://localhost:${PORT}`);
    });

  websocketServer(server);

  server.listen(PORT);
}

main().catch(Logger.error);
