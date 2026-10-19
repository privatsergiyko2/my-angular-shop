import {ChangeDetectorRef, Component, effect, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Product} from '../../models/product';
import {ProductsService} from '../../services/products';
import {toSignal} from '@angular/core/rxjs-interop';
import {ReviewsService} from '../../services/reviews';
import {Review} from '../../models/review';
import {DatePipe, DecimalPipe} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../../services/auth';
import {CartService} from '../../services/cart';
import {Favorites} from '../../services/favorites';


@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    DecimalPipe
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  fb = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute)
  private _productService = inject(ProductsService);
  reviewService = inject(ReviewsService);
  cartService = inject(CartService);
  auth = inject(Auth);
  similarProducts = signal<Product[]>([])
  reviews: Review[] = [];
  favoritesService = inject(Favorites)
  quantity = 1
  id: string = this.route.snapshot.paramMap.get('id') || '';


  reviewForm = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ["", Validators.required]
  })

  constructor() {
    this.reviews = this.reviewService.getReviewsByProduct(Number(this.id));

    effect(() => {
      const prod = this.productSignal();
      if (prod) {
        this._productService.getProducts().subscribe((products: Product[]) => {
          this.similarProducts.set(products.filter(
            (item: Product) => item.category === prod.category && item.id !== prod.id))
        })
      }
    });
  }

  isFavorite (productId: number):boolean {
    return this.favoritesService.favorites.some(item => item.id == productId);
  }

  toggleFavorite (product: Product) {
   if(this.isFavorite(product.id)) {
     this.favoritesService.removeFromFavorite(product.id);
   } else {
     this.favoritesService.addToFavorites(product);
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
    const currentProduct = this.productSignal()
    if (currentProduct) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(currentProduct);
      }
    }
  }


  submitReview() {
    if (this.reviewForm.invalid) {
      return
    }
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
    this.reviewForm.reset({
        rating: 0,
        comment: ''
      }
    );
    this.reviews = this.reviewService.getReviewsByProduct(Number(this.id));
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  productSignal = toSignal(
    this._productService.getProductById(Number(this.id))
  )

  product: Product | null = null;
}
