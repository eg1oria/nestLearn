import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateTaskDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  @Length(2, 10)
  title: string;

  @IsBoolean({ message: 'Статус должен быть бул' })
  isCompleted: boolean;
}
