import { Customers } from './customers/customers';
import { AdminReviews } from './admin-reviews/admin-reviews';
import { authGuard } from '../../guards/auth-guard';
import { Admin } from './admin/admin';
import { Route, Routes } from '@angular/router';


export const adminRoutes: Route[] = [
  {
    path: 'products',
    component: Admin,
    canActivate: [authGuard],
  },
  {
    path: 'customers',
    component: Customers,
  },
  {
    path: 'reviews',
    component: AdminReviews,
  },
  {
    path: '',
    redirectTo: '/admin/products',
    pathMatch: 'full',
  }
];
