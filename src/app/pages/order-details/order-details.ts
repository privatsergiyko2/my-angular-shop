import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Orders} from '../../services/orders';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {BackendOrder} from '../../models/backend-order';
import {signal} from '@angular/core';

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
export class OrderDetails implements OnInit {
  route = inject(ActivatedRoute);
  _ordersService = inject(Orders);
  orderId: any = this.route.snapshot.paramMap.get('id');
  // order: BackendOrder | null = null;
  order = signal<BackendOrder | null>(null);

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      return
    }
    if (!this.orderId) {
      return
    }
    console.log('Order ID from URL:', this.orderId);

    this._ordersService.getMyOrders(token).subscribe({
      next: (orders) => {
        console.log('Orders from MongoDB:', orders);

        this.order.set(
          orders.find(order => order._id === this.orderId) ?? null
        );

        console.log('Found order:', this.order());
      }
    })
  }


  constructor() {
    // console.log(this.orderId);
    // console.log(this.order);
  }

  // order = this._ordersService.orders.find(order => order._id === this.orderId);


}
