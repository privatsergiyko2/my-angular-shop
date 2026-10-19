import { Component, computed, input, InputSignal, output, OutputEmitterRef, signal } from '@angular/core';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-table',
  imports: [Pagination],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  products: InputSignal<any> = input();
  selectedProducts: InputSignal<any> = input();
  toggleProduct: OutputEmitterRef<any> = output();
  toggleAll: OutputEmitterRef<any> = output();
  removeProduct: OutputEmitterRef<any> = output();
  editProduct: OutputEmitterRef<any> = output();

  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  quantityPages = computed(() => {
    const pagesQuantity = Math.ceil(this.products().length / this.pageSize());
    return pagesQuantity;
  });

  changePage(page: number) {
    this.currentPage.set(page);
  }

  pages = computed(() => Array.from({ length: this.quantityPages() }, (_, i) => i + 1));

  paginationProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.products()?.slice(start, end);
  });

  toggleAllProducts(toogle: boolean) {
    this.toggleAll.emit(toogle);
  }

  remove(product: any) {
    this.removeProduct.emit(product);
  }

  edit(product: any) {
    this.editProduct.emit(product);
  }

  toggle(product: any) {
    this.toggleProduct.emit(product);
  }
}
