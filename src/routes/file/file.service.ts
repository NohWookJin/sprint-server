import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class FileService {
  s3Client: S3Client

  constructor(private configService: ConfigService) {
    const region = this.configService.get('AWS_REGION')
    const accessKeyId = this.configService.get('AWS_S3_ACCESS_KEY')
    const secretAccessKey = this.configService.get('AWS_S3_SECRET_ACCESS_KEY')

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
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`
    })

    await this.s3Client.send(command)

    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`
  }
}
