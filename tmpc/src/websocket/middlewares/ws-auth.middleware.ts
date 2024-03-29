import http from 'http';
import WebSocket from 'ws';
import { WsErrorCode, WsException } from '../../shared/errors/websocket';
import userService from '../../users/services/user.service';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import Logger from '../../logger';
import tokenService from '../../shared/services/token/token.service';
import querystring from 'querystring';
import { URL } from 'url';

export async function WsAuthMiddleware(
  ws: WebSocket,
  request: http.IncomingMessage,
) {
  const logger = new Logger(WsAuthMiddleware.name);

  const parsedUrl = new URL(
    String(request.url),
    `https://${request.headers.host}`,
  );

  const queryParams = querystring.parse(String(parsedUrl.searchParams));

  logger.log(JSON.stringify({ wsUrl: ws.url, queryParams }));

  const token = <string>queryParams?.ticket;

  if (token == null) {
    logger.log('UNAUTHENTICATED_CLIENT');

    ws.emit(
      'error',
      new WsException(WsErrorCode.UNAUTHENTICATED, 'UNAUTHENTICATED'),
    );

    logger.log('CLOSING_CONNECTION');

    ws.close();

    return;
  }

  try {
    const decoded = await tokenService.verifyAsync<jwt.JwtPayload>(token);

    const user = await userService.getUserById(decoded.id);

    if (user == null) {
      logger.log('UNAUTHENTICATED_CLIENT');

      ws.emit(
        'error',
        new WsException(WsErrorCode.UNAUTHENTICATED, 'UNAUTHENTICATED'),
      );

      logger.log('CLOSING_CONNECTION');

      ws.close();

      return;
    }

    // append user to socket
    (ws as any).user = user;
  } catch (e) {
    switch (true) {
      case e instanceof JsonWebTokenError:
        logger.log('UNAUTHENTICATED_CLIENT');

        ws.emit(
          'error',
          new WsException(WsErrorCode.UNAUTHENTICATED, 'INVALID_TOKEN'),
        );

        logger.log('CLOSING_CONNECTION');

        ws.close();

        break;
      case e instanceof TokenExpiredError:
        logger.log('UNAUTHENTICATED_CLIENT');

        ws.emit(
          'error',
          new WsException(WsErrorCode.UNAUTHENTICATED, 'TOKEN_EXPIRED'),
        );

        logger.log('CLOSING_CONNECTION');

        ws.close();
        break;
      default:
        ws.emit('error', e);
    }
  }
}
