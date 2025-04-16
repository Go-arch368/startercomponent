"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import categoryandsubcategory from "@/data/category and subcategory.json";

export default function Welcome() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

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

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome</h2>
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Business Category</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
              <label className="block mb-2 font-medium text-gray-700">Subcategory:</label>
              <select
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
            className="w-full sm:w-auto"
            color="primary"
            onClick={() => router.push("/business-info")}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}