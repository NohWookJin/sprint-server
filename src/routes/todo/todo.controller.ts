import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { TodoService } from './todo.service'

@Controller('routines/:routineId/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getRoutineTodos(@Param('routineId', ParseIntPipe) routineId: number) {
    return this.todoService.findTodosByRoutine(routineId)
  }

  @Post()
  createTodo(@Param('routineId', ParseIntPipe) routineId: number, @Body('content') content: string) {
    return this.todoService.createTodo(routineId, content)
  }

  @Patch('/:todoId')
  updateTodo(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body('content') content: string,
    @Body('completed') completed: boolean
  ) {
    return this.todoService.updateTodo(todoId, content, completed)
  }

  @Delete('/:todoId')
  deleteTodo(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.deleteTodo(todoId)
  }

  // seed용(과거)
  @Post('create-past')
  createPastTodo(
    @Body('routineId') routineId: number,
    @Body('content') content: string,
    @Body('date') date: string,
    @Body('completed') completed: boolean
  ) {
    return this.todoService.createPastTodo(routineId, content, date, completed)
  }
}
