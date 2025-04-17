// business-information.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BusinessInformation from "./page";
import { useRouter } from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the businessData import
jest.mock("@/data/businessData.json", () => ({
  subcategories: [
    {
      businesses: [
        {
          businessName: "Test Business",
          description: "Test Description",
        },
      ],
    },
  ],
}));

// Mock the Button component
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

describe("BusinessInformation Component", () => {
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
    render(<BusinessInformation />);

    expect(
      screen.getByRole("heading", { name: "Business Information" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Basic Information" })
    ).toBeInTheDocument();

    const businessNameInput = screen.getByLabelText("Business Name:");
    expect(businessNameInput).toBeInTheDocument();
    expect(businessNameInput).toHaveAttribute("placeholder", "Test Business");

    const descriptionInput = screen.getByLabelText("Description:");
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveAttribute("placeholder", "Test Description");

    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("updates form data when inputs change", async () => {
    render(<BusinessInformation />);

    const businessNameInput = screen.getByLabelText("Business Name:");
    const descriptionInput = screen.getByLabelText("Description:");

    // Test business name update
    await userEvent.type(businessNameInput, "Updated Business");
    expect(businessNameInput).toHaveValue("Updated Business");

    // Test description update
    await userEvent.type(descriptionInput, "Updated Description");
    expect(descriptionInput).toHaveValue("Updated Description");
  });

  it("submits the form with updated data", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<BusinessInformation />);

    const businessNameInput = screen.getByLabelText("Business Name:");
    const descriptionInput = screen.getByLabelText("Description:");
    // Changed from getByRole to getByTestId
    const form = screen.getByTestId("business-form");

    await userEvent.type(businessNameInput, "New Business");
    await userEvent.type(descriptionInput, "New Description");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Submitted Business Information:",
        expect.stringContaining("New Business")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Submitted Business Information:",
        expect.stringContaining("New Description")
      );
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining("New Business")
      );
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining("New Description")
      );
    });

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it("navigates to welcome page when Back button is clicked", async () => {
    render(<BusinessInformation />);

    const backButton = screen.getByText("Back");
    await userEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith("/welcome");
  });

  it("navigates to location page when Next button is clicked", async () => {
    render(<BusinessInformation />);

    const nextButton = screen.getByText("Next");
    await userEvent.click(nextButton);

    expect(mockPush).toHaveBeenCalledWith("/location");
  });

  it("validates required fields", async () => {
    render(<BusinessInformation />);

    const businessNameInput = screen.getByLabelText("Business Name:");
    const descriptionInput = screen.getByLabelText("Description:");
    // Changed from getByRole to getByTestId
    const form = screen.getByTestId("business-form");

    // Clear inputs
    await userEvent.clear(businessNameInput);
    await userEvent.clear(descriptionInput);

    fireEvent.submit(form);

    // For HTML5 validation, we need to check the validationMessage property
    expect(businessNameInput).toBeInvalid();
    expect(descriptionInput).toBeInvalid();
  });
});