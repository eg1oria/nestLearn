import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskResponse } from './dto/task-create.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'Создание задачи',
  })
  @ApiBadRequestResponse({ description: 'Некорректные входные данные' })
  @ApiOkResponse({ type: TaskResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: TaskResponse) {
    return this.tasksService.create(dto);
  }

  @ApiOperation({
    summary: 'Возврат всех задач',
  })
  @ApiOkResponse({ type: [TaskResponse] })
  @ApiNotFoundResponse({ description: 'Задачи не найдены' })
  @Get()
  getAll() {
    return this.tasksService.getAll();
  }

  @ApiOperation({
    summary: 'Возврат одной задачи',
  })
  @ApiNotFoundResponse({
    description: 'Задача не найдена',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TaskResponse })
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.tasksService.getById(id);
  }

  @ApiOperation({
    summary: 'Редактировать задачу',
  })
  @Put(':id')
  update(@Body() dto: TaskResponse, @Param('id') id: string) {
    return this.tasksService.updateOne(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Удалить задачу',
  })
  @ApiOkResponse({ type: Boolean })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  @ApiOperation({
    summary: 'Редактировать задачу',
  })
  @Patch(':id')
  setIsCompleted(@Param('id') id: string, @Body() dto: Partial<TaskResponse>) {
    return this.tasksService.setIsComplete(id, dto);
  }
}
