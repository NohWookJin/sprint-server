import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Routine } from './routine.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '투두 내용' })
  @Column()
  content: string

  @ApiProperty({ description: '투두 완료 여부' })
  @Column()
  completed: boolean

  @ManyToOne(() => Routine, routine => routine.todos)
  routine: Routine
}
