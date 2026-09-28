import {Component, Input, Output, EventEmitter, InputSignal, input, inject} from '@angular/core';
import {Product} from '../../models/product';
import {RouterLink} from '@angular/router';
import {Favorites} from '../../services/favorites';
import {Auth} from '../../services/auth';


@Component({
  selector: 'app-product',
  imports: [
    RouterLink
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductComponent {
  // showOrHideAddToCard: InputSignal<boolean> = input(true);
  _auth = inject(Auth)
  private _favorite = inject(Favorites);
  isLoggedIn = this._auth.userSubject.value;
  isAdmin = this._auth.isAdmin()

  addToFavorites() {
    this._favorite.addToFavorites(this.product)
    console.log(this._favorite.favorites);
  }

  isFavorite(): boolean {
    return this._favorite.favorites.some(item => item.id === this.product.id);
  }


  isStarFilled(star: number): boolean {
    return star <= Math.round(this.product.rating);
  }

  toggleFavorite() {
    if (this.isFavorite()) {
      this._favorite.removeFromFavorite(this.product.id)
    } else {
      this._favorite.addToFavorites(this.product)
    }
  }


  removeFromFavorites(id: number) {
    this._favorite.removeFromFavorite(id)
    console.log(this._favorite.favorites);
  }

  @Input() showAddToCard: boolean = true;
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<Product>();

}
