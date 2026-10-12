import {Component, inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss'
})
export class OrderSummary implements OnInit {
  @Input() selectedDelivery = 'standard';
  cartService = inject(CartService);

  cartItems: any[] = [];

  discountAmount = 0.00;

  deliveryOptions = [
    { value: 'standard', price: 4.99 },
    { value: 'express', price: 9.99 },
    { value: 'pickup', price: 0 }
  ];

  ngOnInit() {
    this.loadCartData();
  }

  loadCartData() {
    this.cartItems = this.cartService.cart || [];
  }

  get totalItemsCount(): number {
    let count = 0;
    for (const item of this.cartItems) {
      count += item.quantity || 1;
    }
    return count;
  }

  get subtotalPrice(): number {
    let total = 0;
    for (const item of this.cartItems) {
      const price = item.price || item.product?.price || 0;
      const qty = item.quantity || 1;
      total += price * qty;
    }
    return total;
  }

  get deliveryPrice(): number {
    return this.deliveryOptions.find(option => option.value === this.selectedDelivery)?.price ?? 0;
  }

  get totalPrice(): number {
    return this.subtotalPrice + this.deliveryPrice - this.discountAmount;
  }
}
