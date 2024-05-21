import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/entity/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { hash, compare } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as moment from 'moment'
import { LoginUserDto } from './dto/login-user.dto'
import { Routine } from 'src/entity/routine.entity'
import { Analysis } from 'src/entity/analysis.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    @InjectRepository(Analysis)
    private analysisRepository: Repository<Analysis>
  ) {}

  async encryptPassword(password: string) {
    const DEFAULT_SALT = 11
    return hash(password, DEFAULT_SALT)
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneBy({
      email
    })
  }

  // 회원가입
  async createUser(data: CreateUserDto) {
    const { email, name, password } = data

    const encryptPassword = await this.encryptPassword(password)

    const newUser = this.userRepository.create({
      email,
      name,
      password: encryptPassword
    })

    const savedUser = await this.userRepository.save(newUser)

    await this.updateBadgesAndLevel(savedUser.id)

    return savedUser
  }

  // 로그인
  async login(data: LoginUserDto) {
    const { email, password } = data

    const user = await this.getUserByEmail(email)

    if (!user) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND)

    const match = await compare(password, user.password)
    if (!match) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)

    const payload = {
      email,
      name: user.name
    }

    const accessToken = jwt.sign(payload, 'secret_key', {
      expiresIn: '1d'
    })

    return { accessToken }
  }

  async getUser(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'createdAt']
    })
  }

  async getUserWithBadgesAndLevel(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException()
    }

    await this.updateBadgesAndLevel(userId)

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateBadgesAndLevel(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['routines'] })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    const badges = []
    const currentDate = moment().startOf('day')
    const createdAt = moment(user.createdAt).startOf('day')
    const daysSinceCreation = currentDate.diff(createdAt, 'days')

    // 가입일 뱃지
    if (daysSinceCreation >= 0) {
      badges.push('WELCOME')
    }
    if (daysSinceCreation >= 15) {
      badges.push('VIP')
    }

    // 루틴 개수 뱃지
    const routineCount = user.routines.length
    if (routineCount >= 1) {
      badges.push('HUNGER')
    }
    if (routineCount >= 3) {
      badges.push('SATIETY')
    }
    if (routineCount >= 5) {
      badges.push('FULLNESS')
    }

    // continuity 뱃지
    const analyses = await this.analysisRepository.find({ where: { routine: { userId } } })
    const continuityBadges = this.calculateContinuityBadges(analyses)
    badges.push(...continuityBadges)

    user.badges = badges

    // 레벨 계산
    const level = this.calculateLevel(badges.length)
    user.level = level

    await this.userRepository.save(user)
  }

  calculateContinuityBadges(analyses: Analysis[]) {
    const badges = []
    analyses.forEach(analysis => {
      if (analysis.continuity >= 1) {
        badges.push('BEGINNER')
      }
      if (analysis.continuity >= 5) {
        badges.push('AMATEUR')
      }
      if (analysis.continuity >= 10) {
        badges.push('PRO')
      }
      if (analysis.continuity >= 30) {
        badges.push('LEGEND')
      }
    })
    return badges
  }

  calculateLevel(badgeCount: number) {
    if (badgeCount <= 2) {
      return 'lv1'
    }
    if (badgeCount <= 5) {
      return 'lv2'
    }
    if (badgeCount <= 8) {
      return 'lv3'
    }
    return 'lv4'
  }
}
