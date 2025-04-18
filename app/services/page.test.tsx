import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Services from './page';
import { useRouter } from 'next/navigation';
import businessData from '@/data/businessData.json';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the Button component
jest.mock('@heroui/button', () => ({
  Button: ({ children, onClick, type, className }: any) => (
    <button onClick={onClick} type={type} className={className}>
      {children}
    </button>
  ),
}));

describe('Services Component', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockPush.mockClear();
  });

  it('renders without crashing', () => {
    render(<Services />);
    // More specific selector for the heading
    expect(screen.getByRole('heading', { name: /services/i, level: 2 })).toBeInTheDocument();
  });

  it('displays initial services from businessData', () => {
    render(<Services />);
    const initialServices = businessData.subcategories[0].businesses[0].services;
    
    initialServices.forEach((service, index) => {
      // Use getByLabelText with the specific label text pattern
      const nameInput = screen.getByLabelText(`Service Name:`, { selector: `#service-name-${index}` });
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue(service.name);
    });
  });

  it('allows adding a new service', () => {
    render(<Services />);
    const initialServiceCount = businessData.subcategories[0].businesses[0].services.length;
    
    const addButton = screen.getByRole('button', { name: '+ Add Service' });
    fireEvent.click(addButton);
    
    const serviceInputs = screen.getAllByLabelText(/Service Name:/i);
    expect(serviceInputs).toHaveLength(initialServiceCount + 1);
    
    const newInput = serviceInputs[initialServiceCount];
    expect(newInput).toHaveValue('');
  });

  it('allows removing a service', () => {
    render(<Services />);
    const initialServiceCount = businessData.subcategories[0].businesses[0].services.length;
    
   
    if (initialServiceCount > 1) {
      const removeButtons = screen.getAllByRole('button', { name: 'Remove Service' });
      fireEvent.click(removeButtons[0]);
      
      const serviceInputs = screen.getAllByLabelText(/Service Name:/i);
      expect(serviceInputs).toHaveLength(initialServiceCount - 1);
    }
  });

  it('updates service name when input changes', () => {
    render(<Services />);
    const serviceInput = screen.getAllByLabelText(/Service Name:/i)[0];
    const newValue = 'Updated Service Name';
    
    fireEvent.change(serviceInput, { target: { value: newValue } });
    expect(serviceInput).toHaveValue(newValue);
  });

  it('updates service price when select changes', () => {
    render(<Services />);
    const priceSelect = screen.getAllByLabelText(/Price:/i)[0];
    const newValue = 'GBP £75';
    
    fireEvent.change(priceSelect, { target: { value: newValue } });
    expect(priceSelect).toHaveValue(newValue);
  });


  it('navigates to previous page when Back button is clicked', () => {
    render(<Services />);
    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/contact&timings');
  });

  it('navigates to next page when Next button is clicked', () => {
    render(<Services />);
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/review&publish');
  });

  it('has proper accessibility attributes', () => {
    render(<Services />);
    const form = screen.getByTestId('services-form');
    expect(form).toHaveAttribute('aria-describedby', 'form-instructions');
    
   
    const instructionsId = form.getAttribute('aria-describedby');
    const instructions = document.getElementById(instructionsId!);
    expect(instructions).toBeInTheDocument();
    expect(instructions).toHaveClass('sr-only');
    expect(instructions).toHaveTextContent(/Enter service details including name and price/i);
  });
});