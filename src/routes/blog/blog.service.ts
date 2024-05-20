import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, LessThan } from 'typeorm'
import { Blog } from 'src/entity/blog.entity'
import * as moment from 'moment-timezone'
import * as multer from 'multer'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>
  ) {}

  // 전체 블로그 조회
  async findBlogsByRoutine(routineId: number) {
    const todayStart = moment().tz('Asia/Seoul').startOf('day').toDate()
    const todayEnd = moment().tz('Asia/Seoul').endOf('day').toDate()

    const todayBlogs = await this.blogRepository.find({
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
      today: todayBlogs,
      past: this.groupBlogsByDate(pastBlogs)
    }
  }

  // 날짜별 블로그 그룹화
  private groupBlogsByDate(blogs: Blog[]): { [key: string]: Blog[] } {
    return blogs.reduce((acc, blog) => {
      const dateKey = moment(blog.date).tz('Asia/Seoul').format('YYYY-MM-DD')
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(blog)
      return acc
    }, {})
  }

  // 특정 루틴의 오늘의 블로그 조회 및 빈 배열 처리
  async findTodayBlogsByRoutine(routineId: number): Promise<Blog[] | null> {
    const todayStart = moment().tz('Asia/Seoul').startOf('day').toDate()
    const todayEnd = moment().tz('Asia/Seoul').endOf('day').toDate()

    const todayBlogs = await this.blogRepository.find({
      where: {
        routine: { id: routineId },
        date: Between(todayStart, todayEnd)
      },
      order: {
        date: 'ASC'
      }
    })

    return todayBlogs
  }

  // 과거 블로그 글 조회(7일 단위 페이지네이션)
  async findPastBlogs(page: number, routineId: number): Promise<Blog[]> {
    const pageSize = 7
    const skipAmount = (page - 1) * pageSize

    const today = moment().tz('Asia/Seoul').startOf('day').toDate()

    return this.blogRepository.find({
      where: {
        routine: { id: routineId },
        date: LessThan(today)
      },
      order: {
        date: 'DESC'
      },
      take: pageSize,
      skip: skipAmount
    })
  }

  // 블로그 상세 조회 (today와 past를 모두 반환)
  async findBlogById(blogId: number): Promise<{ blog: Blog; today: Blog[] | null; past: { [key: string]: Blog[] } }> {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
      relations: ['routine']
    })

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`)
    }

    const routineId = blog.routine.id
    const { today, past } = await this.findBlogsByRoutine(routineId)

    return {
      blog,
      today,
      past
    }
  }
  private storage = multer.diskStorage({
    destination: (req: Request, file, cb: (error: Error | null, destination: string) => void) => {
      cb(null, 'uploads/')
    },
    filename: (req: Request, file, cb: (error: Error | null, filename: string) => void) => {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null, filename)
    }
  })

  private upload = multer({ storage: this.storage, limits: { fileSize: 3 * 1024 * 1024 } })

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    this.upload.single('image')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Multer error' })
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error' })
      }
      next()
    })
  }

  // 블로그 생성
  async createBlog(routineId: number, title: string, content: string, image?: Express.Multer.File) {
    const blog = new Blog()
    blog.routine = { id: routineId } as any
    blog.title = title
    blog.content = content
    blog.date = moment().tz('Asia/Seoul').toDate()
    if (image) {
      blog.imagePath = image.path
    }
    return await this.blogRepository.save(blog)
  }

  // 블로그 업데이트(수정)
  async updateBlog(blogId: number, title: string, content: string, image?: Express.Multer.File): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id: blogId })
    if (!blog) {
      throw new NotFoundException()
    }

    blog.title = title
    blog.content = content
    if (image) {
      blog.imagePath = image.path
    }
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
  async movePastTodos() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
  }
}
