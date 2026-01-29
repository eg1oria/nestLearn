import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export enum TaskTag {
  WORK = 'work',
  STUDY = 'study',
  HOME = 'home',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 10)
  title: string;

  @IsString()
  @Optional()
  description: string;

  @IsPositive()
  @IsOptional()
  @IsInt()
  priority: number;

  @IsOptional()
  @IsEnum(TaskTag, { each: true })
  @IsArray()
  tags: TaskTag[];
}
