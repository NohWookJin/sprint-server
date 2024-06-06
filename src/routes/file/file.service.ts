import { Injectable } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { config } from 'dotenv'

config({ path: '.env.production' })

@Injectable()
export class FileService {
  s3Client: S3Client

  constructor() {
    const region = 'ap-northeast-2'
    const accessKeyId = process.env.AWS_S3_ACCESS_KEY
    const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })
  }

  async imageUploadToS3(fileName: string, file: Express.Multer.File, ext: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`
    })

    await this.s3Client.send(command)

    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`
  }
}
