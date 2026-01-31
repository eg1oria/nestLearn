import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskResponse } from './dto/task-create.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: TaskResponse) {
    const { title, description, isCompleted } = dto;

    const task = await this.prismaService.task.create({
      data: {
        title,
        description,
        isCompleted,
      },
    });

    return task;
  }

  async getAll() {
    return await this.prismaService.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
      },
    });
  }

  async getById(id: string) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }

    return task;
  }

  async delete(id: string) {
    if (!id) {
      throw new BadRequestException('id is required');
    }
    await this.prismaService.task.delete({
      where: {
        id,
      },
    });

    return { ok: true };
  }

  async updateOne(id: string, dto: Partial<TaskResponse>) {
    const { title, description, isCompleted } = dto;

    const task = await this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        isCompleted,
      },
      select: {
        title: true,
        description: true,
        isCompleted: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }

    return task;
  }

  async setIsComplete(id: string, dto: Partial<TaskResponse>) {
    const { isCompleted } = dto;
    const task = await this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        isCompleted,
      },
      select: {
        isCompleted: true,
      },
    });

    return task.isCompleted;
  }
}
