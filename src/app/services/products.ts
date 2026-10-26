import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';
import {HttpClient, HttpParams} from '@angular/common/http';
import { BehaviorSubject, catchError, throwError, tap, map, take } from 'rxjs';
import { apiUrl, environment } from '../../environments/environments';
import { toSignal } from '@angular/core/rxjs-interop';

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _http: HttpClient = inject(HttpClient);
  productsFromApi = signal(<Product[]>[]);

  getProducts(params) {
    // if (this._productSubject.getValue().length) {
    //   return this._productSubject.asObservable();
    // } else {
    //   return this._http.get<ProductsResponse>(`${apiUrl}/${environment.products}`).pipe(
    //     tap((response) => {
    //       this._productSubject.next(response.products);
    //     }),
    //     map((response) => {
    //       return response.products;
    //     }),
    //     catchError((error) => {
    //       return throwError(() => error);
    //     }),
    //   );
    // }

    return this._http.get<ProductsResponse>(`${apiUrl}/${environment.products}`, {
      params: params
    }).pipe(
      take(1),
      map((response) => response.products),
      tap((products) => {
        this.productsFromApi.set(products);
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  updateProductInList(updatedProduct: Product) {
    const updatedProducts = this.productsFromApi().map((product) => {
      if (product._id === updatedProduct._id) {
        return updatedProduct;
      } else {
        return product;
      }
    });

    console.log(updatedProducts);
    this.productsFromApi.set(updatedProducts);
  }

  getProductById(id: string | null) {
    return this._http.get<Product>(`${apiUrl}/${environment.products}/${id}`);
  }

  addProductsToApi(product: Product) {
    return this._http.post<Product>(`${apiUrl}/${environment.addProduct}`, product);
  }

  deleteProduct(id: string) {
    return this._http.delete(`${apiUrl}/${environment.products}/${id}`).pipe(
      tap((response) => {
        this.productsFromApi.set(this.productsFromApi().filter((product) => product._id !== id));
      }),
    );
  }

  updateProduct(id: string | null, data: Partial<Product>) {
    return this._http.patch<Product>(`${apiUrl}/${environment.products}/${id}`, data);
  }

  addProduct(product: Product) {
    const newProduct = [product, ...this.productsFromApi()];

    this.productsFromApi.set(newProduct);
  }
}
