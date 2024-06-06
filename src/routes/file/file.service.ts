import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class FileService {
  s3Client: S3Client

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY')
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

    // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
    await this.s3Client.send(command)

    // 업로드된 이미지의 URL을 반환합니다.
    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`
  }
}
