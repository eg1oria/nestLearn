import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistDto } from './dto/artist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: ArtistDto) {
    return await this.prismaService.artist.create({
      data: {
        name: dto.name,
        genre: dto.genre,
      },
    });
  }

  async findAll() {
    return await this.prismaService.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: {
        id,
      },
    });

    if (!artist) {
      throw new NotFoundException('Артист не найден');
    }

    return artist;
  }
}
