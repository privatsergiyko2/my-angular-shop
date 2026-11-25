
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe, AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Product } from '../../models/product';
import { Review } from '../../models/review';

import { ProductsService } from '../../services/products';
import { ReviewsService } from '../../services/reviews';
import { Auth } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Favorites } from '../../services/favorites';

@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    DecimalPipe,
    AsyncPipe
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  fb = inject(FormBuilder);

  private route = inject(ActivatedRoute);
  private _productService = inject(ProductsService);

  reviewService = inject(ReviewsService);
  cartService = inject(CartService);
  auth = inject(Auth);
  favoritesService = inject(Favorites);

  id: string = this.route.snapshot.paramMap.get('id') || '';

  productSignal = toSignal(
    this._productService.getProductById(this.id)
  );

  similarProducts = signal<Product[]>([]);
  reviews: Review[] = [];
  quantity = 1;

  reviewForm = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['', Validators.required],
  });

  constructor() {
    this.reviewService.getReviewsByProductFromApi(this.id)
      .subscribe({
        next: (reviews) => {
          this.reviews = reviews;
        },
        error: (error) => {
          console.error('Failed to load reviews:', error);
        }
      });

    effect(() => {
      const prod = this.productSignal();

      if (prod) {
        this._productService.getProducts({})
          .subscribe((products: Product[]) => {
            this.similarProducts.set(
              products.filter(
                (item: Product) =>
                  item.category === prod.category &&
                  item._id !== prod._id
              )
            );
          });
      }
    });
  }

  isFavorite(productId: string | undefined): boolean {
    if (!productId) {
      return false;
    }

    return this.favoritesService.isFavorite(productId);
  }

  toggleFavorite(product: Product) {
    const productId = product._id;

    if (!productId) {
      return;
    }

    if (this.favoritesService.isFavorite(productId)) {
      this.favoritesService.deleteFavoritesApi(productId)
        .subscribe({
          next: () => {
            this.favoritesService.favoriteRecords.update(records =>
              records.filter(record => record.productId !== productId)
            );
          },
          error: (error) => {
            console.error('Помилка видалення Favorites:', error);
          }
        });
    } else {
      this.favoritesService.addFavoritesApi(productId)
        .subscribe({
          next: (record) => {
            this.favoritesService.favoriteRecords.update(records =>
              [...records, record]
            );
          },
          error: (error) => {
            console.error('Помилка додавання Favorites:', error);
          }
        });
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    const currentProduct = this.productSignal();

    if (currentProduct) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(currentProduct);
      }
    }
  }

  submitReview() {
    const user = this.auth.userSubject.value;
    const product = this.productSignal();

    if (this.reviewForm.invalid || !user || !product) {
      return;
    }

    const review: Review = {
      userName: user.name,
      productId: this.id,
      productTitle: product.title,
      rating: this.reviewForm.value.rating!,
      comment: this.reviewForm.value.comment!,
    };

    this.reviewService.addReviewToApi(review)
      .subscribe({
        next: (savedReview) => {
          this.reviews = [...this.reviews, savedReview];

          this.reviewForm.reset({
            rating: 0,
            comment: '',
          });
        },
        error: (error) => {
          console.error('Помилка додавання відгуку:', error);
        }
      });
  }

  getStars(rating: number): string {
    const filled = Math.max(0, Math.min(5, Math.round(rating)));

    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  }
}

