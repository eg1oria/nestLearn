import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';
import { ReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reviewDto: ReviewDto): Promise<Review> {
    const { text, rating, movieId } = reviewDto;

    // Проверяем существование фильма
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException(`Фильм с ID ${movieId} не найден`);
    }

    const review = await this.prisma.review.create({
      data: {
        text,
        rating,
        movieId,
      },
      include: {
        movie: true,
      },
    });

    return review;
  }

  async findAll(): Promise<Review[]> {
    return await this.prisma.review.findMany({
      include: {
        movie: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Review> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        movie: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден`);
    }

    return review;
  }

  async findByMovieId(movieId: string): Promise<Review[]> {
    return await this.prisma.review.findMany({
      where: { movieId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: string): Promise<string> {
    // Проверяем существование отзыва
    await this.findById(id);

    const review = await this.prisma.review.delete({
      where: { id },
    });

    return review.id;
  }
}
