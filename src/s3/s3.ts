import * as fs from 'fs';
import * as path from 'path';

export class S3 {
  private static uploads: Record<string, Buffer[]> = {};

  static initialize(name: string): void {
    if (S3.uploads[name]) {
      throw new Error(`Upload with the name ${name} is already initialized`);
    }
    this.uploads[name] = [];
  }

  static setPart(name: string, index: number, buffer: Buffer): void {
    if (!S3.uploads[name]) {
      throw new Error(`Upload with the name ${name} doesn't exist`);
    }
    S3.uploads[name][index] = buffer;
  }

  static removeUpload(name: string): void {
    if (!S3.uploads[name]) {
      throw new Error(`Upload with the name ${name} doesn't exist`);
    }
    S3.uploads[name] = undefined;
  }

  static finalizeUpload(name: string): void {
    if (!S3.uploads[name]) {
      throw new Error(`Upload with the name ${name} doesn't exist`);
    }
    const writeStream = fs.createWriteStream(path.resolve(`./uploads/${name}`));
    for (const chunk of S3.uploads[name]) {
      writeStream.write(chunk);
    }
    S3.removeUpload(name);
  }
}
