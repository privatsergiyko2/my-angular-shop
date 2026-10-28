import {inject, Injectable, signal} from '@angular/core';
import {Product} from '../models/product';
import {CartItem} from '../models/cart-item';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CartResponse} from '../models/cart-response';
import {ProductsService} from './products';
import {forkJoin, map, of, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _productsService = inject(ProductsService);
  private readonly _http = inject(HttpClient);
  // cart: CartItem[] = [];
  private cartState = signal<CartItem[]>([]);

  get cart(): CartItem[] {
    return this.cartState();
  }

  set cart(items: CartItem[]) {
    this.cartState.set(items);
  }

  private loadCartVersion = 0;


  constructor() {
    // const savedCart = localStorage.getItem("cart");


    // if (savedCart) {
    //   this.cart = JSON.parse(savedCart);
    // }

    this.loadCart()
  }

  clearCart() {
    // this.cart = [];
    // localStorage.removeItem("cart");
    this.clearCartOnServer()
  }

  clearCartOnServer() {
    const token = localStorage.getItem('token');

    this._http.delete<CartResponse>(
      'http://localhost:3000/cart/items',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    ).subscribe(() => {
      this.cart = [];
    });
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));

  }

  // loadCart() {
  //   const token = localStorage.getItem('token');
  //
  //   this._http.get<CartResponse>('http://localhost:3000/cart', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     }
  //   }).subscribe((data) => {
  //     this.cart = []
  //     data.items.forEach((item) => {
  //       this._productsService.getProductById(item.productId).subscribe(product => {
  //         this.cart = [
  //           ...this.cart,
  //           {
  //             product: product,
  //             quantity: item.quantity
  //           }
  //         ];
  //       })
  //     });
  //   })
  // }

  loadCart() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.cart = [];
      return;
    }

    const version = ++this.loadCartVersion;

    this._http.get<CartResponse>('http://localhost:3000/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).pipe(
      switchMap((data) => {
        if (data.items.length === 0) {
          return of([] as CartItem[]);
        }

        const requests = data.items.map((item) =>
          this._productsService.getProductById(item.productId).pipe(
            map((product) => ({
              product: product,
              quantity: item.quantity
            }))
          )
        );

        return forkJoin(requests);
      })
    ).subscribe({
      next: (items) => {
        if (version === this.loadCartVersion) {
          this.cart = items.filter((item) => item.product != null);
        }
      },
      error: (error) => {
        console.error('Помилка завантаження кошика:', error);
      }
    });
  }

  addProductToServer(productId: string) {
    const token = localStorage.getItem('token');
    this._http.post<CartResponse>('http://localhost:3000/cart/items', {
      productId: productId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).subscribe((data) => {
      this.loadCart()
    })
  }

  addToCart(product: Product) {
    // const existingItem = this.cart.find(
    //   cartItem => cartItem.product._id === product._id
    // );
    //
    // if (existingItem) {
    //   existingItem.quantity++;
    // } else {
    //   this.cart.push({
    //     product: product,
    //     quantity: 1
    //   });
    // }
    // this.saveCart();
    // console.log(this.cart);
    this.addProductToServer(product._id)
  }

  removeProductFromServer(productId: string) {
    const token = localStorage.getItem('token');
    this._http.delete<CartResponse>(
      `http://localhost:3000/cart/items/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    ).subscribe(() => {
      this.loadCart();
    });
  }

  removeProduct(productId: string) {
    this.removeProductFromServer(productId);
  }

  increaseQuantity(productId: string) {
    this.addProductToServer(productId);
    // const item = this.cart.find(
    //   cartItem => cartItem.product._id === id
    // );
    //
    // if (item) {
    //   item.quantity++;
    // }
    // this.saveCart();
  }


  decreaseQuantityOnServer(productId: string) {
    const token = localStorage.getItem('token');

    this._http.patch<CartResponse>(
      `http://localhost:3000/cart/items/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    ).subscribe(() => {
      this.loadCart();
    });
  }

  decreaseQuantity(productId: string) {
    this.decreaseQuantityOnServer(productId);

    // const item = this.cart.find(
    //   cartItem => cartItem.product._id === id
    // );
    //
    //
    // if (item) {
    //   if (item.quantity > 1) {
    //     item.quantity--;
    //     this.saveCart();
    //   } else {
    //     this.removeProduct(id)
    //   }
    // }
  }

  getTotalPrice() {
    return this.cart.reduce((totalPrice, cartItem) => {
      return totalPrice + cartItem.product.price * cartItem.quantity;
    }, 0);
  }
}
