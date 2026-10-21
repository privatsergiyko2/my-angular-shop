import {ChangeDetectorRef, Component, computed, inject, OnInit, signal} from '@angular/core';
import {AsyncPipe, NgForOf} from '@angular/common';
import {ProductComponent} from '../../components/product/product';
import {CartService} from '../../services/cart';
import {notSelectedFilter} from '../../constants/products-constants';
import {FormControl, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import {ProductsService} from '../../services/products';
import {RouterLink} from '@angular/router';
import {Product} from '../../models/product';
import {Auth} from '../../services/auth';
import {catchError, take, tap, throwError} from 'rxjs';
import {Sort} from '../../components/sort/sort';
import {MatSliderModule} from '@angular/material/slider';


@Component({
  selector: 'app-products',
  imports: [NgForOf, ProductComponent, FormsModule, ReactiveFormsModule, RouterLink, AsyncPipe, Sort, MatSliderModule],
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
  minPrice = 0;
  maxPrice = 2500;
  minRating = 0;
  availability: string | null = null;


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
    {label: 'Recommended', value: 'recommended'},
    {label: 'Price: Low → High', value: 'price-asc'},
    {label: 'Price: High → Low', value: 'price-desc'},
    {label: 'Rating: High → Low', value: 'rating-desc'},
    {label: 'Name: A → Z', value: 'name-asc'},
    {label: 'Name: Z → A', value: 'name-desc'}
  ];

  discountProduct(product: Product) {
    return product.price * (1 - product.discountPercentage / 100)
  }

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


    if (this.sort() === "name-asc") {
      const products = [...this.filteredProducts()];
      products.sort((a, b) => a.title.localeCompare(b.title));
      return products;
    }

    if (this.sort() === "name-desc") {
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
    const searchValue = this.searchInputControl.value?.toLowerCase() || '';
    this.filteredProducts.set(this.products.filter((product) => {
      const productTitle = product.title.toLowerCase();

      const matchesPrice = product.price >= this.minPrice && product.price <= this.maxPrice;
      const matchesSearch = productTitle.includes(searchValue);
      const matchesCategory = this.selectedCategory === notSelectedFilter || product.category === this.selectedCategory;
      const matchesRating = product.rating >= this.minRating;
      let matchesAvailability = true;
      if (this.availability === "inStock") {
        matchesAvailability = product.stock > 0;
      } else if (this.availability === "lowStock") {
        matchesAvailability = product.stock > 0 && product.stock <= 5;
      }
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesAvailability;
    }))
  }

  resetFilters() {
    this.searchInputControl.setValue('');
    this.selectedCategory = notSelectedFilter;
    this.minPrice = 0;
    this.maxPrice = 2500;
    this.minRating = 0;
    this.availability = null;
    this.filterProducts();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  selectRating(rating: number) {
    this.minRating = rating;
    this.filterProducts();
  }

  selectAvailability(status: string | null) {
    this.availability = status;
    this.filterProducts();
  }


  getCategoryCount(category: string): number {
    if (category === 'All' || category === 'All Products') {
      return this.products.length;
    }
    return this.products.filter((p) => p.category === category).length;
  }

  getRatingCount(rating: number): number {
    return this.products.filter((p) => p.rating >= rating).length;
  }

  getAvailabilityCount(status: string): number {
    if (status === 'inStock') {
      return this.products.filter(p => p.stock > 10).length;
    }
    if (status === 'lowStock') {
      return this.products.filter(p => p.stock > 0 && p.stock <= 10).length;
    }
    return 0;
  }


  showCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  protected removeFromProduct(item: Product) {
    if (!item._id) return;

    this._productsService.deleteProduct(item?._id).subscribe((response) => {
      this.products = this.products.filter((product) => product._id !== item._id);

      this.filteredProducts.set(this.filteredProducts().filter((product) => product._id !== item._id))
    });
  }
}
