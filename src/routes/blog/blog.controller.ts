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

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createBlog(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.blogService.createBlog(routineId, title, content, image)
  }

  @Patch('/:blogId')
  @UseInterceptors(FileInterceptor('image'))
  updateBlog(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Param('blogId', ParseIntPipe) blogId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.blogService.updateBlog(blogId, title, content, image)
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
