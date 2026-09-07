import {Component, inject} from '@angular/core';
import {CartService} from '../../services/cart';
import {ProductComponent} from '../../components/product/product';
import {Product} from '../../models/product';


@Component({
  selector: 'app-cart',
  imports: [
    ProductComponent
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  public cartService: CartService = inject(CartService);

  protected removeFromCart($event: Product) {
    this.cartService.removeProduct($event.id)
  }
}
