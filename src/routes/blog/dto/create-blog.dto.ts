import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBlogDto {
  @IsNotEmpty()
  routineId: number

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string

  @IsOptional()
  @IsString()
  imagePath?: string
}
