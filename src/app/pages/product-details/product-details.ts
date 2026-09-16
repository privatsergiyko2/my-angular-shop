import {ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Product} from '../../models/product';
import {ProductsService} from '../../services/products';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails  {
  private route: ActivatedRoute = inject(ActivatedRoute)
  private _productService = inject(ProductsService);

  id: string = this.route.snapshot.paramMap.get('id') || '';

  productSignal   = toSignal(
    this._productService.getProductById(Number(this.id))
  )

  product: Product | null = null;
}
