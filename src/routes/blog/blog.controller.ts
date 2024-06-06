import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Delete,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { BlogService } from './blog.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'

@Controller('routines/:routineId/blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  getRoutineBlogs(@Param('routineId', ParseIntPipe) routineId: number) {
    return this.blogService.findBlogsByRoutine(routineId)
  }

  @Get('past')
  getPastBlogs(@Query('page', ParseIntPipe) page: number, @Param('routineId', ParseIntPipe) routineId: number) {
    return this.blogService.findPastBlogs(page, routineId)
  }

  @Get('today')
  async getTodayBlogs(@Param('routineId', ParseIntPipe) routineId: number) {
    const todayBlogs = await this.blogService.findTodayBlogsByRoutine(routineId)

    return todayBlogs
  }

  @Get(':blogId')
  getBlogById(@Param('blogId', ParseIntPipe) blogId: number) {
    return this.blogService.findBlogById(blogId)
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async saveImage(@UploadedFile() file: Express.Multer.File) {
    return await this.blogService.imageUpload(file)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createBlog(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() imageFile: Express.Multer.File
  ) {
    const { title, content } = createBlogDto

    return this.blogService.createBlog(routineId, title, content, imageFile)
  }

  @Patch('/:blogId')
  @UseInterceptors(FileInterceptor('image'))
  async updateBlog(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Param('blogId', ParseIntPipe) blogId: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() imageFile: Express.Multer.File
  ) {
    const { title, content } = updateBlogDto
    return this.blogService.updateBlog(blogId, title, content, imageFile)
  }

  @Delete('/:blogId')
  deleteBlog(@Param('blogId', ParseIntPipe) blogId: number) {
    return this.blogService.deleteBlog(blogId)
  }

  // seed용(과거)
  @Post('create-past')
  createPastBlog(
    @Body('routineId') routineId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('date') date: string
  ) {
    return this.blogService.createPastBlog(routineId, title, content, date)
  }
}
