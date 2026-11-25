import {Component, inject, signal} from '@angular/core';
import {ReviewsService} from '../../services/reviews';
import {Review} from '../../models/review';
import {DatePipe} from '@angular/common';
import {Auth} from '../../services/auth';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-reviews',
  imports: [DatePipe],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {
  reviews = signal<Review[]>([]);
  auth = inject(Auth);
  isAdmin = this.auth.userSubject.value?.role === 1;
  // reviews: Review[] = [];
  reviewsService: ReviewsService = inject(ReviewsService);

  constructor() {
    this.reviewsService.getReviewsFromApi().subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        console.log('Reviews from MongoDB:', reviews);
      },
      error: (error) => {
        console.error('Failed to load reviews:', error);
      }
    });
  }

  deleteReview(id: string) {
    this.reviewsService.deleteReview(id).subscribe({
      next: () => {
        this.reviews.update(reviews =>
          reviews.filter(review => review._id !== id)
        );
      },
      error: (error) => {
        console.error('Failed to delete review:', error);
      }
    });
  }

  canDeleteReview(review: Review): boolean {
    const user = this.auth.userSubject.value;

    if (!user) {
      return false;
    }

    return review.userId === user._id || user.role === 1;
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

}
