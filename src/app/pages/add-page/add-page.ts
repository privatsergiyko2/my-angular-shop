import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, take, tap } from 'rxjs';
import { Auth } from '../../services/auth';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product';

@Component({
  selector: 'app-add-page',
  imports: [RouterLink, ReactiveFormsModule, RouterLinkActive, AsyncPipe],
  templateUrl: './add-page.html',
  styleUrl: './add-page.scss',
})
export class AddPage {
  auth: Auth = inject(Auth);
  router = inject(Router);
  private _cdr = inject(ChangeDetectorRef);
  private fb: FormBuilder = inject(FormBuilder);
  private _productService: ProductsService = inject(ProductsService);

  myForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, Validators.required],
    discountPercentage: [0],
    rating: [0, Validators.required],
    stock: [0],
    tags: [[]],
    brand: [''],
    sku: [''],
    weight: [0],
    dimensions: this.fb.group({
      width: [0],
      height: [0],
      depth: [0],
    }),
    warrantyInformation: [''],
    shippingInformation: [''],
    availabilityStatus: ['In Stock'],
    reviews: [[]],
    returnPolicy: [''],
    minimumOrderQuantity: [1],
    images: [[]],
    thumbnail: ['https://blocks.astratic.com/img/general-img-landscape.png', Validators.required],
  });

  isLoading = false;

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this._productService
        .addProductsToApi({
          ...this.myForm.value,
        } as Product)
        .pipe(
          take(1),
          tap((response) => {
            console.log(response);
            this._productService.addProduct(response);
            this.isLoading = false;
            this.router.navigateByUrl('/');
            this._cdr.detectChanges();
          }),
          catchError((error) => {
            console.log(error);
            this.isLoading = false;
            return error;
          }),
        )
        .subscribe();
    }
  }
}
