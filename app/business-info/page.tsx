"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import businessData from "@/data/businessData.json";

export default function BusinessInformation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  });

  const initialBusiness = businessData.subcategories[0].businesses[0];

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData, null, 2);
    console.log("Submitted Business Information:", jsonData);
    alert("Submitted Business Information:\n" + jsonData);
  };

  return (
    <main role="main" className="max-w-4xl mx-auto p-5">
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Business Information
        </h2>

        {/* Basic Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Basic Information
          </h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="business-name"
                className="block mb-2 font-medium text-gray-700 text-base" // Larger font
              >
                Business Name:
              </label>
              <input
                id="business-name"
                type="text"
                placeholder={initialBusiness.businessName}
                onChange={(e) =>
                  updateFormData(
                    "subcategories.0.businesses.0.businessName",
                    e.target.value
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500" // Larger font, focus ring
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="description"
                className="block mb-2 font-medium text-gray-700 text-base" // Larger font
              >
                Description:
              </label>
              <textarea
                id="description"
                placeholder={initialBusiness.description}
                onChange={(e) =>
                  updateFormData(
                    "subcategories.0.businesses.0.description",
                    e.target.value
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-md text-base h-24 focus:ring-2 focus:ring-blue-500" // Larger font, focus ring
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500" // Focus ring
            onClick={() => router.push("/welcome")}
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500" // Focus ring
            color="primary"
            onClick={() => router.push("/location")}
          >
            Next
          </Button>
        </div>
      </form>
    </main>
  );
}