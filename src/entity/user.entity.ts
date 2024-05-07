import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer'

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
}
