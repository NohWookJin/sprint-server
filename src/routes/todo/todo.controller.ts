import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { TodoService } from './todo.service'

@Controller('routines/:routineId/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getRoutineTodos(@Param('routineId', ParseIntPipe) routineId: number) {
    return this.todoService.findTodosByRoutine(routineId)
  }

  @Get('past')
  getPastTodos(@Query('page', ParseIntPipe) page: number) {
    return this.todoService.findPastTodos(page)
  }

  @Get('today')
  async getTodayTodos(@Param('routineId', ParseIntPipe) routineId: number) {
    const todayBlogs = await this.todoService.findTodayTodosByRoutine(routineId)
    if (todayBlogs === null) {
      throw new NotFoundException(`No Todos found for today in routine ID ${routineId}`)
    }
    return todayBlogs
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

  @Patch('/:todoId/completion')
  toggleTodoCompletion(@Param('todoId', ParseIntPipe) todoId: number, @Body('completed') completed: boolean) {
    return this.todoService.toggleTodoCompletion(todoId, completed)
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
