import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../dto/guards/auth.guard';

export function Authorization() {
  return applyDecorators(UseGuards(JwtGuard));
}
