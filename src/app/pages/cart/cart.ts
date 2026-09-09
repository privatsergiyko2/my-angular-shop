import {Component, inject} from '@angular/core';
import {CartService} from '../../services/cart';
import {ProductComponent} from '../../components/product/product';
import {Product} from '../../models/product';
import {HttpClient} from '@angular/common/http';
import {PaymentResponse} from '../../payment-response';
import {Router} from '@angular/router';


@Component({
  selector: 'app-cart',
  imports: [
    ProductComponent
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  public _http = inject(HttpClient);
  public cartService: CartService = inject(CartService);
  private router = inject(Router);

  protected removeFromCart($event: Product) {
    this.cartService.removeProduct($event.id)
  }



  pay() {
    this.router.navigate(['/payment']);
  }
}
