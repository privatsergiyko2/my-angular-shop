import {ChangeDetectorRef, Component, inject, OnInit,  signal } from '@angular/core';
import {Favorites} from '../../services/favorites';
import {Product} from '../../models/product';
import {ProductComponent} from '../../components/product/product';
import {RouterLink} from '@angular/router';
import {ProductsService} from '../../services/products';

import {Observable} from 'rxjs';
import { switchMap, forkJoin, map, of } from 'rxjs';


@Component({
  selector: 'app-favorites',
  imports: [
    ProductComponent,
    RouterLink
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesComponent implements OnInit {
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
  // favoritesProducts: Product[] = [];
  favoritesProducts = signal<Product[]>([]);
  productsService = inject(ProductsService);
  private favorites = inject(Favorites);


  getFavorites() {
    this.favorites.getFavoritesFromApi()
      .pipe(
        switchMap(favorites => {
          if (favorites.length === 0) {
            return of([] as Product[]);
          }

          const requests = favorites.map(favorite =>
            this.productsService.getProductById(favorite.productId)
          );

          return forkJoin(requests);
        })
      )
      .subscribe({
        next: (products) => {
          this.favoritesProducts.set(
            products.filter(product => product != null)
          );
        },
        error: (error) => {
          console.error('Помилка завантаження Favorites:', error);
        }
      });
  }

  onFavoriteChanged(product: Product) {
    this.favoritesProducts.update(products =>
      products.filter(item => item._id !== product._id)
    );
  }



  ngOnInit() {
    this.getFavorites();
  }
}
