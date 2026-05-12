import { isPlannedDateDue } from './task.model';

describe('isPlannedDateDue', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 4, 12));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('is true when planned date is today and task is active', () => {
    expect(isPlannedDateDue({ plannedDate: '2026-05-12', done: false })).toBeTrue();
  });

  it('is true when planned date is in the past', () => {
    expect(isPlannedDateDue({ plannedDate: '2026-05-11', done: false })).toBeTrue();
  });

  it('is false when planned date is in the future', () => {
    expect(isPlannedDateDue({ plannedDate: '2026-05-13', done: false })).toBeFalse();
  });

  it('is false when task is completed', () => {
    expect(isPlannedDateDue({ plannedDate: '2026-05-11', done: true })).toBeFalse();
  });

  it('is false when planned date is missing', () => {
    expect(isPlannedDateDue({ plannedDate: undefined, done: false })).toBeFalse();
  });
});
