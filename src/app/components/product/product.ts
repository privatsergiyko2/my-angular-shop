import {Component, Input, Output, EventEmitter, InputSignal, input, inject} from '@angular/core';
import {Product} from '../../models/product';
import {RouterLink} from '@angular/router';
import {Favorites} from '../../services/favorites';


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
  private _favorite = inject(Favorites);
  addToFavorites () {
    this._favorite.addToFavorites(this.product)
    console.log(this._favorite.favorites);
  }

  removeFromFavorites (id: number) {
    this._favorite.removeFromFavorite(id)
    console.log(this._favorite.favorites);
  }

  @Input() showAddToCard: boolean = true;
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<Product>();

}
