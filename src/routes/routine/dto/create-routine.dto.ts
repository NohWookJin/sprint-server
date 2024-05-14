import { IsNotEmpty, IsNumber, IsString, Max, Min, IsIn } from 'class-validator'

export class CreateRoutineDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  @IsIn(['blog', 'todo'])
  routineType: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  targetCount: number

  @IsNotEmpty()
  @IsString()
  @IsIn(['#3a7ce1', '#30A14E'])
  colorSelection: string
}
