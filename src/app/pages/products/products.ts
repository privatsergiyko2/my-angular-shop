import {ChangeDetectorRef, Component, computed, inject, OnInit, signal} from '@angular/core';
import {AsyncPipe, NgForOf} from '@angular/common';
import {ProductComponent} from '../../components/product/product';
import {CartService} from '../../services/cart';
import {notSelectedFilter} from '../../constants/products-constants';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductsService} from '../../services/products';
import {RouterLink} from '@angular/router';
import {Product} from '../../models/product';
import {Auth} from '../../services/auth';
import {catchError, take, tap, throwError} from 'rxjs';
import {Sort} from '../../components/sort/sort';

@Component({
  selector: 'app-products',
  imports: [NgForOf, ProductComponent, ReactiveFormsModule, RouterLink, AsyncPipe, Sort],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  searchInputControl = new FormControl('', [Validators.minLength(3)]);
  private cdr = inject(ChangeDetectorRef);
  public cartService = inject(CartService);
  private _productsService = inject(ProductsService);
  sort = signal("recommended");


  filterCategories = [notSelectedFilter, 'beauty', 'fragrances', 'furniture', 'groceries'];
  products: Product[] = [];
  filteredProducts = signal<Product[]>([]);

  auth: Auth = inject(Auth);
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
          this.filteredProducts.set(products);
          this.filterProducts();
          console.log('filtered:', this.filteredProducts);
          this.isLoading = false;
          this.cdr.detectChanges();
          console.log('loading:', this.isLoading);
          console.log('products length:', this.filteredProducts().length);
        }),
      )
      .subscribe();
  }

  sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Price: Low → High', value: 'price-asc' },
    { label: 'Price: High → Low', value: 'price-desc' },
    { label: 'Rating: High → Low', value: 'rating-desc' },
    { label: 'Name: A → Z', value: 'name-asc' },
    { label: 'Name: Z → A', value: 'name-desc' }
  ];

  sortedProducts = computed(() => {
    if (this.sort() === "price-asc") {
      const products = [...this.filteredProducts()];
      products.sort((a, b) => a.price - b.price);
      return products;
    }

    if (this.sort() === "price-desc") {
      const products = [...this.filteredProducts()];
      products.sort((a, b) => b.price - a.price);
      return products;
    }

    if (this.sort() === "rating-desc") {
      const products = [...this.filteredProducts()];
      products.sort((a, b) => b.rating - a.rating);
      return products;
    }


    if (this.sort() ===  "name-asc") {
      const products = [...this.filteredProducts()];
      products.sort((a, b) => a.title.localeCompare(b.title));
      return products;
    }

    if (this.sort() ===  "name-desc") {
      const products = [...this.filteredProducts()];
      products.sort((a, b) => b.title.localeCompare(a.title));
      return products;
    }

    return this.filteredProducts();
  });

  retry() {
    this.isLoading = true;
    this._productsService
      .getProducts()
      .pipe(
        take(1),
        tap((products) => {
          this.products = products;
          this.filteredProducts.set(products);
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
    console.log(this.products.find((product) => product.id === 1));
    const searchValue = this.searchInputControl.value?.toLowerCase() || '';
    this.filteredProducts.set(this.products.filter((product) => {
      const productTitle = product.title.toLowerCase();

      if (this.selectedCategory === notSelectedFilter) {
        return productTitle.includes(searchValue);
      }
      return product.category === this.selectedCategory && productTitle.includes(searchValue);
    }))
  }

  showCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  protected removeFromProduct(item: Product) {
    this._productsService.deleteProduct(item.id).subscribe((response) => {
      this.products = this.products.filter((product) => product.id !== item.id);

      this.filteredProducts.set(this.filteredProducts().filter((product) => product.id !== item.id))
    });
  }
}
