import {ChangeDetectorRef, Component, computed, inject, signal} from '@angular/core'
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ProductsService} from '../../../services/products';
import {Product} from '../../../models/product';
import { Table } from '../../../components/table/table';
import {Sort} from '../../../components/sort/sort';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, RouterLinkActive, Table, Sort, AdminSidebar],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  router = inject(Router);
  _cdr = inject(ChangeDetectorRef);
  _productService: ProductsService = inject(ProductsService);
  _products = signal<Product[]>([]);
  selectedProducts: string[] = [];
  sort = signal('newest');

  constructor() {
    this._productService.getProducts({}).subscribe((products) => {
      console.log(products.length);
      this._products.set(products);
      this._cdr.detectChanges();
    });
  }

  sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Price: Low → High', value: 'price-asc' },
    { label: 'Price: High → Low', value: 'price-desc' },
    { label: 'Name: A → Z', value: 'name-asc' },
    { label: 'Name: Z → A', value: 'name-desc' },
  ];

  sortedProducts = computed(() => {
    if (this.sort() === 'newest') {
      const products = [...this._products()];
      products.sort((a, b) => b._id!.localeCompare(a._id!));
      return products;
    }

    if (this.sort() === 'oldest') {
      const products = [...this._products()];
      products.sort((a, b) => a._id!.localeCompare(b._id!));
      return products;
    }

    if (this.sort() === 'price-asc') {
      const products = [...this._products()];
      products.sort((a, b) => a.price - b.price);
      return products;
    }

    if (this.sort() === 'price-desc') {
      const products = [...this._products()];
      products.sort((a, b) => b.price - a.price);
      return products;
    }

    if (this.sort() === 'name-asc') {
      const products = [...this._products()];
      products.sort((a, b) => a.title.localeCompare(b.title));
      return products;
    }

    if (this.sort() === 'name-desc') {
      const products = [...this._products()];
      products.sort((a, b) => b.title.localeCompare(a.title));
      return products;
    }

    return this._products();
  });

  toggleProduct(product: Product) {
    if (this.selectedProducts.includes(product._id)) {
      this.selectedProducts = this.selectedProducts.filter((id) => {
        return id !== product._id;
      });
    } else {
      this.selectedProducts.push(product._id);
    }
  }

  toggleAllProducts(checked: boolean) {
    if (checked) {
      this.selectedProducts = this._products().map((product) => product._id);
    } else {
      this.selectedProducts = [];
    }
  }

  deleteSelectedProducts() {
    if (this.selectedProducts.length > 0) {
      this.selectedProducts.forEach((id) => {
        this._productService.deleteProduct(id).subscribe();
      });

      this._products.set(
        this._products().filter((product) => !this.selectedProducts.includes(product._id)),
      );

      this.selectedProducts = [];

      this._cdr.detectChanges();
    }
  }

  editProduct(product: Product) {
    this.router.navigate(['/edit', product._id]);
  }

  removeProduct(id: string) {
    this._productService.deleteProduct(id).subscribe(() => {
      this._products.set(this._products().filter((product) => product._id !== id));
      this._cdr.detectChanges();
    });
  }
}
