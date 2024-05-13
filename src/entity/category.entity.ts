import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Routine } from './routine.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '루틴 이름' })
  @Column()
  name: string

  @ApiProperty({ description: '루틴 타입' })
  @Column()
  routineType: string

  @OneToMany(() => Routine, routine => routine.category)
  routines: Routine[]
}
