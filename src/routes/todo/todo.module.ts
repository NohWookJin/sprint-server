import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoService } from './todo.service'
import { TodoController } from './todo.controller'
import { Todo } from 'src/entity/todo.entity'
import { Routine } from 'src/entity/routine.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Routine])],
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}
