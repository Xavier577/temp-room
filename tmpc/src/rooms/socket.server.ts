import { WebSocketServer } from 'ws';

const roomSocketServer = new WebSocketServer({ noServer: true });

export default roomSocketServer;
