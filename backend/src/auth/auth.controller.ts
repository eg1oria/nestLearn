import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import type { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto';
import { Authorization } from './decorators/auth.decorator';
import { Authorized } from './decorators/authorized.decorator';
import type { User } from '@prisma/client';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Создание аккаунта',
    description: 'Создает новый аккаунт',
  })
  @ApiConflictResponse({
    description: 'Пользователь с такой почтой уже существует',
  })
  @ApiBadRequestResponse({ description: 'Некорректные входные данные' })
  @ApiOkResponse({ type: AuthResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest,
  ) {
    return this.authService.register(res, dto);
  }

  @ApiOperation({
    summary: 'Вход в аккаунт',
    description: 'Авторизует и выдает токен доступа',
  })
  @ApiBadRequestResponse({ description: 'Некорректные входные данные' })
  @ApiOkResponse({ type: AuthResponse })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest,
  ) {
    return this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: 'Обновление токена',
    description: 'Генерирует новый токен доступа',
  })
  @ApiOkResponse({ type: AuthResponse })
  @ApiUnauthorizedResponse({
    description: 'Недействительный рефреш токен',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @ApiOperation({
    summary: 'Выход из системы',
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Authorization()
  @ApiOperation({ summary: 'Текущий пользователь' })
  @ApiOkResponse({
    description: 'Возвращает текущего пользователя по access token',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@Authorized() user: User) {
    return user;
  }

  @Authorization()
  @Roles('ADMIN')
  @Get('admin/users')
  findAll() {
    return this.authService.findAll();
  }

  @Delete(`delete/:id`)
  delete(@Param('id') id: string) {
    return this.authService.delete(id);
  }
}
