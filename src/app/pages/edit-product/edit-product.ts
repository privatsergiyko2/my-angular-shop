import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, take, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _productService: ProductsService = inject(ProductsService);
  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);

  private readonly _productId: number = Number(this._route.snapshot.paramMap.get('id'));
  saveErrorMessage: string = '';
  isSaved: boolean   = false;
  isSaving: boolean = false;

  editForm: any = this._formBuilder.group({
    id: [0, Validators.required],
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    category: ['', Validators.required],
    rating: [0, Validators.required],
    thumbnail: ['', Validators.required],
  });

  constructor() {
    this._productService
      .getProductById(this._productId)
      .pipe(
        tap((product: Product) => {
          this.editForm.patchValue({
            id: product?.id,
            title: product?.title,
            price: product?.price,
            description: product?.description,
            category: product?.category,
            rating: product?.rating,
            thumbnail: product?.thumbnail,
          });

          this._cdr.detectChanges();
        }),
      )
      .subscribe();
  }

  save() {
    if (this.editForm.valid) {
      this.isSaving = true;

      this._productService
        .updateProduct(this._productId, this.editForm.value)
        .pipe(
          take(1),
          tap((response) => {
            this.isSaved = true;
            this._productService.updateProductInList(response);
          }),
          tap(() => {
            this._router.navigate(['/']);
          }),
          catchError((error) => {
            this.saveErrorMessage = 'Не вдалося оновити товар. Спробуйте ще раз.';
            this.isSaving = false;
            return throwError(() => error);
          }),
        )
        .subscribe();
    } else {
      this.editForm.markAllAsTouched();
    }
  }
}
