import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export function getJwtConfig(configServise: ConfigService): JwtModuleOptions {
  return {
    secret: configServise.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      algorithm: 'HS256',
    },
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
}
