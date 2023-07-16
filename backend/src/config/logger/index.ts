import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { level, message, label, timestamp, stack, code } = info;

    if (level == 'error') {
      return `[${level}] [${timestamp}] ${
        code != null ? `[${code}] -> [${message}]` : message
      } ${code == null || code >= 500 ? `$[ERR_STACK] -> ${stack}` : ''}`;
    }

    return `[${level}] -> [${timestamp}] [${label}] -> ${message}`;
  }),
);

const infoLogRotationTransport = new DailyRotateFile({
  filename: './/logs//info',
  datePattern: 'YYYY-MM-DD-HH:MM',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '80d',
  level: 'info',
  extension: '.log',
});

const errorLogRotationTransport = new DailyRotateFile({
  filename: './/logs//error',
  datePattern: 'YYYY-MM-DD-HH:MM',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '80d',
  level: 'error',
  extension: '.log',
});

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    infoLogRotationTransport,
    errorLogRotationTransport,
    new winston.transports.Console(),
  ],
});

export default class Logger {
  constructor(private readonly defaultContext: string) {}
  public static log(message: string | any, context?: string): void {
    logger.info(message, { label: context });
  }

  public static error(err: any): void {
    logger.error(err);
  }

  public log(message: string | any, context?: string) {
    logger.info(message, { label: context ?? this.defaultContext });
  }

  public error(err: any): void {
    logger.error(err);
  }
}
