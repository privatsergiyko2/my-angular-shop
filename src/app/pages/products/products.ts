import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
import {Footer} from '../../components/footer/footer';


@Component({
  selector: 'app-products',
  imports: [
    NgForOf,
    ProductComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    Sort,
    MatSliderModule,
    Footer,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  searchInputControl = new FormControl('', [Validators.minLength(3)]);
  private cdr = inject(ChangeDetectorRef);
  public cartService = inject(CartService);
  productsService: ProductsService = inject(ProductsService);
  sort = signal('recommended');
  filterCategories = [notSelectedFilter, 'beauty', 'fragrances', 'furniture', 'groceries'];
  products: Product[] = [];
  filteredProducts = signal<Product[]>([]);
  auth: Auth = inject(Auth);
  selectedCategory = notSelectedFilter;
  isError = false;
  isLoading = true;
  minPrice = 0;
  maxPrice = 10000;
  minRating = 0;
  priceLimit = 0;
  availability: string | null = null;

  // constructor() {
  //   this.productsService
  //     .getProducts({})
  //     .pipe(
  //       tap((products) => {
  //         // this.products = products;
  //         // this.filteredProducts.set(products);
  //         // this.filterProducts();
  //         // console.log('filtered:', this.filteredProducts);
  //         // this.isLoading = false;
  //         // this.cdr.detectChanges();
  //         // console.log('loading:', this.isLoading);
  //         // console.log('products length:', this.filteredProducts().length);
  //       }),
  //     ).subscribe();
  // }

  constructor() {
    this.productsService.getProducts({}).subscribe({
      next: (products) => {
        console.log('Products from API:', products.length);

        this.products = products;
        const prices = products.map(product => product.price);
        this.priceLimit = Math.max(0, ...prices);
        this.maxPrice = this.priceLimit;
        this.filterProducts();

        console.log('Filtered products:', this.filteredProducts().length);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.isError = true;
        this.isLoading = false;
      },
    });
  }

  sortOptions = [
    {label: 'Recommended', value: 'recommended'},
    {label: 'Price: Low → High', value: 'price-asc'},
    {label: 'Price: High → Low', value: 'price-desc'},
    {label: 'Rating: High → Low', value: 'rating-desc'},
    {label: 'Name: A → Z', value: 'name-asc'},
    {label: 'Name: Z → A', value: 'name-desc'},
  ];

  discountProduct(product: Product) {
    return product.price * (1 - product.discountPercentage / 100);
  }

  sortedProducts = computed(() => {
    const products = [...this.filteredProducts()];

    switch (this.sort()) {
      case 'price-asc':
        return products.sort((a, b) => a.price - b.price);

      case 'price-desc':
        return products.sort((a, b) => b.price - a.price);

      case 'rating-desc':
        return products.sort((a, b) => b.rating - a.rating);

      case 'name-asc':
        return products.sort((a, b) => a.title.localeCompare(b.title));

      case 'name-desc':
        return products.sort((a, b) => b.title.localeCompare(a.title));

      default:
        return products;
    }
  });

  retry() {
    this.isLoading = true;
    this.productsService
      .getProducts({})
      .pipe(
        take(1),
        tap((products) => {
          // this.products = products;
          // this.filteredProducts.set(products);
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
    this.filteredProducts.set(
      this.products.filter((product) => {
        const productTitle = product.title.toLowerCase();

        const matchesPrice = product.price >= this.minPrice && product.price <= this.maxPrice;
        const matchesSearch = productTitle.includes(searchValue);
        const matchesCategory =
          this.selectedCategory === notSelectedFilter || product.category === this.selectedCategory;
        const matchesRating = product.rating >= this.minRating;
        let matchesAvailability = true;
        if (this.availability === 'inStock') {
          matchesAvailability = product.stock > 0;
        } else if (this.availability === 'lowStock') {
          matchesAvailability = product.stock > 0 && product.stock <= 5;
        }
        return (
          matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesAvailability
        );
      }),
    );
  }

  resetFilters() {
    this.searchInputControl.setValue('');
    this.selectedCategory = notSelectedFilter;
    this.minPrice = 0;
    this.maxPrice = this.priceLimit;
    this.minRating = 0;
    this.availability = null;
    this.filterProducts();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  selectRating(rating: number) {
    console.log('Rating clicked:', rating);

    if (this.minRating === rating) {
      this.minRating = 0;
    } else {
      this.minRating = rating;
    }

    this.filterProducts();
  }

  selectAvailability(status: string | null) {
    // this.availability = status;
    if(this.availability === status) {
      this.availability = null;
    } else {
      this.availability = status;
    }
    this.filterProducts();
  }

  getCategoryCount(category: string): number {
    const products = this.productsService.productsFromApi();

    if (category === 'All' || category === 'All Products') {
      return products.length;
    }

    return products.filter(
      (product) => product.category === category
    ).length;
  }

  getRatingCount(rating: number): number {
    return this.products.filter((p) => p.rating >= rating).length;
  }

  getAvailabilityCount(status: string): number {
    const products = this.productsService.productsFromApi();

    if (status === 'inStock') {
      return products.filter(product => product.stock > 0).length;
    }

    if (status === 'lowStock') {
      return products.filter(
        product => product.stock > 0 && product.stock <= 5
      ).length;
    }

    return 0;
  }

  showCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  protected removeFromProduct(item: Product) {
    if (!item._id) return;

    this.productsService.deleteProduct(item._id).subscribe(() => {
      this.products = this.products.filter(
        (product) => product._id !== item._id
      );

      this.filterProducts();
    });
  }
}
