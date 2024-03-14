import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from '../entities/file.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class FileService {
  private readonly s3Client = new S3Client({
    region: this.configService.get<string>('aws.s3.region'),
  });

  constructor(
    @InjectModel(File.name) private fileEntity: Model<File>,
    private readonly configService: ConfigService
  ) {}

  async uploadImage(
    fileName: string,
    file: Buffer,
    mimeType: string,
    size: number,
    userId: string
  ) {
    const type = fileName.split('.').pop();

    if (!type) {
      throw new BadRequestException('File type could not be extracted');
    }

    const uuid = randomUUID();
    const key = `${userId}/${Date.now()}-${uuid}.${type}`;
    const bucket = this.configService.get<string>('aws.s3.bucket');

    try {
      const response: PutObjectCommandOutput = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file,
          ContentType: mimeType,
        })
      );

      if (response.$metadata.httpStatusCode === 200) {
        const file = new this.fileEntity();
        file.orginalName = fileName;
        file.url = key;
        file.mimeType = mimeType;
        file.size = size;
        await file.save();
        return file;
      }

      throw new Error('Error occured during uploading a file');
    } catch (err) {
      throw new ConflictException('File can not be uploaded');
    }
  }

  async uploadFile(
    fileName: string,
    file: Buffer,
    mimeType: string,
    size: number,
    userId: string
  ) {
    const type = fileName.split('.').pop();

    if (!type) {
      throw new BadRequestException('File type could not be extracted');
    }

    const uuid = randomUUID();
    const key = `${userId}/${Date.now()}-${uuid}.${type}`;
    const bucket = this.configService.get<string>('aws.s3.bucket');

    try {
      const response: PutObjectCommandOutput = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file,
          ContentType: mimeType,
        })
      );

      if (response.$metadata.httpStatusCode === 200) {
        const file = new this.fileEntity();
        file.orginalName = fileName;
        file.url = key;
        file.mimeType = mimeType;
        file.size = size;
        await file.save();
        return file;
      }

      throw new Error('Error occured during uploading a file');
    } catch (err) {
      throw new ConflictException('File can not be uploaded');
    }
  }
}
