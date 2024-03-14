import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IDatabaseOptionsService } from 'src/common/database/interfaces/database.options-service.interface';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

@Injectable()
export class DatabaseOptionsService implements IDatabaseOptionsService {
  constructor(private readonly configService: ConfigService) {}

  createOptions(): MongooseModuleOptions {
    const env = this.configService.get<string>('app.env');
    const host = this.configService.get<string>('database.host');
    let uri = `${host}`;
    const mongooseOptions: MongooseModuleOptions = {
      uri,
      serverSelectionTimeoutMS: 5000,
      autoCreate: true,
    };
    return mongooseOptions;
  }
}
