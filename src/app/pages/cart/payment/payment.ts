import {Component, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {injectStripe, StripePaymentElementComponent} from 'ngx-stripe';

import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';

import {CartService} from '../../../services/cart';
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
  styleUrl: './payment.scss'
})
export class Payment implements OnInit, OnDestroy {
  @Input() orderId: string | null = null;
  @Input() stepper?: MatStepper;
  private _http = inject(HttpClient);
  private _cartService = inject(CartService);
  private _router = inject(Router);
  private statusTimeout?: ReturnType<typeof setTimeout>;
  private destroyed = false;

  isPaying = false;

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

  stripe = injectStripe(
    'pk_test_51UDqKPBjQAEVUlJaXg0uZlyEC2z10bj9v7nMfCEvOPckzwFogqoJlVrliNxl1m8FBvJPlSjwCh7vcpJ4XshRcDEk00oBHuPT7d'
  );

  // 1. Спочатку перевіряємо замовлення
  ngOnInit() {

    if (!this.orderId) {
      console.error('Order ID is missing');
      return;
    }

    const orderId = this.orderId;
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('JWT token is missing');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    // Перевіряємо статус у NestJS і Stripe
    this._http.get<{ paymentStatus: string }>(
      `http://localhost:3000/payments/status/${orderId}`,
      {headers}
    ).subscribe({
      next: (response) => {

        if (this.destroyed) return;

        // Якщо вже оплачено — не створюємо новий платіж
        if (response.paymentStatus === 'paid') {
          this._cartService.clearCart();
          this._router.navigate(['/order-success']);
          return;
        }

        // Якщо ще не оплачено — отримуємо client_secret
        this._http.post<{ client_secret: string }>(
          'http://localhost:3000/payments',
          {orderId},
          {headers}
        ).subscribe({
          next: (paymentResponse) => {

            if (this.destroyed) return;

            this.elementsOptions = {
              locale: 'en',
              clientSecret: paymentResponse.client_secret
            };
          },

          error: (error) => {
            console.error('Error creating payment:', error);
            alert('Could not prepare payment. Please try again.');
          }
        });
      },

      error: (error) => {
        console.error('Error loading order status:', error);
        alert('Could not check order status.');
      }
    });
  }

  // 2. Повернутися до доставки
  goBack(): void {
    this.stepper?.previous();
  }

  // 3. Підтверджуємо оплату через Stripe
  pay() {

    // Захист від повторного натискання
    if (this.isPaying) {
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (!this.elementsOptions.clientSecret || !this.paymentElement?.elements) {
      alert('Payment form is not ready yet.');
      return;
    }

    const {name, email} = this.paymentForm.getRawValue();

    this.isPaying = true;

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
    }).subscribe({
      next: (result) => {

        if (this.destroyed) return;

        if (result.error) {
          console.error('Stripe payment error:', result.error);

          // Якщо PaymentIntent уже підтверджений,
          // перевіряємо статус замість повторної оплати
          if (result.error.code === 'payment_intent_unexpected_state') {
            this.checkPaymentStatus();
            return;
          }

          this.isPaying = false;
          alert(result.error.message ?? 'Payment failed.');
          return;
        }

        if (
          result.paymentIntent?.status === 'succeeded' ||
          result.paymentIntent?.status === 'processing'
        ) {
          this.checkPaymentStatus();
          return;
        }

        this.isPaying = false;
        alert('Payment was not completed.');
      },

      error: (error) => {
        console.error('Payment confirmation error:', error);
        this.isPaying = false;
        alert('Could not confirm payment. Check your order before retrying.');
      }
    });
  }

  // 4. Повторно перевіряємо статус оплати
  checkPaymentStatus(attempt = 0) {

    if (this.destroyed) return;
    if (!this.orderId) return;

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('JWT token is missing');
      return;
    }

    const maxAttempts = 10;

    this._http.get<{ paymentStatus: string }>(
      `http://localhost:3000/payments/status/${this.orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {

        if (this.destroyed) return;

        console.log('Payment status:', response.paymentStatus);

        // Успішна оплата
        if (response.paymentStatus === 'paid') {

          this._cartService.clearCart();
          this._router.navigate(['/order-success']);

          return;
        }

        // Невдала оплата
        if (response.paymentStatus === 'failed') {

          this.isPaying = false;
          alert('Payment failed.');

          return;
        }

        // Очікуємо підтвердження від Stripe
        if (attempt < maxAttempts - 1) {

          this.statusTimeout = setTimeout(() => {
            this.checkPaymentStatus(attempt + 1);
          }, 2000);

        } else {

          alert(
            'Payment confirmation is taking longer than expected. ' +
            'Please check your order status before trying again.'
          );
        }
      },

      error: (error) => {

        console.error('Error checking payment:', error);

        alert(
          'Could not check payment status. ' +
          'Please reload the page to check before paying again.'
        );
      }
    });
  }

  // 5. Зупиняємо таймер, якщо компонент закривається
  ngOnDestroy(): void {

    this.destroyed = true;

    if (this.statusTimeout !== undefined) {
      clearTimeout(this.statusTimeout);
    }
  }
}


