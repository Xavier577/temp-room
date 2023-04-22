import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModuleFactory, CustomLoader } from '@adminjs/nestjs';
import { PrismaService } from '@database/prisma.service';
import { DatabaseModule } from '@database/database.module';
import AdminResourceBuilder from './resource.builder';

export const adminUIOptions: AdminModuleFactory & CustomLoader = {
  imports: [ConfigModule, DatabaseModule],
  inject: [ConfigService, PrismaService],
  useFactory: async (configService: ConfigService, prisma: PrismaService) => {
    const ADMINJS_ROUTE = configService.get<string>('ADMINJS_ROUTE');

    if (configService.get('NODE_ENV') != 'development') {
      return {
        adminJsOptions: {
          rootPath: ADMINJS_ROUTE,
          loginPath: `${ADMINJS_ROUTE}/login`,
          logoutPath: `${ADMINJS_ROUTE}/logout`,
          branding: {
            companyName: 'TempRoom',
          },
          resources: new AdminResourceBuilder(prisma).build(),
        },
        auth: {
          authenticate: async (email: string, password: string) => {
            if (
              email === configService.get<string>('DEFAULT_ADMIN_USERNAME') &&
              password === configService.get<string>('DEFAULT_ADMIN_PASSWORD')
            ) {
              return {
                email: configService.get<string>('DEFAULT_ADMIN_USERNAME'),
              };
            }
            return null;
          },
          cookieName: configService.get<string>('ADMINJS_COOKIE_NAME'),
          cookiePassword: configService.get<string>('ADMINJS_COOKIE_SECRET'),
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: configService.get<string>('ADMINJS_COOKIE_SECRET'),
        },
      };
    }

    return {
      adminJsOptions: {
        rootPath: ADMINJS_ROUTE,
        branding: {
          companyName: 'TempRoom',
        },
        resources: new AdminResourceBuilder(prisma).build(),
      },
    };
  },
};
