import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Название проекта',
    example: 'проект',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'Описание проекта',
    example: 'описание',
  })
  description: string;
}
