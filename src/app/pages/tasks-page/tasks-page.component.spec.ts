import { ChangeDetectorRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { TaskStorageService } from '../../task-storage.service';
import { TasksPageComponent } from './tasks-page.component';

describe('TasksPageComponent', () => {
  let storage: jasmine.SpyObj<TaskStorageService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;
  let component: TasksPageComponent;

  beforeEach(() => {
    storage = jasmine.createSpyObj<TaskStorageService>('TaskStorageService', [
      'getTasks',
      'addTask',
      'toggleTask',
      'deleteTask',
      'clearCompleted'
    ]);

    storage.getTasks.and.returnValue([
      { id: '1', title: 'First task', done: false, createdAt: 1 },
      { id: '2', title: 'Done task', done: true, createdAt: 2 },
      { id: '3', title: 'Another active', done: false, createdAt: 3 }
    ]);

    cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', [
      'detectChanges',
      'markForCheck'
    ]);

    component = new TasksPageComponent(storage, cdr);
    component.ngOnInit();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('calculates stats correctly', () => {
    expect(component.totalCount).toBe(3);
    expect(component.completedCount).toBe(1);
    expect(component.activeCount).toBe(2);
  });

  it('filters by active status', () => {
    component.onFilterChange('active');
    expect(component.filteredTasks.length).toBe(2);
    expect(component.filteredTasks.every((task) => !task.done)).toBeTrue();
  });

  it('filters by completed status', () => {
    component.onFilterChange('completed');
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].done).toBeTrue();
  });

  it('applies debounced search by title', fakeAsync(() => {
    component.onSearch('first');
    expect(component.filteredTasks.length).toBe(3);

    tick(300);
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].title).toContain('First');
  }));

  it('refreshes tasks after add', () => {
    component.openCreateModal();
    component.onAddTask({ title: 'New one', plannedDate: '2026-05-20' });

    expect(storage.addTask).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'New one',
        plannedDate: '2026-05-20'
      })
    );
    expect(storage.getTasks).toHaveBeenCalledTimes(2);
    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('calls clearCompleted and refreshes list', () => {
    component.clearCompleted();
    expect(storage.clearCompleted).toHaveBeenCalled();
    expect(storage.getTasks).toHaveBeenCalledTimes(2);
  });

  it('opens and closes create modal', () => {
    expect(component.isCreateModalOpen).toBeFalse();

    component.openCreateModal();
    expect(component.isCreateModalOpen).toBeTrue();
    expect(cdr.detectChanges).toHaveBeenCalled();

    component.closeCreateModal();
    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('closes modal on Escape when open', () => {
    component.openCreateModal();
    expect(component.isCreateModalOpen).toBeTrue();

    component.onEscapeKey();
    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('does not close modal on Escape when already closed', () => {
    component.onEscapeKey();
    expect(component.isCreateModalOpen).toBeFalse();
  });
});
