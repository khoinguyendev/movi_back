import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto, FilterReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from 'src/entities/Review';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}
  create(userId: number, createReviewDto: CreateReviewDto) {
    const { content, images, movieId, rating } = createReviewDto;
    let isPublic = true;
    if (content || images) {
      isPublic = false;
    }
    const review = this.reviewRepository.create({
      content: content,
      images: images,
      rating: rating,
      isPublic: isPublic,
      user: {
        id: userId,
      },
      movie: {
        id: movieId,
      },
    });
    return this.reviewRepository.save(review);
  }

  findAllFilter(filterReviewDto: FilterReviewDto) {
    const { isPublic, maxScore, minScore, movieId } = filterReviewDto;
    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.movie', 'movie');

    if (isPublic !== -1) {
      queryBuilder.andWhere('review.isPublic = :isPublic', { isPublic });
    }

    if (minScore !== undefined) {
      queryBuilder.andWhere('review.rating >= :minScore', { minScore });
    }

    if (maxScore !== undefined) {
      queryBuilder.andWhere('review.rating <= :maxScore', { maxScore });
    }

    if (movieId) {
      queryBuilder.andWhere('review.movie.id = :movieId', { movieId });
    }

    return queryBuilder.getMany();
  }

  async duyet(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id: id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    review.isPublic = true;
    return await this.reviewRepository.save(review);
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return this.reviewRepository.delete(id);
  }

  async findByMovie(movieId: number) {
    // Get all reviews for the given movie ID
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.movieId = :movieId', { movieId })
      .andWhere('review.isPublic = true')
      .select([
        'review',
        'user.id', // Include the review ID
        'user.avatar', // Include the user's avatar
        'user.username', // Include the user's username
      ])
      .getMany();

    // Calculate the total number of reviews
    const totalReviews = reviews.length;

    // Calculate the average rating
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) /
      (totalReviews || 1); // Avoid division by zero

    // // Get the list of reviewers
    // const reviewers = reviews.map((review) => ({
    //   id: review.user.id,
    //   name: review.user.username, // Assuming User entity has a 'name' property
    // }));

    // Return the aggregated data
    return {
      totalReviews,
      averageRating: averageRating.toFixed(1),
      reviews,
    };
  }
}
