import {Component, inject} from '@angular/core';
import {CartService} from '../services/cart';
import {HttpClient} from '@angular/common/http';
import {PaymentResponse} from '../payment-response';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {
  public _http = inject(HttpClient);
  public _cartservice = inject(CartService);

  paymentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cardNumber: new FormControl('', [Validators.required, Validators.minLength(16)]),
    expiry: new FormControl('', [Validators.required,  Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]),
    cvv: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })

  pay () {

    if(this.paymentForm.invalid){
      this.paymentForm.markAllAsTouched();
      return
    }
     const amount = this._cartservice.getTotalPrice()

    this._http.post<PaymentResponse>('http://localhost:3000/create-checkout', {amount: amount}).subscribe(response => {
      if (response.success === true) {
        alert("Оплата успішна!");
        this._cartservice.clearCart();
        this.paymentForm.reset();
      }
    })
  }

  protected readonly FormGroup = FormGroup;
}
