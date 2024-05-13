import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Routine } from 'src/entity/routine.entity'
import { Repository } from 'typeorm'
import { CreateRoutineDto } from './dto/create-routine.dto'
import { User } from 'src/entity/user.entity'

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>
  ) {}

  async findAllByUserId(userId: number) {
    return this.routineRepository.find({
      where: { userId: userId }
    })
  }

  async create(userId: number, createRoutineDto: CreateRoutineDto) {
    const count = await this.routineRepository.count({
      where: { userId: userId }
    })

    if (count >= 5) {
      throw new UnauthorizedException()
    }

    const routine = new Routine()
    routine.name = createRoutineDto.name
    routine.routineType = createRoutineDto.routineType
    routine.targetCount = createRoutineDto.targetCount
    routine.colorSelection = createRoutineDto.colorSelection
    routine.date = new Date()
    routine.userId = userId

    return this.routineRepository.save(routine)
  }

  async updateRoutineName(routineId: number, newName: string, userId: number) {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId, userId: userId }
    })

    if (!routine) {
      throw new UnauthorizedException()
    }

    routine.name = newName
    await this.routineRepository.save(routine)
    return routine
  }

  async deleteRoutine(routineId: number, userId: number) {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId, userId: userId }
    })

    if (!routine) {
      throw new UnauthorizedException()
    }

    await this.routineRepository.remove(routine)
  }
}
