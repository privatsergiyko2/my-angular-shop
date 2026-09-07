import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, throwError, tap, map } from 'rxjs';


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

  products: Product[] = [
    {
      id: 1,
      title: 'iPhone 15',
      price: 799,
      description: 'Great smartphone',
      thumbnail: 'https://...',
      category: 'Smartphones',
      rating: 4.8
    },
    {
      id: 2,
      title: 'MacBook Air',
      price: 999,
      description: 'Powerful laptop',
      thumbnail: 'https://...',
      category: 'Laptops',
      rating: 4.9
    }
  ];

  private _http: HttpClient = inject(HttpClient);

  private _productSubject = new BehaviorSubject<Product[]>([]);

  getProducts$() {
    return this._productSubject.asObservable();
  }

  getProducts() {
    return this._http.get<ProductsResponse>(
      'https://dummyjson.com/products'
    ).pipe(
      tap(response => {
        this._productSubject.next(response.products);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    )
  }

  updateProductInList(updatedProduct: Product) {
    const updatedProducts = this._productSubject.value.map(product => {
      if(product.id === updatedProduct.id) {
        return updatedProduct;
      } else {
        return product;
      }
    })

    console.log(updatedProducts);
    this._productSubject.next(updatedProducts);
  }

  getProductById(id: number) {
    return this._http.get<Product>(`https://dummyjson.com/products/${id}`);
  }

  addProductsToApi(product: Product) {
   return this._http.post<Product>(`https://dummyjson.com/products/add`, product)
  }

  deleteProduct (id: number) {
      return this._http.delete(`https://dummyjson.com/products/${id}`);
  }

  updateProduct(id: number, data: Partial<Product>) {
    return this._http.patch<Product>(
      `https://dummyjson.com/products/${id}`,
      data
    );
  }

  removeProduct(id: number) {
    this.products = this.products.filter(product => product.id !== id);
  }

  addProduct(product: Product) {
    this.products.push(product);
    this._productSubject.next(this.products)
  }
}
