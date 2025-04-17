import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stepper from './stepper';
import { usePathname, useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Enhanced framer-motion mock that handles layout prop
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  motion: {
    p: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    div: ({ children, layout, ...props }: any) => <div data-layout={layout} {...props}>{children}</div>,
  },
}));

describe('Stepper Component', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockPush.mockClear();
  });

  const renderStepper = (path: string) => {
    (usePathname as jest.Mock).mockReturnValue(path);
    return render(<Stepper />);
  };

  it('renders correctly with welcome step active', () => {
    renderStepper('/welcome');
    
    // Check step indicator
    const stepIndicators = screen.getAllByText(/Step 1 of 6/i);
    expect(stepIndicators.length).toBeGreaterThan(0);
    
    // Check step navigation
    const welcomeSteps = screen.getAllByLabelText('Go to Welcome step');
    expect(welcomeSteps.length).toBeGreaterThan(0);
    
    // Check step label
    const welcomeLabels = screen.getAllByText('Welcome');
    expect(welcomeLabels.length).toBeGreaterThan(0);
  });

  it('renders correctly with business info step active', () => {
    renderStepper('/business-info');
    
    const stepIndicators = screen.getAllByText(/Step 2 of 6/i);
    expect(stepIndicators.length).toBeGreaterThan(0);
    
    const businessInfoSteps = screen.getAllByLabelText('Go to Business Info step');
    expect(businessInfoSteps.length).toBeGreaterThan(0);
    
    const businessInfoLabels = screen.getAllByText('Business Info');
    expect(businessInfoLabels.length).toBeGreaterThan(0);
  });

  it('navigates to correct step when circle is clicked', () => {
    renderStepper('/welcome');
    
    const businessInfoSteps = screen.getAllByLabelText('Go to Business Info step');
    fireEvent.click(businessInfoSteps[0]);
    
    expect(mockPush).toHaveBeenCalledWith('/business-info');
  });

  it('navigates to correct step when circle receives enter key', () => {
    renderStepper('/welcome');
    
    const businessInfoSteps = screen.getAllByLabelText('Go to Business Info step');
    fireEvent.keyDown(businessInfoSteps[0], { key: 'Enter' });
    
    expect(mockPush).toHaveBeenCalledWith('/business-info');
  });

  it('shows correct active and completed states', () => {
    renderStepper('/location');
    
    // Welcome step should be completed
    const welcomeSteps = screen.getAllByLabelText('Go to Welcome step');
    expect(welcomeSteps[0]).toHaveClass('border-green-700');
    
    // Business Info step should be completed
    const businessInfoSteps = screen.getAllByLabelText('Go to Business Info step');
    expect(businessInfoSteps[0]).toHaveClass('border-green-700');
    
    // Location step should be current
    const locationSteps = screen.getAllByLabelText('Go to Location step');
    expect(locationSteps[0]).toHaveClass('border-blue-600');
    
    // Contact & Timings step should be inactive
    const contactSteps = screen.getAllByLabelText('Go to Contact & Timings step');
    expect(contactSteps[0]).toHaveClass('border-gray-300');
  });

 

  it('shows all steps on desktop view', () => {
    // Mock window width to simulate desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    renderStepper('/welcome');
    
    // Desktop view should show all steps
    expect(screen.getAllByText('Welcome').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Business Info').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Location').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contact & Timings').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Review & Publish').length).toBeGreaterThan(0);
  });

 
});