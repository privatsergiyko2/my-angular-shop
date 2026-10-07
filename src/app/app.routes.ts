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
import {Admin} from './pages/admin-wrapper/admin/admin';
import {Reviews} from './pages/reviews/reviews';
import {Customers} from './pages/admin-wrapper/customers/customers';
import {AdminReviews} from './pages/admin-wrapper/admin-reviews/admin-reviews';
import { adminRoutes } from './pages/admin-wrapper/admin.routes';
import { AdminWrapper } from './pages/admin-wrapper/admin-wrapper';

export const routes: Routes = [
  {
    path: '',
    component: Products,
  },
  {
    path: 'products/:id',
    component: ProductDetails,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'add-page',
    component: AddPage,
    canActivate: [adminGuard],
  },
  {
    path: 'edit/:id',
    component: EditProduct,
    canActivate: [adminGuard],
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
    component: OrderDetails,
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'reviews',
    component: Reviews,
  },
  // TODO: TOT OPTIMIZED
  // {
  //   path: 'admin',
  //   component: AdminWrapper,
  //   canActivate: [authGuard, adminGuard],
  //   children: adminRoutes,
  // },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-wrapper/admin-wrapper').then((m) => m.AdminWrapper),
    loadChildren: () => import('./pages/admin-wrapper/admin.routes').then((m) => m.adminRoutes),
    canActivate: [authGuard, adminGuard],
  },
];
