import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import envValidator from '@common/validators/env.validator';
import { ConfigModule } from '@nestjs/config';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';
import { AdminModule as AdminJsModule } from '@adminjs/nestjs';
import { adminUIOptions } from '@admin-ui/options';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseLoggerInterceptor } from '@common/interceptors/response-logger.interceptor';
import { ErrorInterceptor } from '@common/interceptors/error.interceptor';
import { NestModule } from '@nestjs/common';
import { RequestLogger } from '@common/middlewares/request-logger.middleware';
import { AuthenticationModule } from './api/authentication/authentication.module';
import { UsersModule } from './api/users/users.module';
import { RoomsModule } from './api/rooms/rooms.module';
import { ChatModule } from './api/chat/chat.module';

AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    AdminJsModule.createAdminAsync(adminUIOptions),
    ConfigModule.forRoot({ validationSchema: envValidator }),
    DatabaseModule,
    AuthenticationModule,
    UsersModule,
    RoomsModule,
    ChatModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseLoggerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLogger)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
