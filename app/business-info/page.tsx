"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import businessData from "@/data/businessData.json";

export default function BusinessInformation() {
  const router = useRouter();
  const [formData, setFormData] = useState(() => {
    // Load persisted data from localStorage or use default
    const savedData = localStorage.getItem("businessFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          subcategories: [
            {
              businesses: [
                {
                  businessName: businessData.subcategories[0].businesses[0].businessName,
                  description: businessData.subcategories[0].businesses[0].description,
                },
              ],
            },
          ],
        };
  });

  const initialBusiness = businessData.subcategories[0].businesses[0];

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("businessFormData", JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (path: string, value: any) => {
    const keys = path.split(".");
    const newData = JSON.parse(JSON.stringify(formData));

    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setFormData(newData);
  };

  const handleNext = () => {
    // Save to localStorage explicitly (optional, as useEffect already handles it)
    localStorage.setItem("businessFormData", JSON.stringify(formData));
    // Navigate to the next page
    router.push("/location");
  };

  return (
    <main role="main" className="max-w-4xl mx-auto p-5">
      <form className="bg-gray-50 rounded-lg shadow-sm p-6" data-testid="business-form">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Information</h2>

        {/* Basic Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="business-name"
                className="block mb-2 font-medium text-gray-700 text-base"
              >
                Business Name:
              </label>
              <input
                id="business-name"
                type="text"
                placeholder={initialBusiness.businessName}
                value={formData.subcategories[0].businesses[0].businessName || ""}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.businessName", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="description"
                className="block mb-2 font-medium text-gray-700 text-base"
              >
                Description:
              </label>
              <textarea
                id="description"
                placeholder={initialBusiness.description}
                value={formData.subcategories[0].businesses[0].description || ""}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-base h-24 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/welcome")}
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </form>
    </main>
  );
}