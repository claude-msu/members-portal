import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import Auth from '@/pages/common/Auth';

const mockSignIn = vi.fn();
const mockToast = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signIn: mockSignIn,
    loading: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {},
    from: () => ({}),
  },
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

function renderAuth(initialEntry = '/auth#login') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Auth form validation', () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockToast.mockClear();
  });

  it('shows validation and does not call signIn when email is empty', async () => {
    const user = userEvent.setup();
    renderAuth();

    const submitButton = screen.getByRole('button', { name: 'Login' });
    await user.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Required Field Missing',
        description: 'Please enter your email address',
        variant: 'destructive',
      })
    );
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('shows validation and does not call signIn when password is empty', async () => {
    const user = userEvent.setup();
    renderAuth();

    const emailInput = screen.getByLabelText(/University Email/i);
    await user.type(emailInput, 'user@school.edu');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    await user.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Required Field Missing',
        description: 'Please enter your password',
        variant: 'destructive',
      })
    );
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('shows validation for non-.edu email and does not call signIn', async () => {
    const user = userEvent.setup();
    renderAuth();

    const emailInput = screen.getByLabelText(/University Email/i);
    await user.type(emailInput, 'user@gmail.com');
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    await user.type(passwordInput, 'password123');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    await user.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Invalid Email',
        description: 'Please use your .edu email address.',
        variant: 'destructive',
      })
    );
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('shows validation for short password and does not call signIn', async () => {
    const user = userEvent.setup();
    renderAuth();

    const emailInput = screen.getByLabelText(/University Email/i);
    await user.type(emailInput, 'user@school.edu');
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    await user.type(passwordInput, '12345');
    const form = passwordInput.closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Invalid Password',
          description: 'Password must be at least 6 characters long',
          variant: 'destructive',
        })
      );
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signIn when email is .edu and password is at least 6 characters', async () => {
    const user = userEvent.setup();
    renderAuth();

    const emailInput = screen.getByLabelText(/University Email/i);
    await user.type(emailInput, 'user@school.edu');
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    await user.type(passwordInput, 'password123');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user@school.edu', 'password123');
    });
  });
});
