import {Injectable} from '@angular/core';
import {Review} from '../models/review';


@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  reviews: Review[] = [];

  constructor() {
    this.reviews = JSON.parse(localStorage.getItem('reviews') ?? '[]');
  }

  getReviews() {
    return this.reviews
  }

  addReview(review: Review) {
    this.reviews.push(review)
    localStorage.setItem('reviews', JSON.stringify(this.reviews))
  }

  deleteReview(id: number) {
    this.reviews = this.reviews.filter((review) => review.id !== id)
    localStorage.setItem('reviews', JSON.stringify(this.reviews))
  }

  getReviewsByProduct(productId: number) {
    return this.reviews.filter((review) => review.productId === productId)
  }

}
