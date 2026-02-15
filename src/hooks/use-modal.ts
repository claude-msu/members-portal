import { useState } from 'react';

// Hook for managing modal state across different modal types
export const useModalState = <T,>() => {
    const [modalType, setModalType] = useState<'edit' | 'details' | 'members' | null>(null);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    return {
        isOpen: modalType !== null,
        modalType,
        selectedItem,
        openEdit: (item: T) => {
            setSelectedItem(item);
            setModalType('edit');
        },
        openDetails: (item: T) => {
            setSelectedItem(item);
            setModalType('details');
        },
        openMembers: (item: T) => {
            setSelectedItem(item);
            setModalType('members');
        },
        close: () => {
            setModalType(null);
            setSelectedItem(null);
        },
    };
};

// Helper function for computing item status (available/in-progress/completed)
export const getItemStatus = (item) => {
    if (!item) return null;

    const now = new Date();
    const start = new Date(item.semesters.start_date);
    const end = new Date(item.semesters.end_date);

    if (!start || !end) {
        // If no dates available, consider it available (for items without semesters)
        return {
            label: 'Available',
            variant: 'outline' as const,
            state: 'available' as const,
        };
    }

    if (start > now) {
        return {
            label: 'Available',
            variant: 'green' as const,
            state: 'available' as const,
        };
    }

    if (end < now) {
        console.log("ended");
        return {
            label: 'Completed',
            variant: 'red' as const,
            state: 'completed' as const,
        };
    }

    return {
        label: 'In Progress',
        variant: 'blue' as const,
        state: 'in_progress' as const,
    };
};

// Helper function for filtering items by status
export const useFilteredItems = <T>(
    items: T[],
    filterFn?: (item: T, status: ReturnType<typeof getItemStatus>) => boolean
) => {
    const available: T[] = [];
    const inProgress: T[] = [];
    const completed: T[] = [];

    items.forEach((item) => {
        const status = getItemStatus(item);
        if (!status) return;

        // Apply custom filter if provided
        if (filterFn && !filterFn(item, status)) return;

        switch (status.state) {
            case 'available':
                available.push(item);
                break;
            case 'in_progress':
                inProgress.push(item);
                break;
            case 'completed':
                completed.push(item);
                break;
        }
    });

    return { available, inProgress, completed };
};