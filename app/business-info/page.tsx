"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/data/businessData.json";

export default function BusinessInformation() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
  });
  const [initialData, setInitialData] = useState({
    businessName: "",
    description: "",
  });

  useEffect(() => {
    const businessFormData = localStorage.getItem("businessFormData");
    const apiResponse = localStorage.getItem("apiResponse");

    let existingData = null;
    
    if (businessFormData && businessFormData !== "null") {
      try {
        const parsedData = JSON.parse(businessFormData);
        existingData = {
          businessName: parsedData.subcategories?.[0]?.businesses?.[0]?.businessName || "",
          description: parsedData.subcategories?.[0]?.businesses?.[0]?.description || "",
          isPublished: false
        };
      } catch (e) {
        console.error("Error parsing draft data", e);
      }
    }

    if (!existingData && apiResponse) {
      try {
        const parsedApiResponse = JSON.parse(apiResponse);
        if (parsedApiResponse?.business?.businessName) {
          existingData = {
            businessName: parsedApiResponse.business.businessName,
            description: parsedApiResponse.business.description || "",
            isPublished: true
          };
        }
      } catch (e) {
        console.error("Error parsing api response", e);
      }
    }

    if (existingData) {
      setFormData({
        businessName: existingData.businessName,
        description: existingData.description
      });
      setInitialData({
        businessName: existingData.businessName,
        description: existingData.description
      });
      setHasExistingData(true);
      setIsEditing(false);
    } else {
      setFormData({
        businessName: businessData.subcategories[0].businesses[0].businessName,
        description: businessData.subcategories[0].businesses[0].description,
      });
      setIsEditing(true);
      setHasExistingData(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    localStorage.setItem("hasChanges", "true"); // Mark change
  };

  const handleNext = () => {
    const dataToSave = {
      subcategories: [{
        businesses: [{
          businessName: formData.businessName,
          description: formData.description
        }]
      }]
    };
    localStorage.setItem("businessFormData", JSON.stringify(dataToSave));
    localStorage.setItem("hasChanges", "true"); // Mark change
    router.push("/location");
  };

  const toggleEdit = () => {
    if (isEditing) {
      setFormData(initialData);
    } else {
      localStorage.setItem("isEditModeActive", "true");
      localStorage.setItem("hasChanges", "true"); // Set changes on edit
      console.log("Edit mode enabled via BusinessInformation pencil");
    }
    setIsEditing(!isEditing);
  };

  const isReadOnly = hasExistingData && !isEditing;

  return (
    <main className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Business Information</h2>
          {isReadOnly && (
            <button
              onClick={toggleEdit}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit Business Information"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            Viewing saved business information.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            {hasExistingData ? "Editing business information." : "Please enter your business information."}
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Business Name:</label>
            <input
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleInputChange}
              readOnly={isReadOnly}
              className={`w-full p-2 ${isReadOnly ? 'bg-gray-100' : 'border border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              readOnly={isReadOnly}
              className={`w-full p-2 ${isReadOnly ? 'bg-gray-100' : 'border border-gray-300'} rounded-md h-24 focus:ring-2 focus:ring-blue-500`}
              placeholder="Describe your business"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/welcome")}
          >
            Back
          </Button>
          
          {isEditing && hasExistingData && (
            <Button
              className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
              onClick={toggleEdit}
            >
              Cancel
            </Button>
          )}
          
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            color="primary"
            onClick={handleNext}
            disabled={!formData.businessName.trim()}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </main>
  );
}