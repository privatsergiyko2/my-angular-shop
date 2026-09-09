import {Routes} from '@angular/router';
import {ProductDetails} from './pages/product-details/product-details';
import {Cart} from './pages/cart/cart';
import {Products} from './pages/products/products';
import {AddPage} from './pages/add-page/add-page';
import {EditProduct} from './pages/edit-product/edit-product';
import {FavoritesComponent} from './pages/favorites/favorites';
import {Payment} from './payment/payment';

export const routes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetails,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: '',
    component: Products,
  },
  {
    path: 'add-page',
    component: AddPage,
  },
  {
    path: 'edit/:id',
    component: EditProduct,
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
  },
  {
    path: 'payment',
    component: Payment,
  }
];
