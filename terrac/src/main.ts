import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerInit } from './swagger';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const infoLogRotationTransport = new DailyRotateFile({
    filename: './/logs//info',
    datePattern: 'YYYY-MM-DD-HH:MM',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '80d',
    level: 'info',
    extension: '.log',
  });

  const errorLogRotationTransport = new DailyRotateFile({
    filename: './/logs//error',
    datePattern: 'YYYY-MM-DD-HH:MM',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '80d',
    level: 'error',
    extension: '.log',
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.prettyPrint(),
      ),
      transports: [
        infoLogRotationTransport,
        errorLogRotationTransport,
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('app'),
          ),
        }),
      ],
    }),
  });

  const configService = app.get(ConfigService);

  const PORT = configService.get<string>('PORT');

  SwaggerInit(app);

  await app.listen(PORT);

  const appUrl = await app.getUrl();

  Logger.log(`app is running on ${appUrl}`, 'NestApplication');
}

bootstrap();
