import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isPlannedDateDue, Task } from '../../task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggleTask = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<string>();

  get overdue(): boolean {
    return isPlannedDateDue(this.task);
  }
}
