import { Injectable } from '@angular/core';
import {Product} from '../models/product';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class Favorites {
  favorites: Product[] = [];
  private _favoritesSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.favoritesParse()
  }
  addToFavorites (product: Product) {
    const existingFavorites =   this.favorites.find(favorite => favorite.id === product.id);
    if (!existingFavorites) {
      this.favorites.push(product);
      this._favoritesSubject.next(this.favorites);
      this.favoritesSave()
    }
  }
  favoritesSave () {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  favoritesParse() {
    const favorites = localStorage.getItem('favorites');

    if (favorites) {
      this.favorites = JSON.parse(favorites);
    }

    this._favoritesSubject.next(this.favorites);
  }

  getFavorites () {
    return this._favoritesSubject.asObservable()
  }

  removeFromFavorite (id: number)  {
    this.favorites = this.favorites.filter(favorite => favorite.id !== id);
    this._favoritesSubject.next(this.favorites);
    this.favoritesSave()
  }
}
