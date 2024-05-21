import { Module } from '@nestjs/common'
import { RoutineController } from './routine.controller'
import { RoutineService } from './routine.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Routine } from 'src/entity/routine.entity'
import { User } from 'src/entity/user.entity'
import { Todo } from 'src/entity/todo.entity'
import { Analysis } from 'src/entity/analysis.entity'
import { Blog } from 'src/entity/blog.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Routine, User, Todo, Blog, Analysis])],
  controllers: [RoutineController],
  providers: [RoutineService],
  exports: [TypeOrmModule]
})
export class RoutineModule {}
