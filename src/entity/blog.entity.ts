import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Routine } from './routine.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '블로그 제목' })
  @Column()
  title: string

  @ApiProperty({ description: '블로그 내용' })
  @Column()
  content: string

  @ManyToOne(() => Routine, routine => routine.blogs)
  routine: Routine
}
