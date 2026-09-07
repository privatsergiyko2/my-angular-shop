import {Component, inject, OnInit} from '@angular/core';
import {Favorites} from '../../services/favorites';
import {Product} from '../../models/product';
import {ProductComponent} from '../../components/product/product';


@Component({
  selector: 'app-favorites',
  imports: [
    ProductComponent
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesComponent implements OnInit {
  favoritesProducts: Product[] = [];
  private favorites = inject(Favorites);


  getFavorites() {
   return this.favorites.getFavorites().subscribe(favorites => {
     this.favoritesProducts = favorites;
   })
  }



  ngOnInit() {
    this.getFavorites();
  }
}
