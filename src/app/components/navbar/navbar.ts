import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../services/cart';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter, map, take, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);

  currentUrl = this.router.events.pipe(
    takeUntilDestroyed(this.destroyRef),
    filter(event => event instanceof NavigationEnd),
    map(() => this.router.url),
  );

  constructor(public cartService: CartService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
