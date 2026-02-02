import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskResponse } from './dto/task-create.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import type { User } from '@prisma/client';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'Создание задачи',
  })
  @ApiBadRequestResponse({ description: 'Некорректные входные данные' })
  @ApiOkResponse({ type: TaskResponse })
  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: TaskResponse, @Authorized() user: User) {
    return this.tasksService.create(dto, user.id);
  }

  @ApiOperation({
    summary: 'Возврат всех задач пользователя',
  })
  @ApiOkResponse({ type: [TaskResponse] })
  @ApiNotFoundResponse({ description: 'Задачи не найдены' })
  @Authorization()
  @Get()
  getAll(@Authorized() user: User) {
    return this.tasksService.getAll(user.id);
  }
}
