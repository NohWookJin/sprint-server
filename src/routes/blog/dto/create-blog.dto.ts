import { IsNotEmpty } from 'class-validator'

export class CreateBlogDto {
  @IsNotEmpty()
  routineId: number

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string
}
