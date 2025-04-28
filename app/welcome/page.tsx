"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import fallbackData from "@/data/category and subcategory.json";

function getStoredApiResponse() {
  try {
    const item = localStorage.getItem("apiResponse");
    return item ? JSON.parse(item) : {};
  } catch (err) {
    console.error("Invalid localStorage JSON:", err);
    return {};
  }
}

export default function Welcome() {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<{ category: string; subcategories: string[] }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const storedApiResponse = getStoredApiResponse();
    try {
      if (storedApiResponse?.welcome) {
        setSelectedCategory(storedApiResponse.welcome.category || "");
        setSelectedSubcategory(storedApiResponse.welcome.subcategory || "");
        
        if (storedApiResponse.welcome.category && storedApiResponse.welcome.subcategory) {
          setIsReadOnly(true);
        }
      }
      
      if (Array.isArray(storedApiResponse)) {
        setCategoryData(storedApiResponse);
      } else {
        setCategoryData(fallbackData);
      }
    } catch (error) {
      console.error("Invalid JSON in apiResponse:", error);
      setCategoryData(fallbackData);
    }
  }, []);

  const handleEdit = () => {
    setIsReadOnly(false);
    localStorage.setItem("isEditModeActive", "true");
    localStorage.setItem("hasChanges", "true"); // Set changes on edit
    console.log("Edit mode enabled via Welcome pencil");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setSelectedSubcategory("");
    localStorage.setItem("hasChanges", "true"); // Mark change
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategory = e.target.value;
    setSelectedSubcategory(newSubcategory);
    localStorage.setItem("hasChanges", "true"); // Mark change
  };

  const getSubcategories = () => {
    const categoryObj = categoryData.find((cat) => cat.category === selectedCategory);
    return categoryObj ? categoryObj.subcategories : [];
  };

  const handleNext = () => {
    const storedApiResponse = getStoredApiResponse();
  
    const updatedData = {
      ...storedApiResponse,
      welcome: {
        category: selectedCategory,
        subcategory: selectedSubcategory,
      },
    };
  
    localStorage.setItem("apiResponse", JSON.stringify(updatedData));
    localStorage.setItem("hasChanges", "true"); // Mark change
    router.push("/business-info");
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
          {isReadOnly && (
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit Category"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Category</h3>
          
          {isReadOnly ? (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Category:</label>
                <div className="p-2 bg-gray-100 rounded-md">
                  {selectedCategory || "Not selected"}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Subcategory:</label>
                <div className="p-2 bg-gray-100 rounded-md">
                  {selectedSubcategory || "Not selected"}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[250px]">
                <label htmlFor="category-select" className="block mb-2 font-medium text-gray-700">
                  Category:
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categoryData.map((category, index) => (
                    <option key={index} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[250px]">
                <label htmlFor="subcategory-select" className="block mb-2 font-medium text-gray-700">
                  Subcategory:
                </label>
                <select
                  id="subcategory-select"
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!selectedCategory}
                >
                  <option value="">Select a subcategory</option>
                  {getSubcategories().map((subcat, index) => (
                    <option key={index} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            color="primary"
            onClick={handleNext}
            type="button"
            disabled={!selectedCategory || !selectedSubcategory}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}