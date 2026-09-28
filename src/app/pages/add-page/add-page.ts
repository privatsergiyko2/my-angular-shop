import {Component, inject} from '@angular/core';
import {ProductsService} from '../../services/products';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ChangeDetectorRef} from '@angular/core';
import {catchError, take, tap} from 'rxjs';
import {Auth} from '../../services/auth';


@Component({
  selector: 'app-add-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    RouterLinkActive
  ],
  templateUrl: './add-page.html',
  styleUrl: './add-page.scss',
})
export class AddPage {
  _auth = inject(Auth);
  isAdmin = this._auth.isAdmin()
  private _cdr = inject(ChangeDetectorRef)
  private fb: FormBuilder = inject(FormBuilder);
  private _productService: ProductsService = inject(ProductsService);

  myForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    price: [0, Validators.required],
    category: ['', Validators.required],
    thumbnail: ['assets/images/product.png', Validators.required],
    rating: [0, Validators.required],
    description: ['', Validators.required],
  });


  isLoading = false;


  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this._productService.addProductsToApi({
        ...this.myForm.value
      }).pipe(
        take(1),
        tap((response) => {
          console.log(response);
          this._productService.addProduct(response);
          this.isLoading = false;
          this._cdr.detectChanges();
        }),
        catchError((error) => {
          console.log(error);
          this.isLoading = false;
          return error
        })
      ).subscribe()
    }
  }
}
