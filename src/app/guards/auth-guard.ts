import { CanActivateFn } from '@angular/router';
import {Router} from '@angular/router';
import {inject} from '@angular/core';



export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem("user")
  const router = inject(Router)
  console.log('GUARD USER:', user);
  if(user) {
    return true
  } else {
   return  router.createUrlTree(["/login"])
  }
};
