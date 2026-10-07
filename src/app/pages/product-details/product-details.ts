import {ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Product} from '../../models/product';
import {ProductsService} from '../../services/products';
import {toSignal} from '@angular/core/rxjs-interop';
import {ReviewsService} from '../../services/reviews';
import {Review} from '../../models/review';
import {DatePipe} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../../services/auth';


@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink,
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails  {
  fb = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute)
  private _productService = inject(ProductsService);
  reviewService = inject(ReviewsService);
  auth = inject(Auth);
  reviews: Review[] = [];

  reviewForm = this.fb.group({
    rating: [0, Validators.required],
    comment: ["",Validators.required]
  })

  id: string = this.route.snapshot.paramMap.get('id') || '';

  constructor() {
    this.reviews = this.reviewService.getReviewsByProduct(Number(this.id));
  }

  submitReview() {
    if (!this.auth.userSubject.value) {
      return
    }
    const user = this.auth.userSubject.value;
    const review: Review = {
      id: Date.now(),
      userName: user.name,
      productId: Number(this.id),
      productTitle: this.productSignal()?.title!,
      rating: this.reviewForm.value.rating!,
      comment: this.reviewForm.value.comment!,
      date: Date.now(),
    };
    this.reviewService.addReview(review);
    this.reviewForm.reset();
    this.reviews = this.reviewService.getReviewsByProduct(Number(this.id));
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  productSignal   = toSignal(
    this._productService.getProductById(Number(this.id))
  )

  product: Product | null = null;
}
