
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactAndTimings from './page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));


jest.mock('@/data/businessData.json', () => ({
  subcategories: [
    {
      businesses: [
        {
          contact: {
            phone: "+1-555-123-4567",
            email: "contact@example.com",
            website: "https://example.com",
          },
          timings: {
            monday: "09:00 AM - 06:00 PM",
            tuesday: "09:00 AM - 06:00 PM",
            wednesday: "09:00 AM - 06:00 PM",
            thursday: "09:00 AM - 06:00 PM",
            friday: "09:00 AM - 06:00 PM",
            saturday: "10:00 AM - 04:00 PM",
            sunday: "Closed",
          },
          cta: {
            call: "+1-555-987-6543",
            bookUrl: "https://example.com/book",
            getDirections: "https://maps.example.com",
          },
        },
      ],
    },
  ],
}));


jest.mock('@heroui/button', () => ({
  Button: ({ children, onClick, type, className, color }: any) => (
    <button
      onClick={onClick}
      type={type}
      className={className}
      data-color={color}
    >
      {children}
    </button>
  ),
}));


jest.mock('@heroicons/react/24/outline', () => ({
  ClockIcon: () => <svg data-testid="clock-icon" />,
}));

// describe('ContactAndTimings Component', () => {
//   const mockPush = jest.fn();
//   beforeEach(() => {
//     (useRouter as jest.Mock).mockReturnValue({
//       push: mockPush,
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders the form with all sections', () => {
//     render(<ContactAndTimings />);
    
