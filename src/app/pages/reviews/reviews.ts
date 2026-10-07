import {Component, inject} from '@angular/core';
import {ReviewsService} from '../../services/reviews';
import {Review} from '../../models/review';
import {DatePipe} from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-reviews',
  imports: [
    DatePipe
  ],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {
  auth = inject(Auth);
  isAdmin = this.auth.userSubject.value?.role ===  1;
  reviews: Review[] = [];
  reviewsService: ReviewsService = inject(ReviewsService);

  deleteReview (id: number) {
    this.reviewsService.deleteReview(id)
    this.reviews = this.reviewsService.getReviews();
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  constructor() {
    this.reviews = this.reviewsService.getReviews();
  }
}
