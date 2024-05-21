import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserInfo } from 'src/decorators/user-info-decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  signup(@Body(new ValidationPipe()) data: CreateUserDto) {
    return this.userService.createUser(data)
  }

  @Post('login')
  login(@Body(new ValidationPipe()) data: LoginUserDto) {
    return this.userService.login(data)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getUser(@UserInfo() userInfo) {
    return this.userService.getUser(userInfo.id)
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getUserWithBadgesAndLevel(@UserInfo() userInfo) {
    return this.userService.getUserWithBadgesAndLevel(userInfo.id)
  }
}
