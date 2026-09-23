import {ChangeDetectorRef,Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Product} from '../../models/product';
import {ProductsService} from '../../services/products';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  selector: 'app-edit-product',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct {
  private _route = inject(ActivatedRoute);
  public _productService = inject(ProductsService);
  private _cdr = inject(ChangeDetectorRef);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  saveErrorMessage = '';
  isSaved = false
  isSaving = false;
  editForm!: FormGroup;
  product: Product | null = null;


  constructor() {
    const id = Number(this._route.snapshot.paramMap.get('id'))
    this._productService.getProductById(id).subscribe(product => {
      this.product = product;
      this.editForm = this._formBuilder.group({
        title: [product.title, Validators.required],
        price: [
          product.price,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],
        description: [product.description, Validators.required],
        category: [product.category, Validators.required],
        rating: [product.rating, Validators.required],
        thumbnail: [product.thumbnail, Validators.required],
      });
      this.editForm.valueChanges.subscribe(value => {
      })
      this._cdr.detectChanges();
    });
  }

  save () {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const id = Number(this._route.snapshot.paramMap.get('id'))
    const data = this.editForm.value;
    this.isSaving = true;
    this._productService.updateProduct(id, data).subscribe(response => {
      this.isSaved = true;
      this._productService.updateProductInList(response);
      this._router.navigate(['/']);
      this.isSaving = false;
    },
      error => {
      this.saveErrorMessage = 'Не вдалося оновити товар. Спробуйте ще раз.';
      this.isSaving = false;
      })
  }
}
