import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, LessThan, MoreThanOrEqual } from 'typeorm'
import { Todo } from 'src/entity/todo.entity'
import * as moment from 'moment-timezone'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) {}

  // 전체 투두 조회
  async findTodosByRoutine(routineId: number) {
    const todayStart = moment.tz('Asia/Seoul').startOf('day').utc().toDate()
    const todayEnd = moment.tz('Asia/Seoul').endOf('day').utc().toDate()

    const todos = await this.todoRepository.find({
      where: {
        routine: { id: routineId },
        date: Between(todayStart, todayEnd)
      }
    })

    const pastTodos = await this.todoRepository.find({
      where: {
        routine: { id: routineId },
        date: LessThan(todayStart)
      },
      order: { date: 'ASC' }
    })

    return {
      today: todos,
      past: this.groupTodosByDate(pastTodos)
    }
  }

  // 특정 루틴의 오늘의 투두 조회 및 빈 배열 처리
  async findTodayTodosByRoutine(routineId: number) {
    const todayStart = moment.tz('Asia/Seoul').startOf('day').utc().toDate()
    const todayEnd = moment.tz('Asia/Seoul').endOf('day').utc().toDate()

    const todayTodos = await this.todoRepository.find({
      where: {
        routine: { id: routineId },
        date: Between(todayStart, todayEnd)
      },
      order: {
        date: 'ASC'
      }
    })

    if (todayTodos.length === 0) {
      return null
    }

    return todayTodos
  }

  // 오늘의 투두 조회
  async findTodayTodos() {
    const startToday = moment.tz('Asia/Seoul').startOf('day').utc().toDate()

    return this.todoRepository.find({
      where: {
        date: MoreThanOrEqual(startToday)
      },
      order: {
        date: 'ASC'
      }
    })
  }

  // 과거 투두 글 조회(7일 단위 페이지네이션)
  async findPastTodos(page: number) {
    const pageSize = 7
    const skipAmount = (page - 1) * pageSize

    const today = moment.tz('Asia/Seoul').startOf('day').utc().toDate()

    return this.todoRepository.find({
      where: {
        date: LessThan(today)
      },
      order: {
        date: 'DESC'
      },
      take: pageSize,
      skip: skipAmount
    })
  }

  // 날짜별 투두 그룹화
  private groupTodosByDate(todos: Todo[]): { [key: string]: Todo[] } {
    return todos.reduce((acc, todo) => {
      const adjustedDate = moment(todo.date).add(9, 'hours')
      const dateKey = adjustedDate.format('YYYY-MM-DD')

      if (!acc[dateKey]) {
        acc[dateKey] = []
      }

      acc[dateKey].push(todo)
      return acc
    }, {})
  }

  // 투두 생성
  async createTodo(routineId: number, content: string) {
    const todo = new Todo()
    todo.routine = { id: routineId } as any
    todo.content = content
    todo.completed = false
    todo.date = moment.tz('Asia/Seoul').utc().toDate()
    return await this.todoRepository.save(todo)
  }

  // 투두 업데이트(수정)
  async updateTodo(todoId: number, content: string, completed: boolean) {
    const todo = await this.todoRepository.findOneBy({ id: todoId })
    if (!todo) {
      throw new NotFoundException()
    }
    todo.content = content
    todo.completed = completed
    return await this.todoRepository.save(todo)
  }

  // 투두 완료 및 완료 취소
  async toggleTodoCompletion(todoId: number, completed: boolean) {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
      relations: ['routine']
    })

    todo.completed = completed
    await this.todoRepository.save(todo)

    return todo
  }

  // 투두 삭제
  async deleteTodo(todoId: number) {
    const todo = await this.todoRepository.findOneBy({ id: todoId })
    if (!todo) {
      throw new NotFoundException()
    }
    await this.todoRepository.remove(todo)
  }

  // seed용(과거)
  async createPastTodo(routineId: number, content: string, date: string, completed: boolean) {
    const todo = new Todo()
    todo.routine = { id: routineId } as any
    todo.content = content
    todo.completed = completed
    todo.date = moment(date).utc().toDate()
    return await this.todoRepository.save(todo)
  }

  // 자정 todo => past로 이동
  async movePastTodos() {
    const today = moment.tz('Asia/Seoul').startOf('day').utc().toDate()
    today.setHours(0, 0, 0, 0)
  }
}
