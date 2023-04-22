import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

export function SwaggerInit(
  app: INestApplication,
  // eslint-disable-next-line @typescript-eslint/ban-types
  modules?: Function[],
) {
  const config = new DocumentBuilder()
    .setTitle('TempRoom API')
    .setDescription('Swagger documentation for TempRoom API')
    .setVersion('1.0')
    .addTag('Api')
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'TempRoom Api',
    useGlobalPrefix: false,
  };

  const configService = app.get(ConfigService);

  const NODE_ENV = configService.get<string>('NODE_ENV');

  const swaggerRoute = configService.get<string>('SWAGGER_ROUTE');

  const document = SwaggerModule.createDocument(app, config, {
    include: modules,
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });

  if (NODE_ENV != 'development') {
    const DEFAULT_ADMIN_USERNAME = configService.get<string>(
      'DEFAULT_ADMIN_USERNAME',
    );

    const DEFAULT_ADMIN_PASSWORD = configService.get<string>(
      'DEFAULT_ADMIN_PASSWORD',
    );

    app.use(
      swaggerRoute,
      basicAuth({
        challenge: true,
        users: { [DEFAULT_ADMIN_USERNAME]: DEFAULT_ADMIN_PASSWORD },
      }),
    );
  }

  SwaggerModule.setup(swaggerRoute, app, document, customOptions);
}
