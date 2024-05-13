import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Todo } from './todo.entity'
import { Blog } from './blog.entity'
import { Past } from './past.entity'
import { Category } from './category.entity'
import { Analysis } from './analysis.entity'

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @ApiProperty({ description: '루틴 이름' })
  @Column()
  name: string

  @ApiProperty({ description: '루틴 생성 날짜' })
  @Column()
  date: Date

  @ApiProperty({ description: '루틴 타입(블로그 또는 투두)' })
  @Column()
  routineType: string

  @ApiProperty({ description: '설정한 루틴 하루 목표 개수' })
  @Column()
  targetCount: number

  @ApiProperty({ description: '루틴 잔디 색상' })
  @Column()
  colorSelection: string

  @OneToMany(() => Past, past => past.routine)
  pasts: Past[]

  @OneToMany(() => Todo, todo => todo.routine)
  todos: Todo[]

  @OneToMany(() => Blog, blog => blog.routine)
  blogs: Blog[]

  @OneToOne(() => Analysis, analysis => analysis.routine)
  analysis: Analysis

  @ManyToOne(() => Category, category => category.routines)
  category: Category[]

  @ManyToOne(() => User, user => user.routines)
  @JoinColumn({ name: 'userId' })
  user: User
}
