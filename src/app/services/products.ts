import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, throwError, tap, map } from 'rxjs';
import { apiUrl, environment } from '../../environments/environments';


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
  private _productSubject = new BehaviorSubject<Product[]>([]);


  getProducts() {
    if (this._productSubject.getValue().length) {
      return this._productSubject.asObservable();
    } else {
      return this._http.get<ProductsResponse>(`${apiUrl}/${environment.products}`).pipe(
        tap((response) => {
          this._productSubject.next(response.products);
        }),
        map((response) => {
          return response.products;
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
    }
  }

  updateProductInList(updatedProduct: Product) {
    const updatedProducts = this._productSubject.value.map((product) => {
      if (product._id === updatedProduct._id) {
        return updatedProduct;
      } else {
        return product;
      }
    });

    console.log(updatedProducts);
    this._productSubject.next(updatedProducts);
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
       this._productSubject.next( this._productSubject.value.filter((product) => product._id !== id))
      })
    )
  }

  updateProduct(id: string | null, data: Partial<Product>) {
    return this._http.patch<Product>(`${apiUrl}/${environment.products}/${id}`, data);
  }

  addProduct(product: Product) {
    const newProduct = [product, ...this._productSubject.getValue()];

    this._productSubject.next(newProduct);
  }
}
