import {ChangeDetectorRef, Component, computed, inject, signal} from '@angular/core'
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ProductsService} from '../../services/products';
import {Product} from '../../models/product';
import {HttpClient} from '@angular/common/http';
import { Pagination } from '../../components/pagination/pagination';
import { Table } from '../../components/table/table';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, RouterLinkActive, Pagination, Table],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  router = inject(Router);
  _cdr = inject(ChangeDetectorRef);
  _productService: ProductsService = inject(ProductsService);
  _products = signal<Product[]>([]);
  selectedProducts: number[] = [];

  constructor() {
    this._productService.getProducts().subscribe((products) => {
      console.log(products.length);
      this._products.set(products);
      this._cdr.detectChanges();
    });
  }

  toggleProduct(product: Product) {
    if (this.selectedProducts.includes(product.id)) {
      this.selectedProducts = this.selectedProducts.filter((id) => {
        return id !== product.id;
      });
    } else {
      this.selectedProducts.push(product.id);
    }
  }

  toggleAllProducts(checked: boolean) {
    if (checked) {
      this.selectedProducts = this._products().map((product) => product.id);
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
        this._products().filter((product) => !this.selectedProducts.includes(product.id)),
      );

      this.selectedProducts = [];

      this._cdr.detectChanges();
    }
  }

  editProduct(product: Product) {
    this.router.navigate(['/edit', product.id]);
  }

  removeProduct(id: number) {
    this._productService.deleteProduct(id).subscribe(() => {
      this._products.set(this._products().filter((product) => product.id !== id));
      this._cdr.detectChanges();
    });
  }
}
