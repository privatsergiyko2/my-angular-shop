import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {MatStep, MatStepper, MatStepperNext} from "@angular/material/stepper";
import {HttpClient} from '@angular/common/http';
import {Product} from '../../../models/product';
import {CartService} from '../../../services/cart';
import {Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-order',
  imports: [RouterLink, MatStepperNext, MatButton],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order implements OnInit {
  public _http = inject(HttpClient);
  recommendedProducts = signal<Product[]>([]);
  public cartService: CartService = inject(CartService);
  private router = inject(Router);
  selectedProducts: string[] = [];
  @Input() stepper?: MatStepper;

  onProceedToCheckout() {
    this.stepper?.next();
  }

  protected removeFromCart($event: Product) {
    this.cartService.removeProduct($event._id);
  }

  ngOnInit() {
    this.loadRecommendedProducts();
  }

  activeStepIndex = 0;

  loadRecommendedProducts() {
    const cartCategories = [...new Set(this.cartService.cart.map((item) => item.product.category))];

    if (cartCategories.length === 0) {
      this.recommendedProducts.set([]);
      return;
    }

    this._http.get<{ products: Product[] }>('https://dummyjson.com/products').subscribe((res) => {
      const cartItemIds = new Set(this.cartService.cart.map((item) => item.product._id));

      const filtered = res.products.filter(
        (product) => cartCategories.includes(product.category) && !cartItemIds.has(product._id),
      );
      console.log('Знайдені рекомендації:', filtered);
      this.recommendedProducts.set(filtered.slice(0, 4));
    });
  }

  selectCheckBox(checked: boolean, id: string) {
    if (checked === true) {
      this.selectedProducts.push(id);
    } else {
      this.selectedProducts = this.selectedProducts.filter((item) => item !== id);
    }
  }

  selectAll(checked: boolean) {
    if (checked === true) {
      this.selectedProducts = this.cartService.cart.map((item) => item.product._id);
    } else {
      this.selectedProducts = [];
    }
  }

  removeAll() {
    console.log(this.selectedProducts);
    this.selectedProducts.forEach((id) => {
      this.cartService.removeProduct(id);
    });
  }
}
