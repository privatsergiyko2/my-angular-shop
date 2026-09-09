import { Injectable } from '@angular/core';
import {Product} from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: CartItem[] = [];


  constructor() {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem("cart");
  }

  saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  addToCart(product: Product) {
    const existingItem = this.cart.find(
      cartItem => cartItem.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        product: product,
        quantity: 1
      });
    }
    this.saveCart();
    console.log(this.cart);
  }




  removeProduct(id: number) {
    this.cart = this.cart.filter(product => product.product.id !== id)
    this.saveCart();
  }

  increaseQuantity(id: number) {
    const item = this.cart.find(
      cartItem => cartItem.product.id === id
    );

    if (item) {
      item.quantity++;
    }
    this.saveCart();
  }

  decreaseQuantity(id: number) {
    const item = this.cart.find(
      cartItem => cartItem.product.id === id
    );


    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.saveCart();
      } else {
        this.removeProduct(id)
      }
    }
  }
  getTotalPrice() {
    return this.cart.reduce((totalPrice, cartItem) => {
      return totalPrice + cartItem.product.price * cartItem.quantity;
    }, 0);
  }
}
