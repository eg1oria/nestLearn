import { Injectable } from '@nestjs/common';
import { ActorDto } from './dto/actor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Actor } from '@prisma/client';

@Injectable()
export class ActorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: ActorDto): Promise<Actor> {
    const { name } = dto;
    const actor = await this.prismaService.actor.create({
      data: {
        name,
      },
    });

    return actor;
  }
}
