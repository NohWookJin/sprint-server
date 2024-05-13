import { Controller, Post, Body, Param, ParseIntPipe, Get, Delete, Patch } from '@nestjs/common'
import { BlogService } from './blog.service'

@Controller('routines/:routineId/blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  getRoutineBlogs(@Param('routineId', ParseIntPipe) routineId: number) {
    return this.blogService.findBlogsByRoutine(routineId)
  }

  @Post()
  createBlog(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Body('title') title: string,
    @Body('content') content: string
  ) {
    return this.blogService.createBlog(routineId, title, content)
  }

  @Patch('/:blogId')
  updateBlog(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Param('blogId', ParseIntPipe) blogId: number,
    @Body('title') title: string,
    @Body('content') content: string
  ) {
    return this.blogService.updateBlog(blogId, title, content)
  }

  @Delete('/:blogId')
  deleteBlog(@Param('blogId', ParseIntPipe) blogId: number) {
    return this.blogService.deleteBlog(blogId)
  }

  // seed용(과거)
  @Post('create-past')
  createPastTodo(
    @Body('routineId') routineId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('date') date: string
  ) {
    return this.blogService.createPastBlog(routineId, title, content, date)
  }
}
