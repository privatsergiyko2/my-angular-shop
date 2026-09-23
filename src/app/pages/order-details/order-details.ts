import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink } from '@angular/router';
import {Orders} from '../../services/orders';
import {CurrencyPipe, DatePipe} from '@angular/common';


@Component({
  selector: 'app-order-details',
  imports: [
    DatePipe,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  route = inject(ActivatedRoute);
  _ordersService = inject(Orders);
  orderId = Number(this.route.snapshot.paramMap.get('id'));


  constructor() {
  console.log(this.orderId);
  console.log(this.order);
  }

  order = this._ordersService.orders.find(order => order.id === this.orderId);

}
