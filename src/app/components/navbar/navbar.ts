import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../services/cart';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter, map, take, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Auth} from '../../services/auth';
import {Admin} from '../../pages/admin/admin';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  auth: Auth = inject(Auth);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);

  currentUrl = this.router.events.pipe(
    takeUntilDestroyed(this.destroyRef),
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.url),
  );

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  constructor(public cartService: CartService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
