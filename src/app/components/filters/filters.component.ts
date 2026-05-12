import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskFilter } from '../../task.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Input() activeFilter: TaskFilter = 'all';
  @Output() filterChange = new EventEmitter<TaskFilter>();
}
