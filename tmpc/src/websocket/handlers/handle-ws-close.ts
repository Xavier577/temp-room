import Logger from '../../logger';

export function handleWsClose() {
  const logger = new Logger('WS_CLOSE_HANDLER');

  logger.log('CONNECTION_CLOSED');
}