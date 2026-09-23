import {Component, inject} from '@angular/core';
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
    RouterLink
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersPage {
  _ordersService = inject(Orders)
  orders = this._ordersService.orders;
  protected readonly Date = Date;
  router = inject(Router);

  viewDetails (order: Order) {
    this.router.navigate(['/orders', order.id]);
  }
}
