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
  const [formData, setFormData] = useState({
    businessName: "",
    description: ""
  });

  useEffect(() => {
    const apiResponse = localStorage.getItem("apiResponse");
    const businessFormData = localStorage.getItem("businessFormData");

    if (apiResponse || businessFormData) {
      setHasLocalData(true);
      try {
        const savedData = apiResponse 
          ? JSON.parse(apiResponse).business 
          : JSON.parse(businessFormData || "{}").subcategories?.[0]?.businesses?.[0] || {};

        setFormData({
          businessName: savedData.businessName || "",
          description: savedData.description || ""
        });
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    } else {
      setFormData(businessData.subcategories[0].businesses[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!hasLocalData || isEditing) {
      const dataToSave = {
        subcategories: [{
          businesses: [{
            businessName: formData.businessName,
            description: formData.description
          }]
        }]
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
                disabled={hasLocalData && !isEditing}
                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {hasLocalData && !isEditing && (
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
                disabled={hasLocalData && !isEditing}
                className="w-full p-2 pr-10 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-500"
              />
              {hasLocalData && !isEditing && (
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
            {hasLocalData && !isEditing ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </main>
  );
}
