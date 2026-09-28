import {ChangeDetectorRef, Component, inject} from '@angular/core'
import {RouterLink} from '@angular/router';
import {ProductsService} from '../../services/products';
import {Product} from '../../models/product';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [
    RouterLink
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  _cdr = inject(ChangeDetectorRef);
  _productService: ProductsService = inject(ProductsService)
  _products: Product[] = [];

  constructor() {
    this._productService.getProducts().subscribe(products => {
      console.log('ADMIN PRODUCTS:', products);
      this._products = products;
      this._cdr.detectChanges();
    })
  }

  removeProduct(id: number) {
    this._productService.deleteProduct(id).subscribe(() => {
      this._products = this._products.filter(product => product.id !== id);
    })
  }
}
