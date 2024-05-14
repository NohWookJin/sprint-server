import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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

  @OneToMany(() => Routine, routine => routine.user)
  routines: Routine[]
}
