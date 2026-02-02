import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskResponse, TaskUpdateDto } from './dto/task-create.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: TaskResponse, userId: string) {
    const { title, description, isCompleted, projectId } = dto;

    // Если указан проект - проверяем, что он существует и принадлежит пользователю
    if (projectId) {
      const project = await this.prismaService.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('Проект не найден');
      }

      if (project.userId !== userId) {
        throw new ForbiddenException('У вас нет доступа к этому проекту');
      }
    }

    const task = await this.prismaService.task.create({
      data: {
        title,
        description,
        isCompleted: isCompleted ?? false,
        userId,
        projectId: projectId || null,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return task;
  }

  async getAll(userId: string) {
    return await this.prismaService.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getById(id: string, userId: string) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }

    // Проверка, что задача принадлежит пользователю
    if (task.userId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этой задаче');
    }

    return task;
  }

  async delete(id: string, userId: string) {
    if (!id) {
      throw new BadRequestException('id обязателен');
    }

    // Проверка существования и прав доступа
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этой задаче');
    }

    await this.prismaService.task.delete({
      where: { id },
    });

    return true;
  }

  async updateOne(id: string, dto: TaskUpdateDto, userId: string) {
    // Проверка существования и прав доступа
    const existingTask = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException('Задача не найдена');
    }

    if (existingTask.userId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этой задаче');
    }

    const task = await this.prismaService.task.update({
      where: { id },
      data: dto,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return task;
  }

  async setIsComplete(id: string, isCompleted: boolean, userId: string) {
    // Проверка существования и прав доступа
    const existingTask = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException('Задача не найдена');
    }

    if (existingTask.userId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этой задаче');
    }

    const task = await this.prismaService.task.update({
      where: { id },
      data: { isCompleted },
      select: {
        id: true,
        isCompleted: true,
      },
    });

    return task;
  }
}
