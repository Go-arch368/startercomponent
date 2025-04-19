"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import businessData from "@/data/businessData.json";

const Location = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(() => {
    // Load persisted data from localStorage or use default
    const savedData = localStorage.getItem("locationFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          subcategories: [
            {
              businesses: [
                {
                  location: { ...businessData.subcategories[0].businesses[0].location },
                },
              ],
            },
          ],
        };
  });

  const initialBusiness = businessData.subcategories[0].businesses[0];

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("locationFormData", JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (path: string, value: string | number | boolean) => {
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
    // Save to localStorage explicitly (optional, as useEffect handles it)
    localStorage.setItem("locationFormData", JSON.stringify(formData));
    // Navigate to the next page
    router.push("/contact&timings");
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form data-testid="location-form" className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Location</h2>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Location</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="address" className="block mb-2 font-medium text-gray-700">
                Address:
              </label>
              <input
                id="address"
                type="text"
                placeholder={initialBusiness.location.address}
                value={formData.subcategories[0].businesses[0].location.address || ""}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.address", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="city"
                className="block mb-2 font-medium text-gray-700"
              >
                City:
              </label>
              <input
                id="city"
                type="text"
                placeholder={initialBusiness.location.city}
                value={formData.subcategories[0].businesses[0].location.city || ""}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.city", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="state"
                className="block mb-2 font-medium text-gray-700"
              >
                State:
              </label>
              <input
                id="state"
                type="text"
                placeholder={initialBusiness.location.state}
                value={formData.subcategories[0].businesses[0].location.state || ""}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.state", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label
                htmlFor="postalCode"
                className="block mb-2 font-medium text-gray-700"
              >
                Postal Code:
              </label>
              <input
                id="postalCode"
                type="text"
                placeholder={initialBusiness.location.postalCode}
                value={formData.subcategories[0].businesses[0].location.postalCode || ""}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.postalCode", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/business-info")}
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
    </div>
  );
};

export default Location;