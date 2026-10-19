import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sort',
  imports: [],
  templateUrl: './sort.html',
  styleUrl: './sort.scss',
})
export class Sort {
  @Input() sort: { label: string; value: string }[] = [];
  @Output() sortChange: EventEmitter<string> = new EventEmitter();
}
