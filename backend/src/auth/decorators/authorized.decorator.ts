import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import type { Request } from 'express';

export const Authorized = createParamDecorator(
  (
    data: keyof User | undefined,
    ctx: ExecutionContext,
  ): User | User[keyof User] => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as User | undefined;

    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return data ? user[data] : user;
  },
);
