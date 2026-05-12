import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NewTaskPayload } from '../../task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @ViewChild('titleInput') private titleInput?: ElementRef<HTMLInputElement>;
  @Output() addTask = new EventEmitter<NewTaskPayload>();
  title = '';
  plannedDate = '';
  description = '';
  error = '';

  focusTitleInput(): void {
    const el = this.titleInput?.nativeElement;
    el?.focus();
    el?.select();
  }

  submit(): void {
    const clean = this.title.trim();
    if (!clean) {
      this.error = 'Введите название задачи';
      return;
    }
    const date = this.plannedDate.trim();
    const desc = this.description.trim();
    const payload: NewTaskPayload = {
      title: clean,
      ...(date ? { plannedDate: date } : {}),
      ...(desc ? { description: desc } : {})
    };
    this.addTask.emit(payload);
    this.title = '';
    this.plannedDate = '';
    this.description = '';
    this.error = '';
  }
}
