import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  pages: InputSignal<any> = input();
  currentPage: InputSignal<any> = input();

  change: OutputEmitterRef<any> = output();

  changePage(page: number) {
    this.change.emit(page);
  };
}
