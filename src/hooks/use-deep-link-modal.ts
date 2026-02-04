import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

type ModalType = 'edit' | 'details' | 'members' | null;

export const useDeepLinkModal = <T extends { id: string }>(isBoardOrAbove: boolean) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [modalTypeOverride, setModalTypeOverride] = useState<ModalType>(null);

    // Get modal state from URL
    const id = searchParams.get('id');

    // Determine modal type:
    // 1. If modalTypeOverride is set (e.g., for members modal), use that
    // 2. Otherwise, base it on role when ID is present in URL
    let modalType: ModalType = null;
    if (modalTypeOverride) {
        modalType = modalTypeOverride;
    } else if (id) {
        modalType = isBoardOrAbove ? 'edit' : 'details';
    }

    const isOpen = modalType !== null;

    // Open modal with role-based type and update URL
    const open = (item: T, itemId: string) => {
        setSelectedItem(item);
        setModalTypeOverride(null); // Clear any override
        setSearchParams({ id: itemId });
    };

    // Explicit open functions for specific modal types
    const openEdit = (item: T, itemId: string) => {
        setSelectedItem(item);
        setModalTypeOverride(null);
        setSearchParams({ id: itemId });
    };

    const openDetails = (item: T, itemId: string) => {
        setSelectedItem(item);
        setModalTypeOverride(null);
        setSearchParams({ id: itemId });
    };

    const openMembers = (item: T) => {
        setSelectedItem(item);
        setModalTypeOverride('members');
        // Don't change URL for members modal
    };

    // Close modal and clear URL
    const close = () => {
        setSearchParams({});
        setSelectedItem(null);
        setModalTypeOverride(null);
    };

    // Clear selected item and override when ID is removed from URL
    useEffect(() => {
        if (!id) {
            setSelectedItem(null);
            setModalTypeOverride(null);
        }
    }, [id]);

    return {
        isOpen,
        modalType,
        selectedItem,
        id,
        setSelectedItem,
        open,
        openEdit,
        openDetails,
        openMembers,
        close,
    };
};
