import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {CartService} from '../../services/cart';
import {ProductComponent} from '../../components/product/product';
import {Product} from '../../models/product';
import {HttpClient} from '@angular/common/http';
import {PaymentResponse} from '../../payment-response';
import {Router} from '@angular/router';
import {RouterLink} from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import {Order} from './order/order';
import {Shipping} from './shipping/shipping';
import {Payment} from './payment/payment';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {OrderSuccess} from './order-success/order-success';



@Component({
  selector: 'app-cart',
  imports: [
    ProductComponent,
    RouterLink,
    MatStepperModule,
    Order,
    Shipping,
    Payment,
    ReactiveFormsModule,
    OrderSuccess,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  private fb = inject(FormBuilder);
  @ViewChild(Shipping) shippingComp?: Shipping;
  public _http = inject(HttpClient);
  recommendedProducts = signal<Product[]>([]);
  public cartService: CartService = inject(CartService);
  private router = inject(Router);
  selectedProducts: string[] = [];
  isPaid = false;

  onPaymentSucces() {
    this.isPaid = true;
  }

  shippingForm = this.fb.group({
    useDefaultAddress: [false],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    country: ['Romania', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    apartment: [''],
    city: ['', Validators.required],
    region: ['', Validators.required],
    postalCode: ['', Validators.required],
  });

  protected removeFromCart($event: Product) {
    this.cartService.removeProduct($event._id);
  }

  ngOnInit() {
    this.loadRecommendedProducts();
  }

  activeStepIndex = 0;

  stepTitles = [
    {
      title: 'Your Order',
      subtitle: 'Review your items, update quantities, and proceed to checkout.',
    },
    { title: 'Shipping', subtitle: 'Enter your shipping address and choose a delivery method.' },
    { title: 'Payment', subtitle: 'Select a payment method and complete your purchase.' },
    { title: 'Review', subtitle: 'Review your order details before final submission.' },
  ];

  onStepChange(event: any) {
    this.activeStepIndex = event.selectedIndex;
  }

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

  pay() {
    this.router.navigate(['/payment']);
  }
}
