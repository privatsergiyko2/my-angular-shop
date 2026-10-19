import {Component, computed, inject, signal} from '@angular/core';
import {Orders} from '../../services/orders';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {Order} from '../../models/order';
import {Router} from '@angular/router';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersPage {
  _ordersService = inject(Orders)
  orders = this._ordersService.orders;
  protected readonly Date = Date;
  router = inject(Router);


  sortOrder = signal<'newest' | 'oldest'>("newest")

  currentPage = signal<number>(1);
  pageSize = signal<number>(6);


  sortedOrders = computed(() => {
    const list = [...(this.orders || [])];

    return list.sort((a, b) => {
      const timeA = new Date(a.id).getTime();
      const timeB = new Date(b.id).getTime();

      if (this.sortOrder() === 'newest') {
        return timeB - timeA;
      } else {
        return timeA - timeB;
      }
    });
  });

  paginationOrders = computed(() => {


    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return  this.sortedOrders().slice(start, end);

  })

  quantityPages = computed(() => {
    const pagesQuantity = Math.ceil(this.sortedOrders().length / this.pageSize());
    return pagesQuantity;
  })

  pages = computed(() =>
    Array.from(
      { length: this.quantityPages() },
      (_, i) => i + 1
    )
  );

  changePage(page: number) {
    this.currentPage.set(page);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'newest' | 'oldest';
    this.sortOrder.set(value);
    this.currentPage.set(1);
    console.log(value);
  }

  viewDetails (order: Order) {
    this.router.navigate(['/orders', order.id]);
  }

  protected readonly Array = Array;
}
