import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stepper from './stepper';
import { usePathname, useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock framer-motion components
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  motion: {
    p: ({ children, layout, ...props }: any) => (
      <div {...props} layout={layout ? layout.toString() : undefined}>
        {children}
      </div>
    ),
    div: ({ children, layout, ...props }: any) => (
      <div {...props} layout={layout ? layout.toString() : undefined}>
        {children}
      </div>
    ),
  },
}));

describe('Stepper Component', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockPush.mockClear();
    // Mock desktop view by default
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(min-width: 640px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  const renderStepper = (path: string) => {
    (usePathname as jest.Mock).mockReturnValue(path);
    return render(<Stepper />);
  };

  it('renders correctly with welcome step active', () => {
    renderStepper('/welcome');
    const desktopContainer = screen.getByTestId('desktop-stepper');
    expect(within(desktopContainer).getByText('Step 1 of 6')).toBeInTheDocument();
    expect(within(desktopContainer).getByText('Welcome')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Go to Welcome step')[0]).toHaveClass('border-blue-600');
  });

  it('renders all steps in desktop view', () => {
    renderStepper('/welcome');
    const desktopContainer = screen.getByTestId('desktop-stepper');
    const steps = [
      'Welcome',
      'Business Info',
      'Location',
      'Contact & Timings',
      'Services',
      'Review & Publish',
    ];
    steps.forEach((label) => {
      expect(within(desktopContainer).getByText(label)).toBeInTheDocument();
    });
  });

  it('navigates to correct step when circle is clicked', () => {
    renderStepper('/welcome');
    const businessInfoStep = screen.getAllByLabelText('Go to Business Info step')[0];
    fireEvent.click(businessInfoStep);
    expect(mockPush).toHaveBeenCalledWith('/business-info');
  });

  it('navigates to correct step when circle receives Enter key', () => {
    renderStepper('/welcome');
    const businessInfoStep = screen.getAllByLabelText('Go to Business Info step')[0];
    fireEvent.keyDown(businessInfoStep, { key: 'Enter' });
    expect(mockPush).toHaveBeenCalledWith('/business-info');
  });

  it('navigates to correct step when circle receives Space key', () => {
    renderStepper('/welcome');
    const businessInfoStep = screen.getAllByLabelText('Go to Business Info step')[0];
    fireEvent.keyDown(businessInfoStep, { key: ' ' });
    expect(mockPush).toHaveBeenCalledWith('/business-info');
  });

  it('shows correct active and completed states', () => {
    renderStepper('/location');
    const welcomeStep = screen.getAllByLabelText('Go to Welcome step')[0];
    expect(welcomeStep).toHaveClass('border-green-700');
    const businessInfoStep = screen.getAllByLabelText('Go to Business Info step')[0];
    expect(businessInfoStep).toHaveClass('border-green-700');
    const locationStep = screen.getAllByLabelText('Go to Location step')[0];
    expect(locationStep).toHaveClass('border-blue-600');
    const futureStep = screen.getAllByLabelText('Go to Review & Publish step')[0];
    expect(futureStep).toHaveClass('border-gray-300');
  });

  // it('shows completed badge for completed steps', () => {
  //   renderStepper('/services');
  //   const completedLabel = screen.getAllByLabelText('Go to Contact & Timings step')[0];
  //   expect(completedLabel.parentElement).toContainElement(
  //     screen.getByTitle('Contact & Timings').querySelector('svg')
  //   );
  //   const currentLabel = screen.getAllByLabelText('Go to Services step')[0];
  //   expect(currentLabel.parentElement).not.toContainElement(
  //     screen.getByTitle('Services').querySelector('svg')
  //   );
  // });

  it('shows connecting lines in desktop view', () => {
    renderStepper('/welcome');
    const desktopContainer = screen.getByTestId('desktop-stepper');
    const connectingLines = desktopContainer.querySelectorAll('.bg-blue-600.h-0\\.5');
    expect(connectingLines.length).toBe(5); // 6 steps - 1 = 5 lines
  });

  it('handles invalid pathname gracefully', () => {
    renderStepper('/invalid-path');
    const desktopContainer = screen.getByTestId('desktop-stepper');
    expect(within(desktopContainer).getByText('Step 1 of 6')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Go to Welcome step')[0]).toHaveClass('border-blue-600');
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(max-width: 639px)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it('shows only first 3 steps for Welcome step', () => {
      renderStepper('/welcome');
      const mobileContainer = screen.getByTestId('mobile-stepper');
      expect(within(mobileContainer).getByText('Step 1 of 6')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Welcome')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Business Info')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Location')).toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Contact & Timings')).not.toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Services')).not.toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Review & Publish')).not.toBeInTheDocument();
    });

    it('shows only first 3 steps for Business Info step', () => {
      renderStepper('/business-info');
      const mobileContainer = screen.getByTestId('mobile-stepper');
      expect(within(mobileContainer).getByText('Step 2 of 6')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Welcome')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Business Info')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Location')).toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Contact & Timings')).not.toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Services')).not.toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Review & Publish')).not.toBeInTheDocument();
    });

    it('shows correct 3 steps for middle step (Contact & Timings)', () => {
      renderStepper('/contact&timings');
      const mobileContainer = screen.getByTestId('mobile-stepper');
      expect(within(mobileContainer).getByText('Step 4 of 6')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Location')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Contact & Timings')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Services')).toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Welcome')).not.toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Business Info')).not.toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Review & Publish')).not.toBeInTheDocument();
    });

    it('shows last 3 steps for Review & Publish step', () => {
      renderStepper('/review&publish');
      const mobileContainer = screen.getByTestId('mobile-stepper');
      expect(within(mobileContainer).getByText('Step 6 of 6')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Contact & Timings')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Services')).toBeInTheDocument();
      expect(within(mobileContainer).getByText('Review & Publish')).toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Welcome')).not.toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Business Info')).not.toBeInTheDocument();
      expect(within(mobileContainer).queryByText('Location')).not.toBeInTheDocument();
    });

    it('shows progress dots for all steps', () => {
      renderStepper('/services');
      const mobileContainer = screen.getByTestId('mobile-stepper');
      expect(within(mobileContainer).getByText('Step 5 of 6')).toBeInTheDocument();
      const dots = within(mobileContainer).getAllByRole('presentation');
      expect(dots.length).toBe(6);
      expect(dots[0]).toHaveClass('bg-green-700'); // Welcome
      expect(dots[3]).toHaveClass('bg-green-700'); // Contact & Timings
      expect(dots[4]).toHaveClass('bg-green-700'); // Services (current)
      expect(dots[5]).toHaveClass('bg-gray-300');  // Review & Publish (not completed)
    });

    it('shows connecting lines in mobile view', () => {
      renderStepper('/welcome');
      const mobileContainer = screen.getByTestId('mobile-stepper');
      const connectingLines = mobileContainer.querySelectorAll('.bg-blue-600.h-0\\.5');
      expect(connectingLines.length).toBe(2); // Lines between Welcome-Business Info and Business Info-Location
    });
  });
});