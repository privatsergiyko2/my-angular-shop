import {Component, inject, OnInit, signal} from '@angular/core';
import {MatStep} from "@angular/material/stepper";
import {HttpClient} from '@angular/common/http';
import {Product} from '../../../models/product';
import {CartService} from '../../../services/cart';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [
    MatStep,
    RouterLink
  ],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order implements OnInit {
  public _http = inject(HttpClient);
  recommendedProducts = signal<Product[]>([]);
  public cartService: CartService = inject(CartService);
  private router = inject(Router);
  selectedProducts: number[] = [];

  protected removeFromCart($event: Product) {
    this.cartService.removeProduct($event.id)
  }

  ngOnInit() {
    this.loadRecommendedProducts()
  }

  activeStepIndex = 0;

  loadRecommendedProducts() {
    const cartCategories = [...new Set(this.cartService.cart.map((item) => item.product.category))];

    if (cartCategories.length === 0) {
      this.recommendedProducts.set([])
      return
    }

    this._http.get<{products : Product[]}>('https://dummyjson.com/products')
      .subscribe(res => {
        const cartItemIds = new Set(this.cartService.cart.map((item) => item.product.id));

        const filtered = res.products.filter(product =>
          cartCategories.includes(product.category) && !cartItemIds.has(product.id)
        );
        console.log('Знайдені рекомендації:', filtered);
        this.recommendedProducts.set(filtered.slice(0, 4));
      })
  }

  selectCheckBox (checked: boolean, id: number) {
    if (checked === true) {
      this.selectedProducts.push(id);
    } else{
      this.selectedProducts = this.selectedProducts.filter((item) =>  item !== id);
    }
  }

  selectAll(checked: boolean) {
    if (checked === true) {
      this.selectedProducts = this.cartService.cart.map(item => item.product.id);
    } else {
      this.selectedProducts = [];
    }

  }

  removeAll() {
    console.log(this.selectedProducts);
    this.selectedProducts.forEach((id) => {
      this.cartService.removeProduct(id)
    });
  }

  pay() {
    this.router.navigate(['/payment']);
  }
}
