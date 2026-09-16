import { Injectable } from '@angular/core';
import {Order} from '../models/order';
import {parseJson} from '@angular/cli/src/utilities/json-file';

@Injectable({
  providedIn: 'root',
})
export class Orders {
  orders: Order[] = [];

  constructor() {
    const orders = localStorage.getItem('orders');
    if (orders) {
      this.orders = JSON.parse(orders)
    }
  }

  addOrder (order: Order) {
    this.orders.push(order);
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }
}
