import { Request } from 'express';
// @ts-ignore
import DeviceDetector from 'device-detector-js';
import BotDetector from 'device-detector-js/dist/parsers/bot';

export default function requestParser(req: Request) {
  const deviceDetector = new DeviceDetector();
  const botDetector = new BotDetector();

  const bot = botDetector.parse(String(req.headers['user-agent']));

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
    params: req.params,
    query: req.query,
    session: (req as any)?.['session'],
    clientInfo: {
      ip: req.socket.remoteAddress,
      ipVersion: req.socket.remoteFamily,
      ...deviceDetector.parse(String(req.headers['user-agent'])),
    },
    isBot: bot != null,
    date: new Date(),
  };
}
