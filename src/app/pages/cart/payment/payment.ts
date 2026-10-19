import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {provideNgxStripe} from 'ngx-stripe';


import {
  injectStripe,
  StripePaymentElementComponent
} from 'ngx-stripe';

import {
  StripeElementsOptions,
  StripePaymentElementOptions,

} from '@stripe/stripe-js';


import {CartService} from '../../../services/cart';
import {Orders} from '../../../services/orders';
import {Order} from '../../../models/order';
import {MatStepper} from '@angular/material/stepper';
import {OrderSummary} from '../order-summary/order-summary';

@Component({
  selector: 'app-payment',
  imports: [
    ReactiveFormsModule,
    StripePaymentElementComponent,
    MatStepper,
    OrderSummary
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment implements OnInit {
  @Input() stepper?: MatStepper;
  private _http = inject(HttpClient);
  private _cartService = inject(CartService);
  private _orders = inject(Orders);
  private _router = inject(Router);

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  paymentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs'
    }
  };

  stripe = injectStripe('pk_test_51UDqKPBjQAEVUlJaXg0uZlyEC2z10bj9v7nMfCEvOPckzwFogqoJlVrliNxl1m8FBvJPlSjwCh7vcpJ4XshRcDEk00oBHuPT7d');

  ngOnInit() {
    const amount = this._cartService.getTotalPrice();

    this._http.post<{ client_secret: string }>(
      'http://localhost:3000/create-payment-intent',
      {
        amount: Math.round(amount * 100),
        currency: 'usd'
      }
    ).subscribe(response => {
      this.elementsOptions.clientSecret = response.client_secret;
    });
  }


  goBack(): void {
    this.stepper?.previous();
  }


  pay() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    const {name, email} = this.paymentForm.getRawValue();

    this.stripe.confirmPayment({
      elements: this.paymentElement.elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: name ?? '',
            email: email ?? ''
          }
        }
      },
      redirect: 'if_required'
    }).subscribe(result => {

      if (result.error) {
        console.error(result.error);
        alert(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {

        const order: Order = {
          name: name ?? '',
          id: Date.now(),
          items: this._cartService.cart,
          total: this._cartService.getTotalPrice()
        };

        this._orders.addOrder(order);
        this._cartService.clearCart();

        this._router.navigate(['/order-success']);
      }
    });
  }
}

