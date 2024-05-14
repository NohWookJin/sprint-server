import { ApiProperty } from '@nestjs/swagger'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class DailyRoutine {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '오늘의 날짜' })
  @Column()
  date: Date
}
