import { Test, TestingModule } from '@nestjs/testing';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';

const artist = {
  id: uuidv4(),
  name: 'Alex',
  genre: 'Jaz',
};

const dto = {
  name: 'Alex',
  genre: 'Jaz',
};

describe('Artist Controller', () => {
  let controller: ArtistController;
  let service: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [
        {
          provide: ArtistService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([artist]),
            findOne: jest.fn().mockResolvedValue(artist),
            create: jest.fn().mockResolvedValue(artist),
          },
        },
      ],
    }).compile();

    controller = module.get<ArtistController>(ArtistController);
    service = module.get<ArtistService>(ArtistService);
  });

  it('should be definded', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of Artists', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([artist]);
  });

  it('should return a id Artist', async () => {
    const result = await controller.findOne(artist.id);
    expect(result).toEqual(artist);
  });

  it('should error', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValueOnce(new NotFoundException('Артист не найден'));

    try {
      await controller.findOne('1212');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Артист не найден');
    }
  });

  it('should create', async () => {
    const result = await controller.create(dto);
    expect(result).toEqual(artist);
  });
});
