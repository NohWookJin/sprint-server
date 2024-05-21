import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Routine } from './routine.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '이메일' })
  @Column({ unique: true })
  email: string

  @ApiProperty({ description: '닉네임' })
  @Column()
  name: string

  @ApiProperty({ description: '비밀번호' })
  @Column()
  @Exclude()
  password: string

  @ApiProperty({ description: '가입일' })
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty({ description: '뱃지' })
  @Column('simple-array', { default: '' })
  badges: string[]

  @ApiProperty({ description: '레벨' })
  @Column({ default: 'lv1' })
  level: string

  @OneToMany(() => Routine, routine => routine.user)
  routines: Routine[]
}
