import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GalleryFAQsAndCTA from './page';
import { useRouter } from 'next/navigation';
import businessData from '@/data/businessData.json';


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));


jest.mock('@heroui/button', () => ({
  Button: ({ children, onClick, className, ...props }: { children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLButtonElement>; className?: string; [key: string]: any }) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/data/businessData.json', () => ({
  subcategories: [
    {
      businesses: [
        {
          gallery: ['image1.jpg', 'image2.jpg'],
          faqs: [
            { question: 'Initial Q1', answer: 'Initial A1' },
            { question: 'Initial Q2', answer: 'Initial A2' },
          ],
          cta: {
            call: '+1-1234567890',
            bookUrl: 'https://example.com/book',
            getDirections: 'https://maps.example.com',
          },
          businessName: 'Test Business',
          description: 'Test Description',
          services: [],
          timings: {},
          location: {},
          contact: {},
        },
      ],
    },
  ],
}));


global.alert = jest.fn();


const localStorageMock = (function () {
  let store: Record<string, string> = {};

  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('GalleryFAQsAndCTA Component', () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });

  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    jest.clearAllMocks();
    localStorage.setItem('welcome', JSON.stringify({
      category: 'Test Category',
      subcategory: 'Test Subcategory',
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with initial data', () => {
    render(<GalleryFAQsAndCTA />);

    expect(screen.getByText('Gallery, FAQs, and Call to Action')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Call to Action')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
  });

  it('allows uploading images to the gallery', async () => {
    render(<GalleryFAQsAndCTA />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Drag and drop images here/i) as HTMLInputElement;

    await waitFor(() =>
      fireEvent.change(input, {
        target: { files: [file] },
      })
    );

    await waitFor(() => {
      expect(input.files?.[0]).toBe(file);
    });
  });

  it('allows removing images from the gallery', async () => {
    render(<GalleryFAQsAndCTA />);

    const removeButtons = await screen.findAllByRole('button', { name: /remove image/i });
    expect(removeButtons.length).toBeGreaterThan(0);

    await userEvent.click(removeButtons[0]);
    expect(screen.queryAllByRole('button', { name: /remove image/i }).length).toBeLessThan(removeButtons.length);
  });

  it('updates call to action fields', async () => {
    render(<GalleryFAQsAndCTA />);

    const countryCodeSelect = screen.getByLabelText('Country Code:');
    const phoneInput = screen.getByPlaceholderText('1234567890');
    const bookingUrlInput = screen.getByPlaceholderText('https://example.com/book');
    const directionsUrlInput = screen.getByPlaceholderText('https://maps.example.com');

    await userEvent.selectOptions(countryCodeSelect, '+44');
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '9876543210');
    await userEvent.clear(bookingUrlInput);
    await userEvent.type(bookingUrlInput, 'https://new-booking.com');
    await userEvent.clear(directionsUrlInput);
    await userEvent.type(directionsUrlInput, 'https://new-maps.com');

    expect(countryCodeSelect).toHaveValue('+44');
    expect(phoneInput).toHaveValue('9876543210');
    expect(bookingUrlInput).toHaveValue('https://new-booking.com');
    expect(directionsUrlInput).toHaveValue('https://new-maps.com');
  });

  it('allows adding and removing FAQs', async () => {
    render(<GalleryFAQsAndCTA />);

    const initialFaqs = screen.getAllByLabelText('Question:');
    const addFaqButton = screen.getByText('+ Add FAQ');

    await userEvent.click(addFaqButton);
    expect(screen.getAllByLabelText('Question:').length).toBe(initialFaqs.length + 1);

    const removeButtons = screen.getAllByText('Remove FAQ');
    await userEvent.click(removeButtons[0]);
    expect(screen.getAllByLabelText('Question:').length).toBe(initialFaqs.length);
  });

  it('updates FAQ questions and answers', async () => {
    render(<GalleryFAQsAndCTA />);

    const questionInputs = screen.getAllByLabelText('Question:');
    const answerInputs = screen.getAllByLabelText('Answer:');

    await userEvent.clear(questionInputs[0]);
    await userEvent.type(questionInputs[0], 'New Question');
    await userEvent.clear(answerInputs[0]);
    await userEvent.type(answerInputs[0], 'New Answer');

    expect(questionInputs[0]).toHaveValue('New Question');
    expect(answerInputs[0]).toHaveValue('New Answer');
  });

  it('handles publish button click', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<GalleryFAQsAndCTA />);

    const publishButton = screen.getByText('Publish');
    await userEvent.click(publishButton);

    expect(alertMock).toHaveBeenCalledWith(
      expect.stringContaining('Published Business Data:')
    );
    expect(mockPush).toHaveBeenCalledWith('/review&publish');

    alertMock.mockRestore();
  });

//   it('handles publish button click when services is not an array', async () => {
//     // Mock businessData specifically for this test
//     jest.spyOn(require('@/data/businessData.json'), 'default').mockReturnValue({
//       subcategories: [
//         {
//           businesses: [
//             {
//               gallery: ['image1.jpg', 'image2.jpg'],
//               faqs: [
//                 { question: 'Initial Q1', answer: 'Initial A1' },
//                 { question: 'Initial Q2', answer: 'Initial A2' },
//               ],
//               cta: {
//                 call: '+1-1234567890',
//                 bookUrl: 'https://example.com/book',
//                 getDirections: 'https://maps.example.com',
//               },
//               businessName: 'Test Business',
//               description: 'Test Description',
//               // services: undefined, // Simulates undefined services
//               timings: {},
//               location: {},
//               contact: {},
//             },
//           ],
//         },
//       ],
//     });

//     const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
//     const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

//     render(<GalleryFAQsAndCTA />);

//     const publishButton = screen.getByText('Publish');
//     await userEvent.click(publishButton);

//     expect(consoleErrorMock).toHaveBeenCalledWith('Services is not an array');
//     expect(mockPush).not.toHaveBeenCalled();
//     expect(alertMock).not.toHaveBeenCalled();

//     consoleErrorMock.mockRestore();
//     alertMock.mockRestore();
//   });

  it('navigates back when back button is clicked', async () => {
    render(<GalleryFAQsAndCTA />);

    const backButton = screen.getByText('Back');
    await userEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/services');
  });
});