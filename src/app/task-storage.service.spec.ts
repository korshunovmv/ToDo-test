import { TaskStorageService } from './task-storage.service';

describe('TaskStorageService', () => {
  let service: TaskStorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new TaskStorageService();
  });

  it('adds a task with trimmed title', () => {
    service.addTask({ title: '  New task  ' });
    const tasks = service.getTasks();

    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('New task');
    expect(tasks[0].done).toBeFalse();
    expect(tasks[0].id).toBeTruthy();
    expect(tasks[0].plannedDate).toBeUndefined();
    expect(tasks[0].description).toBeUndefined();
  });

  it('stores planned date when provided', () => {
    service.addTask({ title: 'Task', plannedDate: '2026-06-01' });
    expect(service.getTasks()[0].plannedDate).toBe('2026-06-01');
  });

  it('stores description when provided', () => {
    service.addTask({ title: 'Task', description: '  Details here  ' });
    expect(service.getTasks()[0].description).toBe('Details here');
  });

  it('does not add empty task', () => {
    service.addTask({ title: '   ' });
    expect(service.getTasks().length).toBe(0);
  });

  it('toggles task state', () => {
    service.addTask({ title: 'Task' });
    const task = service.getTasks()[0];

    service.toggleTask(task.id);
    expect(service.getTaskById(task.id)?.done).toBeTrue();

    service.toggleTask(task.id);
    expect(service.getTaskById(task.id)?.done).toBeFalse();
  });

  it('deletes task by id', () => {
    service.addTask({ title: 'One' });
    service.addTask({ title: 'Two' });
    const toDelete = service.getTasks()[0];

    service.deleteTask(toDelete.id);
    expect(service.getTaskById(toDelete.id)).toBeUndefined();
    expect(service.getTasks().length).toBe(1);
  });

  it('updates description', () => {
    service.addTask({ title: 'With description' });
    const task = service.getTasks()[0];

    service.updateDescription(task.id, 'Hello details');
    expect(service.getTaskById(task.id)?.description).toBe('Hello details');
  });

  it('clears completed tasks only', () => {
    service.addTask({ title: 'Active' });
    service.addTask({ title: 'Completed' });
    const tasks = service.getTasks();
    service.toggleTask(tasks[0].id);

    service.clearCompleted();
    const remaining = service.getTasks();

    expect(remaining.length).toBe(1);
    expect(remaining[0].done).toBeFalse();
  });

  it('restores state from localStorage', () => {
    service.addTask({ title: 'Persisted' });
    const saved = service.getTasks()[0];

    const restored = new TaskStorageService();
    const restoredTask = restored.getTaskById(saved.id);

    expect(restoredTask).toBeDefined();
    expect(restoredTask?.title).toBe('Persisted');
  });
});
