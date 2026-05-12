import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { NewTaskPayload, Task, TaskFilter } from '../../task.model';
import { TaskStorageService } from '../../task-storage.service';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent implements OnInit, OnDestroy {
  @ViewChild(TaskFormComponent) private createTaskForm?: TaskFormComponent;

  tasks: Task[] = [];
  filter: TaskFilter = 'all';
  searchQuery = '';
  isCreateModalOpen = false;
  private search$ = new Subject<string>();
  private searchSub?: Subscription;

  constructor(
    private taskStorageService: TaskStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshTasks();
    this.searchSub = this.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchQuery = value;
      });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onAddTask(payload: NewTaskPayload): void {
    this.taskStorageService.addTask(payload);
    this.refreshTasks();
    this.closeCreateModal();
  }

  onToggleTask(id: string): void {
    this.taskStorageService.toggleTask(id);
    this.refreshTasks();
  }

  onDeleteTask(id: string): void {
    this.taskStorageService.deleteTask(id);
    this.refreshTasks();
  }

  onFilterChange(filter: TaskFilter): void {
    this.filter = filter;
  }

  onSearch(query: string): void {
    this.search$.next(query.trim().toLowerCase());
  }

  clearCompleted(): void {
    this.taskStorageService.clearCompleted();
    this.refreshTasks();
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
    this.cdr.detectChanges();
    queueMicrotask(() => this.createTaskForm?.focusTitleInput());
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (!this.isCreateModalOpen) {
      return;
    }
    this.closeCreateModal();
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter((task) => {
      const byFilter =
        this.filter === 'all'
          ? true
          : this.filter === 'active'
            ? !task.done
            : task.done;
      const bySearch = task.title.toLowerCase().includes(this.searchQuery);
      return byFilter && bySearch;
    });
  }

  get totalCount(): number {
    return this.tasks.length;
  }

  get completedCount(): number {
    return this.tasks.filter((task) => task.done).length;
  }

  get activeCount(): number {
    return this.totalCount - this.completedCount;
  }

  private refreshTasks(): void {
    this.tasks = this.taskStorageService.getTasks();
  }
}
