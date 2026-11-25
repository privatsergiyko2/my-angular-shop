import {inject, Injectable} from '@angular/core';
import {Review} from '../models/review';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  _http = inject(HttpClient);
  reviews: Review[] = [];

  constructor() {
    this.reviews = JSON.parse(localStorage.getItem('reviews') ?? '[]');
  }


  getReviewsFromApi() {
    return this._http.get<Review[]>(`http://localhost:3000/reviews`);
  }

  addReviewToApi(review: Review) {
    const token = localStorage.getItem('token');

    return this._http.post<Review>(
      'http://localhost:3000/reviews',
      review,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getReviewsByProductFromApi(productId: string) {
    return this._http.get<Review[]>(`http://localhost:3000/reviews/product/${productId}`);
  }

  getReviews() {
    return this.reviews
  }

  addReview(review: Review) {
    this.reviews.push(review)
    localStorage.setItem('reviews', JSON.stringify(this.reviews))
  }

  deleteReview(id: string) {
    const token = localStorage.getItem('token');

    return this._http.delete<Review>(
      `http://localhost:3000/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getReviewsByProduct(productId: string) {
    return this.reviews.filter((review) => review.productId === productId)
  }



}
