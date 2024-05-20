import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
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
  @Column('text')
  content: string

  @ApiProperty({ description: '이미지 경로' })
  @Column({ nullable: true })
  imagePath: string

  @CreateDateColumn()
  date: Date

  @ManyToOne(() => Routine, routine => routine.blogs)
  routine: Routine
}
