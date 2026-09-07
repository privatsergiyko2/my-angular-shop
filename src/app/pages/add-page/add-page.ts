import {Component, inject} from '@angular/core';
import {Product} from '../../models/product';
import {ProductsService} from '../../services/products';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-add-page',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './add-page.html',
  styleUrl: './add-page.scss',
})
export class AddPage {
  // mockProduct: Product = {
  //   id: 99,
  //   price: 200,
  //   name: 'serhiy',
  //   description: "good",
  //   rating: 5,
  //   category: 'norm',
  //   imageUrl: 'assets/images/product.png',
  // }

  private _cdr = inject(ChangeDetectorRef)

  private _productService: ProductsService = inject(ProductsService);

  myForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      // id: [0, Validators.required],
      price: [0, Validators.required],
      category: ['', Validators.required],
      thumbnail: ['assets/images/product.png', Validators.required],
      rating: [0, Validators.required],
      description: ['', Validators.required],
    });
  }

  isLoading = false;




  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this._productService.addProductsToApi({
        ...this.myForm.value
      }).subscribe(response => {
        console.log(response);
        this._productService.addProduct(response);
          console.log('BEFORE', this.isLoading);
          this.isLoading = false;
          this._cdr.detectChanges();
          console.log('AFTER', this.isLoading);
      },
          error => {
        console.log(error);
        this.isLoading = false;
      })
    }
  }
}
