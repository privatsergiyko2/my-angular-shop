import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Product} from '../../models/product';
import {ProductsService} from '../../services/products';

@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private _productService = inject(ProductsService);

  id: string = '';
  product: Product | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    console.log('ID:', this.id);

    this._productService.getProductById(Number(this.id)).subscribe(response => {
      console.log('API RESPONSE:', response);

      this.product = response;

      console.log('PRODUCT AFTER ASSIGN:', this.product);
    });
  }
}
