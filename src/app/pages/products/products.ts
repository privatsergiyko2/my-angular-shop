import {Component, inject, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ProductComponent} from '../../components/product/product';
import {CartService} from '../../services/cart';
import {notSelectedFilter} from '../../constants/products-constants';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductsService} from '../../services/products';
import {RouterLink} from '@angular/router';
import {Product} from '../../models/product';

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

  selectedCategory = notSelectedFilter;

  isError = false;
  isLoading = true;


  constructor() {
    this._productsService.getProducts().subscribe(
      response => {
        this.products = response.products;
        this.filteredProducts = response.products;
        this.filterProducts();

        this.isLoading = false;
      },
      error => {
        this.isError = true;
        this.isLoading = false;
      }
    );
    this._productsService.getProducts$().subscribe(products => {
      this.products = products;
      this.filterProducts();
    });
  }


  retry() {
    this.isLoading = true
    this._productsService.getProducts().subscribe(response => {
      this.products = response.products;
      this.filteredProducts = response.products;
      this.isError = false;
      this.isLoading = false;
    },
      error => {
        this.isError = true;
        this.isLoading = false
      })

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

  // filterProducts() {
  //   const searchValue =
  //     this.searchInputControl.value?.toLowerCase() || '';
  //
  //   this.filteredProducts = this.products.filter(product => {
  //     const productTitle = product.title.toLowerCase();
  //
  //     if (this.selectedCategory === notSelectedFilter) {
  //       return productTitle.includes(searchValue);
  //     }
  //
  //     return product.category === this.selectedCategory &&
  //       productTitle.includes(searchValue);
  //   });
  // }

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
