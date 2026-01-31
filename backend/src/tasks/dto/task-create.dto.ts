import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TaskResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Название',
    example: 'Задача',
  })
  title: string;

  @ApiProperty({
    description: 'Описание',
    example: 'Сделать что то',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Статус',
    example: false,
  })
  @IsBoolean()
  isCompleted: boolean;
}
