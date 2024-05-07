import { Injectable } from '@nestjs/common'
import { UserService } from 'src/routes/user/user.service'
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/entity/user.entity'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email)

    if (user) {
      const match = await compare(password, user.password)
      if (match) {
        return user
      } else {
        return null
      }
    }

    return null
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    }

    return {
      accessToken: this.jwtService.sign(payload)
    }
  }
}
