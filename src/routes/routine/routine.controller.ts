import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { CreateRoutineDto } from './dto/create-routine.dto'
import { RoutineService } from './routine.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserInfo } from 'src/decorators/user-info-decorator'

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@UserInfo() userInfo) {
    if (!userInfo) {
      throw new UnauthorizedException()
    }
    return this.routineService.findAllByUserId(userInfo.id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@UserInfo() userInfo, @Body() createRoutineDto: CreateRoutineDto) {
    if (!userInfo) throw new UnauthorizedException()

    return this.routineService.create(userInfo.id, createRoutineDto)
  }

  @Patch(':routineId')
  @UseGuards(JwtAuthGuard)
  async updateRoutineName(
    @Param('routineId', ParseIntPipe) routineId: number,
    @Body('name') newName: string,
    @UserInfo() userInfo
  ) {
    if (!userInfo) {
      throw new UnauthorizedException()
    }
    return this.routineService.updateRoutineName(routineId, newName, userInfo.id)
  }

  @Delete(':routineId')
  @UseGuards(JwtAuthGuard)
  async deleteRoutine(@Param('routineId') routineId: number, @UserInfo() userInfo) {
    if (!userInfo) {
      throw new UnauthorizedException()
    }
    await this.routineService.deleteRoutine(routineId, userInfo.id)
    return null
  }
}
