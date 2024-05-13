import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { Routine } from './routine.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Analysis {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '루틴 생성일 기준 달성 평균치' })
  @Column()
  average: number

  @ApiProperty({ description: '루틴 생성일' })
  @Column()
  startWith: Date

  @ApiProperty({ description: '루틴에서 최신 날짜 기준으로 연속 달성 횟수' })
  @Column()
  continuity: number

  @OneToOne(() => Routine, routine => routine.analysis)
  @JoinColumn()
  routine: Routine
}
