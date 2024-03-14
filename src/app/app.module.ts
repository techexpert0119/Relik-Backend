import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { RouterModule } from 'src/router/router.module';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from 'src/common/auth/guards';
import { MailModule } from 'src/common/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.host'),
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    // Routes
    RouterModule.forRoot(),
    MailModule,
  ],
})
export class AppModule {}
