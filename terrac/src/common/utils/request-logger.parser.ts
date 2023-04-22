import { Request } from 'express';
import * as DeviceDetector from 'device-detector-js';
import * as BotDetector from 'device-detector-js/dist/parsers/bot';

export default async function requestParser(req: Request) {
  const deviceDetector = new DeviceDetector();
  const botDetector = new BotDetector();

  const bot = botDetector.parse(req.headers['user-agent']);

  const headers = { ...req.headers };

  delete headers['authorization'];

  const body = { ...req.body };

  const passwdRegex = /(password|pin|token)/i;

  const filteredRequestBody: { [name: string]: any } = {};

  for (const field in body) {
    const containsSensitive = passwdRegex.test(field);

    if (!containsSensitive) {
      filteredRequestBody[field] = body[field];
    }
  }

  return {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers,
    body: filteredRequestBody,
    sessionUser: req.session?.['user'],
    clientInfo: {
      ip: req.socket.remoteAddress,
      ipVersion: req.socket.remoteFamily,
      ...deviceDetector.parse(req.headers['user-agent']),
    },
    isBot: bot != null,
    date: new Date(),
  };
}
