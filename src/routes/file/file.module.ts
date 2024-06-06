import { Module } from '@nestjs/common'
import ConfigModule from '../../config/index'
import { FileService } from './file.service'

@Module({
  imports: [ConfigModule()],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
