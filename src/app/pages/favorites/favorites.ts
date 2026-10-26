import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {Favorites} from '../../services/favorites';
import {Product} from '../../models/product';
import {ProductComponent} from '../../components/product/product';
import {RouterLink} from '@angular/router';


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
  favoritesProducts: Product[] = [];
  private favorites = inject(Favorites);


  getFavorites() {
   return this.favorites.getFavorites().subscribe(favorites => {
     this.favoritesProducts = favorites;
     this.cdr.detectChanges();
   })
  }

  onFavoriteChanged(updatedProduct: Product) {
    if (!updatedProduct.favorite) {
      this.favoritesProducts = this.favoritesProducts.filter(
        product => product._id !== updatedProduct._id
      );
    }
  }



  ngOnInit() {
    this.getFavorites();
  }
}
