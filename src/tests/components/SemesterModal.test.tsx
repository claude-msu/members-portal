import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils/test-utils';
import SemesterModal from '@/components/modals/SemesterModal';

const mockToast = vi.fn();
const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: {}, error: null }),
        }),
      }),
    }),
  },
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('SemesterModal', () => {
  beforeEach(() => {
    mockToast.mockClear();
    mockOnClose.mockClear();
    mockOnSuccess.mockClear();
  });

  it('shows validation when submitting with empty semester code', async () => {
    renderWithProviders(
      <SemesterModal open onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const form = screen.getByRole('dialog').querySelector('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Required Field Missing',
          description: 'Please enter a semester code',
          variant: 'destructive',
        })
      );
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('shows validation when submitting with empty semester name', async () => {
    renderWithProviders(
      <SemesterModal open onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const codeInput = screen.getByPlaceholderText('W26');
    fireEvent.change(codeInput, { target: { value: 'W26' } });
    const form = screen.getByRole('dialog').querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Required Field Missing',
          description: 'Please enter a semester name',
          variant: 'destructive',
        })
      );
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
