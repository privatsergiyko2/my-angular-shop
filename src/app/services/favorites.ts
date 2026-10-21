import { inject, Injectable } from '@angular/core';
import {Product} from '../models/product';
import { BehaviorSubject, take } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ProductsService } from './products';


@Injectable({
  providedIn: 'root',
})
export class Favorites {
  private readonly _productsService: ProductsService = inject(ProductsService);
  favorites: Product[] = [];
  private _favoritesSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.favoritesParse();
  }

  addToFavorites(product: Product) {
    // const existingFavorites =   this.favorites.find(favorite => favorite._id === product._id);
    // if (!existingFavorites) {
    //   this.favorites.push(product);
    //   this._favoritesSubject.next(this.favorites);
    //   this.favoritesSave()
    // }
  }

  favoritesSave() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  favoritesParse() {
    const favorites = localStorage.getItem('favorites');

    if (favorites) {
      this.favorites = JSON.parse(favorites);
    }

    this._favoritesSubject.next(this.favorites);
  }

  getFavorites() {
    return this._favoritesSubject.asObservable();
  }

  removeFromFavorite(id: string) {
    // this.favorites = this.favorites.filter(favorite => favorite._id !== id);
    // this._favoritesSubject.next(this.favorites);
    // this.favoritesSave()
  }

  toggleFavorites(product) {
    return this._productsService
      .updateProduct(product._id, {
        favorite: product.favorite,
      })
      .pipe(take(1));
  }
}
