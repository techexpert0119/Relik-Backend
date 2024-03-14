import { Injectable } from '@nestjs/common';
import bytes from 'bytes';
import { writeFileSync, readFileSync } from 'fs';

@Injectable()
export class HelperFileService {
  convertToBytes(megabytes: string): number {
    return bytes(megabytes);
  }

  createJson(path: string, data: Record<string, any>[]): boolean {
    const sData = JSON.stringify(data);
    writeFileSync(path, sData);

    return true;
  }
  readJson(path: string): Record<string, any>[] {
    const data: string = readFileSync(path, 'utf8');
    return JSON.parse(data);
  }
}
