import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Navbar} from './components/navbar/navbar';
import {Footer} from './components/footer/footer';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Auth} from './services/auth';
import {Favorites} from './services/favorites';
import {catchError, of, switchMap, filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    CommonModule,
    RouterLink
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);
  private auth = inject(Auth);
  private favorites = inject(Favorites);
  showFooter = signal(true);

  constructor() {
    this.auth.userSubject.pipe(
      switchMap(user => {
        this.favorites.favoriteRecords.set([]);

        if (!user) {
          return of([]);
        }

        return this.favorites.getFavoritesFromApi().pipe(
          catchError(error => {
            console.error('Помилка завантаження Favorites:', error);
            return of([]);
          })
        );
      }),
      takeUntilDestroyed()
    ).subscribe(records => {
      this.favorites.favoriteRecords.set(records);
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed()).subscribe(event => {
      const url = event.urlAfterRedirects;

      const hideFooter = url === '/admin' || url.startsWith('/admin/')
        || url === '/payment'|| url === '/register' || url === '/login'
      || url === '/add-page' || url.startsWith('/edit/');

      this.showFooter.set(!hideFooter);

      console.log('Current URL:', url);
      console.log('Hide Footer:', hideFooter);
    })
  }
}
