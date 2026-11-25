import {ChangeDetectorRef, Component, computed, inject, OnInit, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Pagination} from '../../../components/pagination/pagination';
import {ReviewsService} from '../../../services/reviews';
import {Review} from '../../../models/review';
import {DatePipe} from '@angular/common';
import {Sort} from '../../../components/sort/sort';
import {AdminSidebar} from '../../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-reviews',
  imports: [RouterLink, RouterLinkActive, Pagination, DatePipe, Sort, AdminSidebar],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.scss',
})
export class AdminReviews implements OnInit {
  _cdr = inject(ChangeDetectorRef);
  _reviewService: ReviewsService = inject(ReviewsService);
  menuOpen: string | null = null;
  reviews = signal<Review[]>([]);
  selectedReviews = signal<string[]>([]);
  selectedReview: Review | null = null;
  sort = signal('newest');

  sortOptions = [
    {label: 'Newest', value: 'newest'},
    {label: 'Oldest', value: 'oldest'},
    {label: 'Rating: High → Low', value: 'rating-desc'},
    {label: 'Rating: Low → High', value: 'rating-asc'},
    {label: 'Product: A → Z', value: 'product-asc'},
    {label: 'Product: Z → A', value: 'product-desc'},
  ];

  ngOnInit() {
    this._reviewService.getReviewsFromApi().subscribe(reviews => {
      console.log('REVIEWS FROM BACKEND:', reviews);
      this.reviews.set(reviews);
    });
  }

  sortedProducts = computed(() => {
    if (this.sort() === 'newest') {
      const products = [...this.reviews()];
      products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return products;
    }

    if (this.sort() === 'oldest') {
      const products = [...this.reviews()];
      products.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return products;
    }

    if (this.sort() === 'product-asc') {
      const products = [...this.reviews()];
      products.sort((a, b) => a.productTitle.localeCompare(b.productTitle));
      return products;
    }

    if (this.sort() === 'product-desc') {
      const products = [...this.reviews()];
      products.sort((a, b) => b.productTitle.localeCompare(a.productTitle));
      return products;
    }

    if (this.sort() === 'rating-desc') {
      const products = [...this.reviews()];
      products.sort((a, b) => b.rating - a.rating);
      return products;
    }

    if (this.sort() === 'rating-asc') {
      const products = [...this.reviews()];
      products.sort((a, b) => a.rating - b.rating);
      return products;
    }

    return this.reviews();
  });

  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  quantityPages = computed(() => {
    const pagesQuantity = Math.ceil(this.reviews().length / this.pageSize());
    return pagesQuantity;
  });

  pages = computed(() => Array.from({length: this.quantityPages()}, (_, i) => i + 1));

  changePage(page: number) {
    this.currentPage.set(page);
  }

  paginationReviews = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.sortedProducts().slice(start, end);
  });

  // constructor() {
  //   console.log(this._reviewService.getReviews());
  //   this.reviews.set(this._reviewService.getReviews());
  // }


  toggleReview(review: Review) {
    if (this.selectedReviews().includes(review._id)) {
      this.selectedReviews.update(reviews =>
        reviews.filter(id => id !== review._id)
      );
    } else {
      this.selectedReviews.update(reviews =>
        [...reviews, review._id]
      );
    }
  }

  toggleAllReviews(checked: boolean) {
    if (checked) {
      this.selectedReviews.update(selected => [
        ...new Set([
          ...selected,
          ...this.paginationReviews().map(review => review._id)
        ])
      ]);
    } else {
      this.selectedReviews.update(selected =>
        selected.filter(id =>
          !this.paginationReviews().some(review => review._id === id)
        )
      );
    }
  }

  allReviewsSelected = computed(() => {
      const  reviews = this.paginationReviews();

      if(reviews.length === 0  ) {
        return false
      }

      return reviews.every(review => this.selectedReviews().includes(review._id));
  });

  deleteSelectedReviews() {
    if (this.selectedReviews().length > 0) {
      this.selectedReviews().forEach(id => {
        this._reviewService.deleteReview(id).subscribe({
          next: () => {
            this.reviews.update(reviews =>
              reviews.filter(review => review._id !== id)
            );
            this.selectedReviews.update(selected =>
              selected.filter(selectedId => selectedId !== id)
            );
          },
          error: (error) => {
            console.error('Delete review error:', error);
          }
        });
      });
    }
  }

  toggleMenu(id: string) {
    if (this.menuOpen === id) {
      this.menuOpen = null;
    } else {
      this.menuOpen = id;
    }
  }

  closeMenu() {
    this.menuOpen = null;
  }

  deleteReview(id: string) {
    this._reviewService.deleteReview(id).subscribe({
      next: () => {
        this.reviews.update(reviews => {
          return reviews.filter(review => review._id !== id);
        })
      },
      error: (error) => {
        console.error('Delete review error:', error);
      }
    });
  }

  viewReview(review: Review) {
    this.selectedReview = review;
  }

  closeModal() {
    this.selectedReview = null;
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
