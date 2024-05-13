import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Routine } from './routine.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Past {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '과거 날짜' })
  @Column()
  date: Date

  @ManyToOne(() => Routine, routine => routine.pasts)
  routine: Routine
}
