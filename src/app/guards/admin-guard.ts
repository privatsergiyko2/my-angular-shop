import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {Auth} from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth: Auth = inject(Auth);
 return auth.isAdmin$
};
