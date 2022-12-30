import { Controller, Post, Req } from '@nestjs/common';
import * as busboy from 'busboy';
import { AppService } from './app.service';
import { S3 } from './s3';

@Controller('upload-file')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getHello(@Req() req: any): Promise<void> {
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      S3.initialize(filename);
      let bufferIndex = 0;
      console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType,
      );
      file
        .on('data', (data) => {
          S3.setPart(filename, bufferIndex, data);
          bufferIndex++;
        })
        .on('close', () => {
          console.log(`File [${name}] done`);
          S3.finalizeUpload(filename);
        });
    });
    bb.on('close', () => {
      console.log('Done parsing form!');
    });
    req.pipe(bb);
  }
}
