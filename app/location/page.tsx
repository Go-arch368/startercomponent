"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import businessData from "@/data/businessData.json";

const Location = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subcategories: [
      {
        businesses: [
          {
            location: { ...businessData.subcategories[0].businesses[0].location },
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
    console.log("Submitted Location Data:", jsonData);
    alert("Submitted Location Data:\n" + jsonData);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Location</h2>

     
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Location</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Address:</label>
              <input
                type="text"
                placeholder={initialBusiness.location.address} 
                value={formData.subcategories[0].businesses[0].location.address}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.address", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">City:</label>
              <input
                type="text"
                placeholder={initialBusiness.location.city} 
                value={formData.subcategories[0].businesses[0].location.city}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.city", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">State:</label>
              <input
                type="text"
                placeholder={initialBusiness.location.state} // e.g., "Sample State"
                value={formData.subcategories[0].businesses[0].location.state}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.state", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Postal Code:</label>
              <input
                type="text"
                placeholder={initialBusiness.location.postalCode} // e.g., "12345"
                value={formData.subcategories[0].businesses[0].location.postalCode}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.postalCode", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700"
            onClick={() => router.push("/business-info")}
          >
            Back
          </Button>
        
          <Button
            className="w-full sm:w-auto"
            color="primary"
            onClick={() => router.push("/contact&timings")}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Location;