import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../dto/guards/auth.guard';
import { RolesGuard } from '../dto/guards/roles.guard';

export function Authorization() {
  return applyDecorators(UseGuards(JwtGuard, RolesGuard));
}
