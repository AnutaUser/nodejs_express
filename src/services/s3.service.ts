import path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { UploadedFile } from 'express-fileupload';
import { v4 } from 'uuid';

import { configs } from '../configs';

class S3Service {
  constructor(
    private client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_ACCESS_KEY,
      },
    })
  ) {}

  public async uploadFile(
    file: UploadedFile,
    itemType: 'user',
    itemId: string
  ): Promise<string> {
    const filePath = this.pathBuilder(itemType, itemId, file.name);

    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Key: filePath,
        Body: file.data,
        ACL: configs.AWS_S3_ACL,
        ContentType: file.mimetype,
      })
    );
    return filePath;
  }

  public async deleteFile(filePath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Key: filePath,
      })
    );
  }

  private pathBuilder(type: string, id: string, fileName: string): string {
    return `${type}/${id}/${v4()}${path.extname(fileName)}`;
  }
}

export const s3Service = new S3Service();
