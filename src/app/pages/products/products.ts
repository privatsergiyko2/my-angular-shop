import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ProductComponent} from '../../components/product/product';
import {CartService} from '../../services/cart';
import {notSelectedFilter} from '../../constants/products-constants';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductsService} from '../../services/products';
import {RouterLink} from '@angular/router';
import {Product} from '../../models/product';
import {Auth} from '../../services/auth';
import { catchError, take, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [
    NgForOf,
    ProductComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {

  searchInputControl = new FormControl('', [
    Validators.minLength(3)
  ]);
  private cdr = inject(ChangeDetectorRef);
  public cartService = inject(CartService);
  private _productsService = inject(ProductsService);

  filterCategories = [
    notSelectedFilter,
    'beauty',
    'fragrances',
    'furniture',
    'groceries'
  ];
  products: Product[] = [];
  filteredProducts: Product[] = [];

  _auth = inject(Auth);
  isLoggedIn = this._auth.userSubject.value;
  selectedCategory = notSelectedFilter;

  isError = false;
  isLoading = true;


  constructor() {
    this._productsService
      .getProducts()
      .pipe(
        take(1),
        tap((products) => {
          this.products = products;
          this.filteredProducts = products;
          this.filterProducts();
          console.log('filtered:', this.filteredProducts);
          this.isLoading = false;
          this.cdr.detectChanges();
          console.log('loading:', this.isLoading);
          console.log('products length:', this.filteredProducts.length);
        }),
      )
      .subscribe();
  }


  retry() {
    this.isLoading = true
    this._productsService
      .getProducts()
      .pipe(
        take(1),
        tap((products) => {
          this.products = products;
          this.filteredProducts = products;
          this.isError = false;
          this.isLoading = false;
        }),
        catchError((error) => {
          this.isError = true;
          this.isLoading = false;
          return throwError(() => error);
        }),
      )
      .subscribe();
  }


  ngOnInit(): void {
    this.searchInputControl.valueChanges.subscribe(() => {
      if (this.searchInputControl.valid || !this.searchInputControl.value) {
        this.filterProducts();
      }
    });
  }

  filterProducts() {
    console.log(this.products.find(product => product.id === 1));
    const searchValue =
      this.searchInputControl.value?.toLowerCase() || '';
    this.filteredProducts = this.products.filter(product => {
      const productTitle = product.title.toLowerCase();

      if (this.selectedCategory === notSelectedFilter) {
        return productTitle.includes(searchValue);
      }
      return product.category === this.selectedCategory &&
        productTitle.includes(searchValue);
    });
  }


  showCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }


  protected removeFromProduct(item: Product) {
    this._productsService.deleteProduct(item.id).subscribe(response => {

      this.products = this.products.filter(
        product => product.id !== item.id
      );

      this.filteredProducts = this.filteredProducts.filter(
        product => product.id !== item.id
      );

    });
  }
}
