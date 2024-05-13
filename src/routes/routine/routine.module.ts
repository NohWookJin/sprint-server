import { Module } from '@nestjs/common'
import { RoutineController } from './routine.controller'
import { RoutineService } from './routine.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Routine } from 'src/entity/routine.entity'
import { User } from 'src/entity/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Routine, User])],
  controllers: [RoutineController],
  providers: [RoutineService]
})
export class RoutineModule {}
