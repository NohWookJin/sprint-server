import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateBlogDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string

  @IsOptional()
  @IsString()
  imagePath?: string
}
