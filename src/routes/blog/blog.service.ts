import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, LessThan } from 'typeorm'
import { Blog } from 'src/entity/blog.entity'
import * as moment from 'moment-timezone'
import { FileService } from '../file/file.service'
import { UtilService } from 'src/util/util.service'

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private readonly fileService: FileService,
    private readonly utilService: UtilService
  ) {}

  // 전체 블로그 조회
  async findBlogsByRoutine(routineId: number) {
    const todayStart = moment.tz('Asia/Seoul').startOf('day').utc().toDate()
    const todayEnd = moment.tz('Asia/Seoul').endOf('day').utc().toDate()

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
      const adjustedDate = moment(blog.date).add(9, 'hours')
      const dateKey = adjustedDate.format('YYYY-MM-DD')

      if (!acc[dateKey]) {
        acc[dateKey] = []
      }

      acc[dateKey].push(blog)
      return acc
    }, {})
  }

  // 특정 루틴의 오늘의 블로그 조회 및 빈 배열 처리
  async findTodayBlogsByRoutine(routineId: number): Promise<Blog[] | null> {
    const todayStart = moment.tz('Asia/Seoul').startOf('day').utc().toDate()
    const todayEnd = moment.tz('Asia/Seoul').endOf('day').utc().toDate()

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

    const today = moment.tz('Asia/Seoul').startOf('day').utc().toDate()

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

  async saveImage(file: Express.Multer.File) {
    return await this.imageUpload(file)
  }

  async imageUpload(file: Express.Multer.File) {
    const imageName = this.utilService.getUUID()
    const ext = file.originalname.split('.').pop()

    const imageUrl = await this.fileService.imageUploadToS3(`${imageName}.${ext}`, file, ext)

    console.log(imageUrl)

    return { imageUrl }
  }

  // 블로그 생성
  async createBlog(routineId: number, title: string, content: string, imageFile?: Express.Multer.File) {
    let imageUrl: string | undefined
    if (imageFile) {
      const { imageUrl: uploadedImageUrl } = await this.imageUpload(imageFile)
      imageUrl = uploadedImageUrl
    }

    const blog = new Blog()

    blog.routine = { id: routineId } as any
    blog.title = title
    blog.content = content
    blog.date = moment().tz('Asia/Seoul').utc().toDate()

    if (imageUrl) {
      blog.imagePath = imageUrl
    }
    return await this.blogRepository.save(blog)
  }

  // 블로그 업데이트(수정)
  async updateBlog(blogId: number, title: string, content: string, imageFile?: Express.Multer.File): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id: blogId })

    if (!blog) {
      throw new NotFoundException()
    }

    let imageUrl: string | undefined
    if (imageFile) {
      const { imageUrl: uploadedImageUrl } = await this.imageUpload(imageFile)
      imageUrl = uploadedImageUrl
    }

    blog.title = title
    blog.content = content

    if (imageUrl) {
      blog.imagePath = imageUrl
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
    blog.date = moment(date).tz('Asia/Seoul').utc().toDate()
    return await this.blogRepository.save(blog)
  }

  // 자정 blog => past로 이동
  async movePastTodos() {
    const today = moment.tz('Asia/Seoul').startOf('day').utc().toDate()
    today.setHours(0, 0, 0, 0)
  }
}
