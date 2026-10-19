import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import {CartService} from '../../../services/cart';
import {OrderSummary} from '../order-summary/order-summary';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatStepper,
    CommonModule,
    OrderSummary
  ],
  templateUrl: './shipping.html',
  styleUrl: './shipping.scss',
})
export class Shipping implements OnInit {
  @Input() stepper?: MatStepper;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  authService = inject(Auth);
  cartService = inject(CartService);

  cartItems: any[] = [];
  selectedDelivery = 'standard';
  discountAmount = 0.00;

  @Input({ required: true }) shippingForm!: FormGroup;

  deliveryOptions = [
    {
      value: 'standard',
      label: 'Standard Delivery',
      description: 'Delivery within 3–5 business days',
      price: 4.99,
      time: '3–5 days'
    },
    {
      value: 'express',
      label: 'Express Delivery',
      description: 'Delivery within 1–2 business days',
      price: 9.99,
      time: '1–2 days'
    },
    {
      value: 'pickup',
      label: 'Pickup from Store',
      description: 'Collect your order from our partner location',
      price: 0,
      time: '2–4 days'
    },
  ];

  ngOnInit() {
    this.loadUserData();
    this.loadCartData();
  }

  loadUserData() {
    this.authService.userSubject?.subscribe(user => {
      if (user) {
        const nameParts = (user.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        this.shippingForm.patchValue({
          firstName: firstName,
          lastName: lastName,
        });
      }
    });
  }

  loadCartData() {
    this.cartItems = this.cartService.cart || [];
  }


  selectDelivery(method: string) {
    this.selectedDelivery = method;
  }

  goBack() {
    this.stepper?.previous();
  }

  goNext() {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }
    this.stepper?.next();
  }
}
