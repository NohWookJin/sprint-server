import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, LessThan } from 'typeorm'
import { Blog } from 'src/entity/blog.entity'
import * as moment from 'moment-timezone'

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>
  ) {}

  // 전체 블로그
  async findBlogsByRoutine(routineId: number) {
    const todayStart = moment().tz('Asia/Seoul').startOf('day').toDate()
    const todayEnd = moment().tz('Asia/Seoul').endOf('day').toDate()

    const blogs = await this.blogRepository.find({
      where: {
        routine: { id: routineId },
        date: Between(todayStart, todayEnd)
      }
    })

    const pastBlogs = await this.blogRepository.find({
      where: {
        routine: { id: routineId },
        date: LessThan(todayStart)
      },
      order: { date: 'ASC' }
    })

    return {
      today: blogs,
      past: this.groupBlogsByDate(pastBlogs)
    }
  }

  // 날짜별 블로그 그룹화
  private groupBlogsByDate(blogs: Blog[]): { [key: string]: Blog[] } {
    return blogs.reduce((acc, blog) => {
      const dateKey = moment(blog.date).format('YYYY-MM-DD')
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(blog)
      return acc
    }, {})
  }

  // 블로그 생성
  async createBlog(routineId: number, title: string, content: string) {
    const blog = new Blog()
    blog.routine = { id: routineId } as any
    blog.title = title
    blog.content = content
    return await this.blogRepository.save(blog)
  }

  // 블로그 업데이트(수정)
  async updateBlog(blogId: number, title: string, content: string): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id: blogId })
    if (!blog) {
      throw new NotFoundException()
    }

    blog.title = title
    blog.content = content
    return await this.blogRepository.save(blog)
  }

  // 블로그 삭제
  async deleteBlog(blogId: number) {
    const blog = await this.blogRepository.findOneBy({ id: blogId })
    if (!blog) {
      throw new NotFoundException()
    }
    await this.blogRepository.remove(blog)
  }

  // seed용(과거)
  async createPastBlog(routineId: number, title: string, content: string, date: string) {
    const blog = new Blog()
    blog.routine = { id: routineId } as any
    blog.title = title
    blog.content = content
    blog.date = new Date(date)
    return await this.blogRepository.save(blog)
  }

  // 자정 blog => past로 이동
  async movePastBlogs() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
  }
}
