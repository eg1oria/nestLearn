import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/create-proj.dto';
import type { User } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({
    summary: 'Создание проекта',
  })
  @ApiBadRequestResponse({ description: 'Некорректные входные данные' })
  @ApiOkResponse({ type: ProjectDto })
  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: ProjectDto, @Authorized() user: User) {
    return this.projectsService.create(dto, user.id);
  }

  @ApiOperation({
    summary: 'Получить все проекты пользователя',
  })
  @ApiOkResponse({ type: [ProjectDto] })
  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Authorized() user: User) {
    return this.projectsService.findAll(user.id);
  }
}
