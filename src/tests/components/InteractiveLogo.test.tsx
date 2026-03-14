import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import InteractiveLogo from '@/components/InteractiveLogo';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('InteractiveLogo', () => {
  it('renders the logo image', () => {
    renderWithProviders(<InteractiveLogo />);
    const logo = screen.getByRole('img', { name: 'Claude Logo' });
    expect(logo).toBeInTheDocument();
  });

  it('navigates to /auth when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InteractiveLogo />);
    const logo = screen.getByRole('img', { name: 'Claude Logo' });
    const logoContainer = logo.closest('div.cursor-pointer');

    if (logoContainer) {
      await user.click(logoContainer);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/auth#login');
      });
    }
  });

  it('shows "Click to login" hint', () => {
    renderWithProviders(<InteractiveLogo />);
    const hint = screen.getByText('Click to login');
    expect(hint).toBeInTheDocument();
  });
});