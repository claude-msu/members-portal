import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TooltipProvider delayDuration={0} skipDelayDuration={0}>
          {children}
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders>{children}</AllTheProviders>,
    ...options,
  });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