//     expect(screen.getByRole('form', { name: '' })).toBeInTheDocument();
//     expect(screen.getByText('Contact and Timings')).toBeInTheDocument();
//     expect(screen.getByText('Contact Information')).toBeInTheDocument();
//     expect(screen.getByText('Call to Action')).toBeInTheDocument();
//     expect(screen.getByText('Business Hours')).toBeInTheDocument();
//   });

  describe('Contact Information Section', () => {
    it('renders phone input with country code selector', () => {
      render(<ContactAndTimings />);
      
      const phoneCodeSelect = screen.getByLabelText('Country code', { selector: '#phone-code' });
      expect(phoneCodeSelect).toBeInTheDocument();
      expect(phoneCodeSelect).toHaveValue('+1');
      
      const phoneInput = screen.getByLabelText('Phone number');
      expect(phoneInput).toBeInTheDocument();
      expect(phoneInput).toHaveValue('555-123-4567');
    });

    it('updates phone number when country code changes', async () => {
      render(<ContactAndTimings />);
      
      const phoneCodeSelect = screen.getByLabelText('Country code', { selector: '#phone-code' });
      await userEvent.selectOptions(phoneCodeSelect, '+44');
      
      const phoneInput = screen.getByLabelText('Phone number');
      fireEvent.change(phoneInput, { target: { value: '20-7946-0958' } });
      
      expect(phoneInput).toHaveValue('20-7946-0958');
    });

    it('renders email input with initial value', () => {
      render(<ContactAndTimings />);
      
      const emailInput = screen.getByLabelText('Email:');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveValue('contact@example.com');
    });

    it('updates email when input changes', async () => {
      render(<ContactAndTimings />);
      
      const emailInput = screen.getByLabelText('Email:');
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'new@example.com');
      
      expect(emailInput).toHaveValue('new@example.com');
    });

    it('renders website input with initial value', () => {
      render(<ContactAndTimings />);
      
      const websiteInput = screen.getByLabelText('Website:');
      expect(websiteInput).toBeInTheDocument();
      expect(websiteInput).toHaveValue('https://example.com');
    });
  });

  describe('Call to Action Section', () => {
    it('renders call number input with country code selector', () => {
      render(<ContactAndTimings />);
      
      const callCodeSelect = screen.getByLabelText('Country code', { selector: '#call-code' });
      expect(callCodeSelect).toBeInTheDocument();
      expect(callCodeSelect).toHaveValue('+1');
      
      const callInput = screen.getByLabelText('Call number');
      expect(callInput).toBeInTheDocument();
      expect(callInput).toHaveValue('555-987-6543');
    });

    it('updates call number when country code changes', async () => {
      render(<ContactAndTimings />);
      
      const callCodeSelect = screen.getByLabelText('Country code', { selector: '#call-code' });
      await userEvent.selectOptions(callCodeSelect, '+91');
      
      const callInput = screen.getByLabelText('Call number');
      fireEvent.change(callInput, { target: { value: '9876543210' } });
      
      expect(callInput).toHaveValue('9876543210');
    });

    it('renders booking URL input with initial value', () => {
      render(<ContactAndTimings />);
      
      const bookUrlInput = screen.getByLabelText('Booking URL:');
      expect(bookUrlInput).toBeInTheDocument();
      expect(bookUrlInput).toHaveValue('https://example.com/book');
    });

    it('renders get directions URL input with initial value', () => {
      render(<ContactAndTimings />);
      
      const directionsInput = screen.getByLabelText('Get Directions URL:');
      expect(directionsInput).toBeInTheDocument();
      expect(directionsInput).toHaveValue('https://maps.example.com');
    });
  });

  describe('Business Hours Section', () => {
    it('renders business hours for each day of the week', () => {
      render(<ContactAndTimings />);
      
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      days.forEach(day => {
        expect(screen.getByText(`${day}:`)).toBeInTheDocument();
      });
    });

    it('shows time inputs for open days and closed checkbox for Sunday', () => {
      render(<ContactAndTimings />);
      
      // Check Monday (open day)
      const mondayCheckbox = screen.getByLabelText('Closed', { selector: '#closed-monday' });
      expect(mondayCheckbox).not.toBeChecked();
      expect(screen.getByLabelText('monday Opening Time')).toBeInTheDocument();
      expect(screen.getByLabelText('monday Closing Time')).toBeInTheDocument();
      
      // Check Sunday (closed day)
      const sundayCheckbox = screen.getByLabelText('Closed', { selector: '#closed-sunday' });
      expect(sundayCheckbox).toBeChecked();
      expect(screen.queryByLabelText('sunday Opening Time')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('sunday Closing Time')).not.toBeInTheDocument();
    });

    it('toggles day between open and closed when checkbox is clicked', async () => {
      render(<ContactAndTimings />);
      
      const mondayCheckbox = screen.getByLabelText('Closed', { selector: '#closed-monday' });
      await userEvent.click(mondayCheckbox);
      
      expect(mondayCheckbox).toBeChecked();
      expect(screen.queryByLabelText('monday Opening Time')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('monday Closing Time')).not.toBeInTheDocument();
      
      await userEvent.click(mondayCheckbox);
      expect(mondayCheckbox).not.toBeChecked();
      expect(screen.getByLabelText('monday Opening Time')).toBeInTheDocument();
      expect(screen.getByLabelText('monday Closing Time')).toBeInTheDocument();
    });

    it('updates opening time when changed', async () => {
      render(<ContactAndTimings />);
      
      const openInput = screen.getByLabelText('monday Opening Time');
      fireEvent.change(openInput, { target: { value: '10:00' } });
      
      expect(openInput).toHaveValue('10:00');
    });

    it('updates closing time when changed', async () => {
      render(<ContactAndTimings />);
      
      const closeInput = screen.getByLabelText('monday Closing Time');
      fireEvent.change(closeInput, { target: { value: '19:00' } });
      
      expect(closeInput).toHaveValue('19:00');
    });
  });

  describe('Navigation Buttons', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
      (useRouter as jest.Mock).mockReturnValue({
        push: mockPush,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders Back and Next buttons', () => {
      render(<ContactAndTimings />);
      
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('navigates to /location when Back button is clicked', async () => {
      render(<ContactAndTimings />);
      
      const backButton = screen.getByText('Back');
      await userEvent.click(backButton);
      
      expect(mockPush).toHaveBeenCalledWith('/location');
    });

    it('navigates to /services when Next button is clicked', async () => {
      render(<ContactAndTimings />);
      
      const nextButton = screen.getByText('Next');
      await userEvent.click(nextButton);
      
      expect(mockPush).toHaveBeenCalledWith('/services');
    });
  });

//   it('submits the form with updated data', async () => {
//     const consoleSpy = jest.spyOn(console, 'log');
//     render(<ContactAndTimings />);
    
//     // Change some values
//     const emailInput = screen.getByLabelText('Email:');
//     await userEvent.clear(emailInput);
//     await userEvent.type(emailInput, 'updated@example.com');
    
//     const mondayCheckbox = screen.getByLabelText('Closed', { selector: '#closed-monday' });
//     await userEvent.click(mondayCheckbox);
    
//     const form = screen.getByRole('form', { name: '' });
//     fireEvent.submit(form);
    
//     await waitFor(() => {
//       expect(consoleSpy).toHaveBeenCalledWith(
//         expect.stringContaining('Submitted Contact and Timings Data:')
//       );
//       expect(consoleSpy).toHaveBeenCalledWith(
//         expect.stringContaining('updated@example.com')
//       );
//       expect(consoleSpy).toHaveBeenCalledWith(
//         expect.stringContaining('"monday": "Closed"')
//       );
//     });
    
  
