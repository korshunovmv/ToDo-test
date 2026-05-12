import { Injectable } from '@angular/core';
import { NewTaskPayload, Task } from './task.model';

const STORAGE_KEY = 'todo-app-tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskStorageService {
  private tasks: Task[] = this.loadTasks();

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  addTask(payload: NewTaskPayload): void {
    const cleanTitle = payload.title.trim();
    if (!cleanTitle) {
      return;
    }

    const cleanDate = payload.plannedDate?.trim();
    const cleanDescription = payload.description?.trim();
    const newTask: Task = {
      id: this.generateId(),
      title: cleanTitle,
      done: false,
      createdAt: Date.now(),
      ...(cleanDate ? { plannedDate: cleanDate } : {}),
      ...(cleanDescription ? { description: cleanDescription } : {})
    };
    this.tasks = [newTask, ...this.tasks];
    this.persist();
  }

  toggleTask(id: string): void {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    this.persist();
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.persist();
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter((task) => !task.done);
    this.persist();
  }

  updateDescription(id: string, description: string): void {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, description } : task
    );
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  private loadTasks(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as Task[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item) => typeof item.id === 'string');
    } catch {
      return [];
    }
  }

  private generateId(): string {
    const random = Math.random().toString(36).slice(2, 10);
    return `${Date.now()}-${random}`;
  }
}
