import {Injectable, OnInit, signal} from '@angular/core';
import {Order} from '../models/order';
import {parseJson} from '@angular/cli/src/utilities/json-file';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BackendOrder} from '../models/backend-order';


@Injectable({
  providedIn: 'root',
})
export class Orders {
  private readonly http = inject(HttpClient);
  orders: Order[] = [];
  backendOrders = signal<BackendOrder[]>([])

  constructor() {
    const orders = localStorage.getItem('orders');
    if (orders) {
      this.orders = JSON.parse(orders)
    }
  }




  getMyOrders(token: string) {
    return this.http.get<BackendOrder[]>('http://localhost:3000/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  }


  createOrder(orderData: unknown, token: string) {
    return this.http.post<{ _id: string }>(
      'http://localhost:3000/orders',
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }


  addOrder(order: Order) {
    this.orders.push(order);
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }
}
