import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidatorPipe implements PipeTransform {
  constructor(private readonly maxSize: number) {}

  transform(value: Express.Multer.File) {
    if (value && value.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds the limit: ${this.maxSize / 1024 / 1024} mb.`
      );
    }
    return value;
  }
}
