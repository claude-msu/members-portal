import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { getItemStatus, useModalState, useFilteredItems } from '@/hooks/use-modal';

describe('getItemStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for null or undefined item', () => {
    expect(getItemStatus(null)).toBe(null);
    expect(getItemStatus(undefined as unknown as Parameters<typeof getItemStatus>[0])).toBe(null);
  });

  it('returns available when start date is in the future', () => {
    const item = {
      semesters: {
        start_date: '2025-07-01',
        end_date: '2025-08-01',
      },
    };
    const status = getItemStatus(item);
    expect(status).not.toBeNull();
    expect(status?.state).toBe('available');
    expect(status?.label).toBe('Available');
  });

  it('returns completed when end date is in the past', () => {
    const item = {
      semesters: {
        start_date: '2025-01-01',
        end_date: '2025-02-01',
      },
    };
    const status = getItemStatus(item);
    expect(status).not.toBeNull();
    expect(status?.state).toBe('completed');
    expect(status?.label).toBe('Completed');
  });

  it('returns in_progress when now is between start and end', () => {
    const item = {
      semesters: {
        start_date: '2025-05-01',
        end_date: '2025-07-01',
      },
    };
    const status = getItemStatus(item);
    expect(status).not.toBeNull();
    expect(status?.state).toBe('in_progress');
    expect(status?.label).toBe('In Progress');
  });

  it('returns available when start equals now (boundary)', () => {
    const item = {
      semesters: {
        start_date: '2025-06-15',
        end_date: '2025-07-15',
      },
    };
    const status = getItemStatus(item);
    expect(status?.state).toBe('in_progress');
  });
});

describe('useModalState', () => {
  it('initial state is closed with no selected item', () => {
    const { result } = renderHook(() => useModalState<{ id: string }>());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.modalType).toBe(null);
    expect(result.current.selectedItem).toBe(null);
  });

  it('openEdit sets modal type to edit and selected item', () => {
    const { result } = renderHook(() => useModalState<{ id: string; name: string }>());
    const item = { id: '1', name: 'Test' };

    act(() => {
      result.current.openEdit(item);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.modalType).toBe('edit');
    expect(result.current.selectedItem).toEqual(item);
  });

  it('openDetails sets modal type to details and selected item', () => {
    const { result } = renderHook(() => useModalState<{ id: string }>());
    const item = { id: '2' };

    act(() => {
      result.current.openDetails(item);
    });

    expect(result.current.modalType).toBe('details');
    expect(result.current.selectedItem).toEqual(item);
  });

  it('openMembers sets modal type to members and selected item', () => {
    const { result } = renderHook(() => useModalState<{ id: string }>());
    const item = { id: '3' };

    act(() => {
      result.current.openMembers(item);
    });

    expect(result.current.modalType).toBe('members');
    expect(result.current.selectedItem).toEqual(item);
  });

  it('close resets modal type and selected item', () => {
    const { result } = renderHook(() => useModalState<{ id: string }>());
    const item = { id: '1' };

    act(() => {
      result.current.openEdit(item);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.modalType).toBe(null);
    expect(result.current.selectedItem).toBe(null);
  });
});

describe('useFilteredItems', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('splits items into available, inProgress, and completed by semester dates', () => {
    const items = [
      { id: '1', name: 'Future', semesters: { start_date: '2025-07-01', end_date: '2025-08-01' } },
      { id: '2', name: 'Current', semesters: { start_date: '2025-05-01', end_date: '2025-07-01' } },
      { id: '3', name: 'Past', semesters: { start_date: '2025-01-01', end_date: '2025-02-01' } },
    ];
    const { result } = renderHook(() => useFilteredItems(items));

    expect(result.current.available).toHaveLength(1);
    expect(result.current.available[0]).toMatchObject({ id: '1', name: 'Future' });
    expect(result.current.inProgress).toHaveLength(1);
    expect(result.current.inProgress[0]).toMatchObject({ id: '2', name: 'Current' });
    expect(result.current.completed).toHaveLength(1);
    expect(result.current.completed[0]).toMatchObject({ id: '3', name: 'Past' });
  });

  it('respects custom filterFn when provided', () => {
    const items = [
      { id: '1', name: 'A', semesters: { start_date: '2025-07-01', end_date: '2025-08-01' } },
      { id: '2', name: 'B', semesters: { start_date: '2025-07-01', end_date: '2025-08-01' } },
    ];
    const filterOnlyFirst = (item: { id: string }) => item.id === '1';
    const { result } = renderHook(() => useFilteredItems(items, filterOnlyFirst));

    expect(result.current.available).toHaveLength(1);
    expect(result.current.available[0]).toMatchObject({ id: '1' });
  });
});
