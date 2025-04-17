import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Location from "./page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/data/businessData.json", () => ({
  subcategories: [
    {
      businesses: [
        {
          location: {
            address: "123 Main St",
            city: "Sample City",
            state: "Sample State",
            postalCode: "12345"
          }
        }
      ]
    }
  ]
}));

jest.mock("@heroui/button", () => ({
  Button: ({ children, onClick, className, color }: any) => (
    <button
      className={className}
      onClick={onClick}
      data-testid={color ? `${color}-button` : "default-button"}
    >
      {children}
    </button>
  ),
}));

describe("Location Component", () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with initial values", () => {
    render(<Location />);

    expect(screen.getByRole("heading", { name: "Business Location" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Location" })).toBeInTheDocument();

    // Use getByPlaceholderText instead of getByLabelText
    const addressInput = screen.getByPlaceholderText("123 Main St");
    expect(addressInput).toBeInTheDocument();

    const cityInput = screen.getByPlaceholderText("Sample City");
    expect(cityInput).toBeInTheDocument();

    const stateInput = screen.getByPlaceholderText("Sample State");
    expect(stateInput).toBeInTheDocument();

    const postalCodeInput = screen.getByPlaceholderText("12345");
    expect(postalCodeInput).toBeInTheDocument();

    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("updates form data when inputs change", async () => {
    render(<Location />);

    const addressInput = screen.getByPlaceholderText("123 Main St");
    const cityInput = screen.getByPlaceholderText("Sample City");
    const stateInput = screen.getByPlaceholderText("Sample State");
    const postalCodeInput = screen.getByPlaceholderText("12345");

    await userEvent.clear(addressInput);
    await userEvent.type(addressInput, "456 Oak Ave");
    expect(addressInput).toHaveValue("456 Oak Ave");

    await userEvent.clear(cityInput);
    await userEvent.type(cityInput, "New City");
    expect(cityInput).toHaveValue("New City");

    await userEvent.clear(stateInput);
    await userEvent.type(stateInput, "New State");
    expect(stateInput).toHaveValue("New State");

    await userEvent.clear(postalCodeInput);
    await userEvent.type(postalCodeInput, "67890");
    expect(postalCodeInput).toHaveValue("67890");
  });

//   it("submits the form with updated data", async () => {
//     const consoleSpy = jest.spyOn(console, "log");
//     const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

//     render(<Location />);

//     const addressInput = screen.getByPlaceholderText("123 Main St");
//     const cityInput = screen.getByPlaceholderText("Sample City");
//     const stateInput = screen.getByPlaceholderText("Sample State");
//     const postalCodeInput = screen.getByPlaceholderText("12345");
//     const form = screen.getByTestId("location-form");

//     await userEvent.clear(addressInput);
//     await userEvent.type(addressInput, "789 Pine Rd");
//     await userEvent.clear(cityInput);
//     await userEvent.type(cityInput, "Metropolis");
//     await userEvent.clear(stateInput);
//     await userEvent.type(stateInput, "New York");
//     await userEvent.clear(postalCodeInput);
//     await userEvent.type(postalCodeInput, "10001");

//     fireEvent.submit(form);

//     await waitFor(() => {
//       expect(consoleSpy).toHaveBeenCalledWith(
//         "Submitted Location Data:",
//         expect.stringContaining("789 Pine Rd")
//       );
//       expect(consoleSpy).toHaveBeenCalledWith(
//         "Submitted Location Data:",
//         expect.stringContaining("Metropolis")
//       );
//       expect(alertSpy).toHaveBeenCalledWith(
//         expect.stringContaining("New York")
//       );
//       expect(alertSpy).toHaveBeenCalledWith(
//         expect.stringContaining("10001")
//       );
//     });

//     consoleSpy.mockRestore();
//     alertSpy.mockRestore();
//   });

  it("navigates to business-info page when Back button is clicked", async () => {
    render(<Location />);

    const backButton = screen.getByText("Back");
    await userEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith("/business-info");
  });

  it("navigates to contact&timings page when Next button is clicked", async () => {
    render(<Location />);

    const nextButton = screen.getByText("Next");
    await userEvent.click(nextButton);

    expect(mockPush).toHaveBeenCalledWith("/contact&timings");
  });

  it("validates required fields", async () => {
    render(<Location />);

    const addressInput = screen.getByPlaceholderText("123 Main St");
    const cityInput = screen.getByPlaceholderText("Sample City");
    const stateInput = screen.getByPlaceholderText("Sample State");
    const postalCodeInput = screen.getByPlaceholderText("12345");
    const form = screen.getByTestId("location-form");

    await userEvent.clear(addressInput);
    await userEvent.clear(cityInput);
    await userEvent.clear(stateInput);
    await userEvent.clear(postalCodeInput);

    fireEvent.submit(form);

    expect(addressInput).toBeInvalid();
    expect(cityInput).toBeInvalid();
    expect(stateInput).toBeInvalid();
    expect(postalCodeInput).toBeInvalid();
  });
});