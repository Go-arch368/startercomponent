// app/welcome/page.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Welcome from "./page"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the @heroui/button component
jest.mock("@heroui/button", () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

// Mock the category and subcategory data
jest.mock("@/data/category and subcategory.json", () => [
  {
    category: "Technology",
    subcategories: ["Software", "Hardware", "IT Services"],
  },
  {
    category: "Retail",
    subcategories: ["Clothing", "Electronics", "Groceries"],
  },
  {
    category: "Healthcare",
    subcategories: ["Hospitals", "Clinics", "Pharmacy"],
  },
], { virtual: true });

describe("Welcome Component", () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockPush.mockClear();
  });

  it("renders correctly", () => {
    render(<Welcome />);
    
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Select Business Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Category:")).toBeInTheDocument();
    expect(screen.getByLabelText("Subcategory:")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("displays all categories in the dropdown", () => {
    render(<Welcome />);
    
    const categorySelect = screen.getByLabelText("Category:");
    fireEvent.click(categorySelect);
    
    expect(screen.getByText("Select a category")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("Retail")).toBeInTheDocument();
    expect(screen.getByText("Healthcare")).toBeInTheDocument();
  });

  it("updates selected category when a category is chosen", () => {
    render(<Welcome />);
    
    const categorySelect = screen.getByLabelText("Category:");
    fireEvent.change(categorySelect, { target: { value: "Technology" } });
    
    expect(categorySelect).toHaveValue("Technology");
  });

  it("enables subcategory dropdown when a category is selected", () => {
    render(<Welcome />);
    
    const subcategorySelect = screen.getByLabelText("Subcategory:");
    expect(subcategorySelect).toBeDisabled();
    
    const categorySelect = screen.getByLabelText("Category:");
    fireEvent.change(categorySelect, { target: { value: "Technology" } });
    
    expect(subcategorySelect).not.toBeDisabled();
  });

  it("displays correct subcategories for the selected category", () => {
    render(<Welcome />);
    
    const categorySelect = screen.getByLabelText("Category:");
    fireEvent.change(categorySelect, { target: { value: "Technology" } });
    
    const subcategorySelect = screen.getByLabelText("Subcategory:");
    fireEvent.click(subcategorySelect);
    
    expect(screen.getByText("Select a subcategory")).toBeInTheDocument();
    expect(screen.getByText("Software")).toBeInTheDocument();
    expect(screen.getByText("Hardware")).toBeInTheDocument();
    expect(screen.getByText("IT Services")).toBeInTheDocument();
  });

  it("navigates to business-info page when Next button is clicked", () => {
    render(<Welcome />);
    
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    
    expect(mockPush).toHaveBeenCalledWith("/business-info");
  });
});