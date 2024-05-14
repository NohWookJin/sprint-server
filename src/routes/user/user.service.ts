import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/entity/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { hash, compare } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { LoginUserDto } from './dto/login-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
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

    return this.userRepository.save({
      email,
      name,
      password: encryptPassword
    })
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

  async getUser() {
    return this.userRepository.find()
  }
}
