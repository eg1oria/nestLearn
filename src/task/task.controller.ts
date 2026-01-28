import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.taskService.findById(Number(id));
  }

  @Post()
  addTask(@Body() dto: CreateTaskDto) {
    return this.taskService.addTask(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(+id, dto);
  }

  @Patch(':id')
  one(@Param('id') id: string, @Body() dto: Partial<UpdateTaskDto>) {
    return this.taskService.updateOne(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(+id);
  }
}
