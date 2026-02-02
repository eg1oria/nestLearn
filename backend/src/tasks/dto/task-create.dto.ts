import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Название задачи',
    example: 'Купить продукты',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Описание задачи',
    example: 'Купить молоко, хлеб, яйца',
  })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Статус выполнения',
    example: false,
    default: false,
  })
  isCompleted?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ID проекта (необязательно)',
    example: 'clx1234567890',
  })
  projectId?: string;
}

export class TaskUpdateDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Название задачи',
    example: 'Купить продукты',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Описание задачи',
    example: 'Купить молоко, хлеб, яйца',
  })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Статус выполнения',
    example: false,
  })
  isCompleted?: boolean;
}

export class TaskStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Статус выполнения',
    example: true,
  })
  isCompleted: boolean;
}
