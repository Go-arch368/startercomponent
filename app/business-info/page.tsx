"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/data/businessData.json";

export default function BusinessInformation() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasPublishedData, setHasPublishedData] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
  });

  useEffect(() => {
   
    const apiResponse = localStorage.getItem("apiResponse");
    const businessFormData = localStorage.getItem("businessFormData");

 
    let publishedDataExists = false;
    try {
      const parsedApiResponse = apiResponse ? JSON.parse(apiResponse) : null;
      publishedDataExists = Boolean(
        parsedApiResponse?.business?.businessName && 
        parsedApiResponse?.business?.description
      );
    } catch (e) {
      publishedDataExists = false;
    }

    setHasPublishedData(publishedDataExists);

    if (publishedDataExists) {
      const parsedApiResponse = JSON.parse(apiResponse!);
      setFormData({
        businessName: parsedApiResponse.business.businessName,
        description: parsedApiResponse.business.description,
      });
      setIsEditing(false); 
    } else {
    
      let draftData = {
        businessName: businessData.subcategories[0].businesses[0].businessName,
        description: businessData.subcategories[0].businesses[0].description,
      };

      if (businessFormData && businessFormData !== "null") {
        try {
          const parsedFormData = JSON.parse(businessFormData);
          draftData = {
            businessName: parsedFormData.subcategories?.[0]?.businesses?.[0]?.businessName || draftData.businessName,
            description: parsedFormData.subcategories?.[0]?.businesses?.[0]?.description || draftData.description,
          };
        } catch (e) {
          console.error("Error parsing draft data", e);
        }
      }

      setFormData(draftData);
      setIsEditing(true); // Start in edit mode
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Save data to localStorage (as draft)
    const dataToSave = {
      subcategories: [{
        businesses: [{
          businessName: formData.businessName,
          description: formData.description
        }]
      }]
    };
    localStorage.setItem("businessFormData", JSON.stringify(dataToSave));
    router.push("/location");
  };

  const toggleEdit = () => {
    if (isEditing && hasPublishedData) {
      // Revert to published data when canceling edit
      const apiResponse = JSON.parse(localStorage.getItem("apiResponse") || "{}");
      setFormData({
        businessName: apiResponse.business?.businessName || "",
        description: apiResponse.business?.description || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const isReadOnly = hasPublishedData && !isEditing;

  return (
    <main className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Information</h2>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            Viewing published business information.{" "}
            <button 
              onClick={toggleEdit}
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit Business
            </button>
          </div>
        ) : hasPublishedData ? (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            Editing business information. Changes will be saved as draft.
          </div>
        ) : null}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Business Name:</label>
            <div className="relative">
              <input
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className={`w-full p-2 ${isReadOnly ? 'pr-10 bg-gray-100' : 'border border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your business name"
              />
              {isReadOnly && (
                <button
                  onClick={toggleEdit}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label="Edit business name"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Description:</label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className={`w-full p-2 ${isReadOnly ? 'pr-10 bg-gray-100' : 'border border-gray-300'} rounded-md h-24 focus:ring-2 focus:ring-blue-500`}
                placeholder="Describe your business"
              />
              {isReadOnly && (
                <button
                  onClick={toggleEdit}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label="Edit description"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
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
          
          {isEditing && hasPublishedData && (
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