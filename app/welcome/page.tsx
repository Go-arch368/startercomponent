"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import categoryandsubcategory from "@/data/category and subcategory.json";

export default function Welcome() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Load persisted category from localStorage
    return localStorage.getItem("welcomeCategory") || "";
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState(() => {
    // Load persisted subcategory from localStorage
    return localStorage.getItem("welcomeSubcategory") || "";
  });

  // Save to localStorage whenever selections change
  useEffect(() => {
    localStorage.setItem("welcomeCategory", selectedCategory);
    localStorage.setItem("welcomeSubcategory", selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory(""); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);
  };

  const getSubcategories = () => {
    if (!selectedCategory) return [];
    const categoryObj = categoryandsubcategory.find((cat) => cat.category === selectedCategory);
    return categoryObj ? categoryObj.subcategories : [];
  };

  const handleNext = () => {
    // Save to localStorage explicitly (optional, as useEffect handles it)
    localStorage.setItem("welcomeCategory", selectedCategory);
    localStorage.setItem("welcomeSubcategory", selectedSubcategory);
    // Navigate to the next page
    router.push("/business-info");
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome</h2>
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Business Category</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="category-select"
                className="block mb-2 font-medium text-gray-700"
              >
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
                {categoryandsubcategory.map((category, index) => (
                  <option key={index} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="subcategory-select"
                className="block mb-2 font-medium text-gray-700"
              >
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
                {getSubcategories().map((subcategory, index) => (
                  <option key={index} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}