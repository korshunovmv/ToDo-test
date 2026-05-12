export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  /** Локальная календарная дата в формате YYYY-MM-DD */
  plannedDate?: string;
  description?: string;
}

export interface NewTaskPayload {
  title: string;
  /** YYYY-MM-DD или пусто */
  plannedDate?: string;
  /** Необязательное описание при создании */
  description?: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';

/** Сегодняшняя дата пользователя в формате YYYY-MM-DD (локальный календарь). */
export function localTodayIso(): string {
  const t = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
}

/** Плановая дата наступила или прошла: активная задача и today >= plannedDate. */
export function isPlannedDateDue(task: Pick<Task, 'plannedDate' | 'done'>): boolean {
  if (!task.plannedDate || task.done) {
    return false;
  }
  return localTodayIso() >= task.plannedDate;
}
