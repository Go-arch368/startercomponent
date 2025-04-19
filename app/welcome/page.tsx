"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import categoryandsubcategory from "@/data/category and subcategory.json";

export default function Welcome() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem("welcomeCategory") || "";
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState(() => {
    return localStorage.getItem("welcomeSubcategory") || "";
  });

  useEffect(() => {
    localStorage.setItem("welcomeCategory", selectedCategory);
    localStorage.setItem("welcomeSubcategory", selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory(""); 
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
    router.push("/business-info");
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
          <button 
            onClick={toggleEditing}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={isEditing ? "Cancel editing" : "Edit category"}
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
        
        {isEditing ? (
          /* Edit Section (shown when isEditing is true) */
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Business Category</h3>
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
                  {categoryandsubcategory.map((category, index) => (
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
                  {getSubcategories().map((subcategory, index) => (
                    <option key={index} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Section (shown when isEditing is false) */
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Business Category</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-1 text-sm font-medium text-gray-500">Category:</label>
                <div className="text-gray-800">
                  {selectedCategory || "Not selected"}
                </div>
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block mb-1 text-sm font-medium text-gray-500">Subcategory:</label>
                <div className="text-gray-800">
                  {selectedSubcategory || "Not selected"}
                </div>
              </div>
            </div>
          </div>
        )}

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