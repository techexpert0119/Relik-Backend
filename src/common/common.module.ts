import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from 'src/common/helper/helper.module';
import { ErrorModule } from 'src/common/error/error.module';
import { ResponseModule } from 'src/common/response/response.module';
import { RequestModule } from 'src/common/request/request.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { MessageModule } from 'src/common/message/message.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import Joi from 'joi';
import { ENUM_MESSAGE_LANGUAGE } from './message/constants/message.enum.constant';
import configs from 'src/configs';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseOptionsService } from 'src/common/database/services/database.options.service';
import { DatabaseOptionsModule } from 'src/common/database/database.options.module';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { SessionModule } from '../modules/session/session.module';
import { ValidateEmailModule } from './validate-email/validate-email.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required() ?? 'relik',
        APP_ENV: Joi.string()
          .valid(...Object.values(ENUM_APP_ENVIRONMENT))
          .default('development')
          .required(),
        APP_LANGUAGE: Joi.string()
          .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
          .default(APP_LANGUAGE)
          .required(),

        HTTP_PORT: Joi.number().default(3000).required(),
        DATABASE_URL_MAIN: Joi.string()
          .default('mongodb://localhost:27017')
          .required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseOptionsModule],
      inject: [DatabaseOptionsService],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createOptions(),
    }),
    MessageModule,
    HelperModule,
    PaginationModule,
    ErrorModule,
    ResponseModule,
    RequestModule,
    LoggerModule,
    AuthModule,
    SessionModule,
    ValidateEmailModule,
  ],
})
export class CommonModule {}
