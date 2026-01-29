import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieDto } from './dto/movie';
import { PrismaService } from 'src/prisma/prisma.service';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.movie.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        actors: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(dto: MovieDto): Promise<Movie> {
    const { title, releaseYear, imageUrl, actorIds } = dto;

    const actors = await this.prismaService.actor.findMany({
      where: {
        id: { in: actorIds },
      },
    });

    if (!actors || !actors.length)
      throw new NotFoundException('Один или несколько не найдены');

    const data: any = {
      title,
      releaseYear,
      actors: {
        connect: actors.map((actor) => ({ id: actor.id })),
      },
    };
    if (imageUrl) {
      data.poster = {
        create: {
          url: imageUrl,
        },
        
      };
      
    }

    const movie = await this.prismaService.movie.create({
      data,
    });

    return movie;
  },
}
