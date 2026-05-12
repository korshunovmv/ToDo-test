import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../task.model';
import { TaskStorageService } from '../../task-storage.service';

@Component({
  selector: 'app-task-details-page',
  templateUrl: './task-details-page.component.html',
  styleUrls: ['./task-details-page.component.css']
})
export class TaskDetailsPageComponent implements OnInit {
  task?: Task;
  description = '';

  constructor(
    private route: ActivatedRoute,
    private taskStorageService: TaskStorageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.task = this.taskStorageService.getTaskById(id);
    this.description = this.task?.description ?? '';
  }

  saveDescription(): void {
    if (!this.task) {
      return;
    }
    this.taskStorageService.updateDescription(this.task.id, this.description);
    this.task = this.taskStorageService.getTaskById(this.task.id);
  }
}
