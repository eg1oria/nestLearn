import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { Artist } from '@prisma/client';
import { ArtistDto } from './dto/artist.dto';
import { PrismaService } from '../prisma/prisma.service';

const artistId = uuidv4();

const artists: Artist[] = [
  {
    id: artistId,
    name: 'Egsdor',
    genre: 'Jaz',
  },
  {
    id: uuidv4(),
    name: 'Egor',
    genre: 'Jaz',
  },
  {
    id: uuidv4(),
    name: 'Egsdor',
    genre: 'Jaz',
  },
];

const artist: Artist = artists[0];

const dto: ArtistDto = {
  name: artist.name,
  genre: artist.genre,
};

const db = {
  artist: {
    findMany: jest.fn().mockResolvedValue(artists),
    findUnique: jest.fn().mockResolvedValue(artist),
    create: jest.fn().mockResolvedValue(artist),
  },
};

describe('Artist Service', () => {
  let service: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
  });

  it('should be definded', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of Artists', async () => {
    const result = await service.findAll();
    expect(result).toEqual(artists);
  });

  it('should return a id Artist', async () => {
    const result = await service.findOne(artist.id);
    expect(result).toEqual(artist);
  });

  it('should error', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValueOnce(new NotFoundException('Артист не найден'));

    try {
      await service.findOne('1212');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Артист не найден');
    }
  });

  it('should create', async () => {
    const result = await service.create(dto);
    expect(result).toEqual(artist);
  });
});
