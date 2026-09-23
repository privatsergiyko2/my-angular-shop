import {Routes} from '@angular/router';
import {ProductDetails} from './pages/product-details/product-details';
import {Cart} from './pages/cart/cart';
import {Products} from './pages/products/products';
import {AddPage} from './pages/add-page/add-page';
import {EditProduct} from './pages/edit-product/edit-product';
import {FavoritesComponent} from './pages/favorites/favorites';
import {Payment} from './pages/payment/payment';
import {OrderSuccess} from './pages/order-success/order-success';
import {Login} from './pages/login/login';
import {Register} from './pages/register/register';
import {authGuard} from './guards/auth-guard';
import {OrdersPage} from './pages/orders/orders';
import {OrderDetails} from './pages/order-details/order-details';
import {Profile} from './pages/profile/profile';

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
    canActivate: [authGuard],
  },
  {
    path: 'order-success',
    component: OrderSuccess,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'orders',
    component: OrdersPage,
  },
  {
    path: 'orders/:id',
    component: OrderDetails
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  }
];
