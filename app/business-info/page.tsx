"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/data/businessData.json";

export default function BusinessInformation() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
  });

  useEffect(() => {
    const apiResponse = localStorage.getItem("apiResponse");
    const businessFormData = localStorage.getItem("businessFormData");

    let dataSource: { businessName?: string; description?: string } = {};

    if (apiResponse && apiResponse !== '""') {
      // Non-empty apiResponse: use published data and set read-only
      try {
        const parsedApiResponse = JSON.parse(apiResponse);
        if (parsedApiResponse.business) {
          dataSource = parsedApiResponse.business;
          setHasLocalData(true);
          setIsReadOnly(true);
        }
      } catch (error) {
        console.error("Error parsing apiResponse:", error);
      }
    } else if (apiResponse === '""' || businessFormData) {
      // Empty apiResponse or businessFormData: use businessFormData and set read-only
      try {
        dataSource = businessFormData
          ? JSON.parse(businessFormData).subcategories?.[0]?.businesses?.[0] || {}
          : {};
        setHasLocalData(true);
        setIsReadOnly(apiResponse === '""');
      } catch (error) {
        console.error("Error parsing businessFormData:", error);
      }
    }

    // Fallback to default data if no valid data is found
    setFormData({
      businessName: dataSource.businessName || businessData.subcategories[0].businesses[0].businessName,
      description: dataSource.description || businessData.subcategories[0].businesses[0].description,
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!hasLocalData || isEditing) {
      const dataToSave = {
        subcategories: [
          {
            businesses: [
              {
                businessName: formData.businessName,
                description: formData.description,
              },
            ],
          },
        ],
      };
      localStorage.setItem("businessFormData", JSON.stringify(dataToSave));
      setHasLocalData(true);
      setIsEditing(false);
    }
    router.push("/location");
  };

  const toggleEdit = () => setIsEditing(true);

  return (
    <main className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Information</h2>

        {/* Read-Only Indicator */}
        {isReadOnly && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            This form is in read-only mode because the data has been published or is empty. Click the pencil icon to edit.
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>

          {/* Business Name Field */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Business Name:</label>
            <div className="relative">
              <input
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={(hasLocalData || isReadOnly) && !isEditing}
                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {(hasLocalData || isReadOnly) && !isEditing && (
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

          {/* Description Field */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Description:</label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={(hasLocalData || isReadOnly) && !isEditing}
                className="w-full p-2 pr-10 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-500"
              />
              {(hasLocalData || isReadOnly) && !isEditing && (
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
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            color="primary"
            onClick={handleNext}
          >
            {(hasLocalData || isReadOnly) && !isEditing ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </main>
  );
}