import {ChangeDetectorRef, Component, computed, inject, signal} from '@angular/core'
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ProductsService} from '../../services/products';
import {Product} from '../../models/product';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  router = inject(Router)
  _cdr = inject(ChangeDetectorRef);
  _productService: ProductsService = inject(ProductsService)
  _products = signal<Product[]>([]);
  selectedProducts: number[] = [];

  constructor() {
    this._productService.getProducts().subscribe(products => {
      console.log(products.length);
      this._products.set(products);
      this._cdr.detectChanges();
    })
  }

  currentPage = signal<number>(1);
  pageSize = signal<number>(6);


  paginationProducts = computed(() => {


    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return  this._products().slice(start, end);

  })

  quantityPages = computed(() => {
    const pagesQuantity = Math.ceil(this._products().length / this.pageSize());
    return pagesQuantity;
  })

  changePage(page: number) {
    this.currentPage.set(page)
  }

  pages = computed(() =>
    Array.from(
      { length: this.quantityPages() },
      (_, i) => i + 1
    )
  );

  toggleProduct(product: Product) {
    if (this.selectedProducts.includes(product.id)) {
      this.selectedProducts = this.selectedProducts.filter((id) => {
           return id !== product.id;
      })
    } else {
        this.selectedProducts.push(product.id);
    }
  }

  toggleAllProducts(checked: boolean) {
      if (checked) {
        this.selectedProducts = this._products().map(product => product.id)
      } else {
        this.selectedProducts = []
      }
  }

  deleteSelectedProducts() {
    if (this.selectedProducts.length > 0) {

      this.selectedProducts.forEach(id => {
        this._productService.deleteProduct(id).subscribe();
      });

      this._products.set(this._products().filter(
        product => !this.selectedProducts.includes(product.id)
      ))

      this.selectedProducts = [];

      this._cdr.detectChanges();
    }
  }


  editProduct(product: Product) {
    this.router.navigate(['/edit', product.id]);
  }

  removeProduct(id: number) {
    this._productService.deleteProduct(id).subscribe(() => {
      this._products.set(this._products().filter(product => product.id !== id))
      this._cdr.detectChanges();
    })
  }
}
