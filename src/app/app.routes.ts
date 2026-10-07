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
import {OrdersPage} from './pages/orders/orders';
import {OrderDetails} from './pages/order-details/order-details';
import {Profile} from './pages/profile/profile';
import {authGuard} from './guards/auth-guard';
import {adminGuard} from './guards/admin-guard';
import {Admin} from './pages/admin/admin';
import {Reviews} from './pages/reviews/reviews';
import {Customers} from './pages/customers/customers';
import {AdminReviews} from './pages/admin-reviews/admin-reviews';

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
    canActivate: [adminGuard]
  },
  {
    path: 'edit/:id',
    component: EditProduct,
    canActivate: [adminGuard]
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
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard],
  },
  {
    path: 'reviews',
    component: Reviews,
  },
  {
    path: 'customers',
    component: Customers,
  },
  {
    path: 'admin/reviews',
    component: AdminReviews,
    canActivate: [authGuard, adminGuard]
  },
];
