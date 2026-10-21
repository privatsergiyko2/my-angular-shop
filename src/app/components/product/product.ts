import {Component, Input, Output, EventEmitter, InputSignal, input, inject} from '@angular/core';
import {Product} from '../../models/product';
import {RouterLink} from '@angular/router';
import {Favorites} from '../../services/favorites';
import {Auth} from '../../services/auth';
import {AsyncPipe, DecimalPipe} from '@angular/common';


@Component({
  selector: 'app-product',
  imports: [RouterLink, AsyncPipe, DecimalPipe],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductComponent {
  // showOrHideAddToCard: InputSignal<boolean> = input(true);
  auth: Auth = inject(Auth);
  private _favorite = inject(Favorites);

  get originalPrice(): number {
    if (!this.product.discountPercentage) {
      return this.product.price;
    }

    const original = this.product.price * (1 - this.product.discountPercentage / 100);
    return Number(original.toFixed(2));
  }

  addToFavorites() {
    this._favorite.addToFavorites(this.product);
    console.log(this._favorite.favorites);
  }

  isFavorite(): boolean {
    return this._favorite.favorites.some((item) => item._id === this.product._id);
  }

  isStarFilled(star: number): boolean {
    return star <= Math.round(this.product.rating);
  }

  toggleFavorite() {
    if (this.isFavorite()) {
      this._favorite.removeFromFavorite(this.product._id);
    } else {
      this._favorite.addToFavorites(this.product);
    }
  }

  removeFromFavorites(id: string) {
    this._favorite.removeFromFavorite(id);
    console.log(this._favorite.favorites);
  }

  @Input() showAddToCard: boolean = true;
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<Product>();
}
