import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlogService } from './blog.service'
import { BlogController } from './blog.controller'
import { Blog } from 'src/entity/blog.entity'
import { FileModule } from '../file/file.module'
import { UtilModule } from 'src/util/util.module'

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), FileModule, UtilModule],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
