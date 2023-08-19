import WebSocket, { WebSocketServer } from 'ws';
import Logger from '../logger';
import crypto from 'crypto';

const Clients: Record<string, { id: string; messages: string[] }> = {};

type Message = {
  secWsKey: string;
  senderId: string;
  message: string;
  timestamp: Date;
};

const messages: Message[] = [];

const chatSocketServer = new WebSocketServer({ noServer: true });

chatSocketServer.on('connection', (socket, req) => {
  Logger.log(JSON.stringify({ headers: req.headers }));

  socket.on('error', console.error);

  const secWsKey = String(req.headers['sec-websocket-key']);

  let client = Clients[secWsKey];

  if (client == null) {
    client = { id: crypto.randomUUID(), messages: [] };
    Clients[secWsKey] = client;

    messages.reduce((t: Omit<Message, 'secWsKey'>[], msg) => {
      if (msg.secWsKey !== secWsKey) {
        t.push({
          senderId: msg.senderId,
          message: msg.message,
          timestamp: msg.timestamp,
        });
      }

      return t;
    }, []);

    socket.send(JSON.stringify(messages));
  }

  socket.send('connected!');

  socket.on('message', (data, isBinary) => {
    try {
      console.log({ msg: data.toString() });

      client.messages.push(data.toString());

      messages.push({
        secWsKey,
        senderId: client.id,
        message: data.toString(),
        timestamp: new Date(),
      });

      chatSocketServer.clients.forEach((client) => {
        if (client != socket && client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });

      socket.send('received');
    } catch (e) {
      socket.emit('error', e);
      throw e;
    }
  });
});

export default chatSocketServer;
