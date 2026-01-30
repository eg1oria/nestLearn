import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'jwt access token',
    example: 'eyLfkjs23r2klfsldlk323olflsk...',
  })
  accesToken: string;
}
