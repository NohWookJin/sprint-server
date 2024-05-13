import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { Routine } from './routine.entity'

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @Column()
  completed: boolean

  @CreateDateColumn()
  date: Date

  @ManyToOne(() => Routine, routine => routine.todos)
  routine: Routine
}
