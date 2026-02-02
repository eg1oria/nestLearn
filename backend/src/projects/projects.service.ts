import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDto } from './dto/create-proj.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: ProjectDto, userId: string) {
    const { title, description } = dto;

    const project = await this.prismaService.project.create({
      data: {
        title,
        description,
        userId,
      },
      include: {
        tasks: true,
      },
    });

    return project;
  }

  async findAll(userId: string) {
    return await this.prismaService.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tasks: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prismaService.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этому проекту');
    }

    return project;
  }

  async update(id: string, dto: Partial<ProjectDto>, userId: string) {
    // Проверка существования и прав доступа
    const existingProject = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new NotFoundException('Проект не найден');
    }

    if (existingProject.userId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этому проекту');
    }

    const project = await this.prismaService.project.update({
      where: { id },
      data: dto,
      include: {
        tasks: true,
      },
    });

    return project;
  }

  async delete(id: string, userId: string) {
    const project = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этому проекту');
    }

    await this.prismaService.project.delete({
      where: { id },
    });

    return true;
  }
}
