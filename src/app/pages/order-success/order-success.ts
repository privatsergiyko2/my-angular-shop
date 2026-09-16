import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Order} from '../../models/order';
import {Orders} from '../../services/orders';

@Component({
  selector: 'app-order-success',
  imports: [
    RouterLink
  ],
  templateUrl: './order-success.html',
  styleUrl: './order-success.scss',
})
export class OrderSuccess {
  private _order = inject(Orders);

  order: Order = this._order.orders[this._order.orders.length - 1];
  private _router = inject(Router);

  goToProducts() {
    this._router.navigate(['/']);
  }
}
