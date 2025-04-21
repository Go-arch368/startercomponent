"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/data/businessData.json";

const Location = () => {
  const router = useRouter();
  const [hasLocalData, setHasLocalData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: ""
    }
  });


  useEffect(() => {
    const apiResponse = localStorage.getItem("apiResponse");
    const locationFormData = localStorage.getItem("locationFormData");

    if (apiResponse || locationFormData) {
      setHasLocalData(true);
      try {
        const savedData = apiResponse 
          ? JSON.parse(apiResponse).location 
          : JSON.parse(locationFormData || "{}").subcategories[0].businesses[0].location;
        
        setFormData({
          location: {
            address: savedData.address || businessData.subcategories[0].businesses[0].location.address,
            city: savedData.city || businessData.subcategories[0].businesses[0].location.city,
            state: savedData.state || businessData.subcategories[0].businesses[0].location.state,
            postalCode: savedData.postalCode || businessData.subcategories[0].businesses[0].location.postalCode
          }
        });
      } catch (error) {
        console.error("Error parsing saved data:", error);
        setFormData({
          location: businessData.subcategories[0].businesses[0].location
        });
      }
    } else {
      setFormData({
        location: businessData.subcategories[0].businesses[0].location
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleNext = () => {
    if (!hasLocalData || isEditing) {
      const dataToSave = {
        subcategories: [{
          businesses: [{
            location: formData.location
          }]
        }]
      };
      localStorage.setItem("locationFormData", JSON.stringify(dataToSave));
      setHasLocalData(true);
      setIsEditing(false);
    }
    router.push("/contact&timings");
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Business Location</h2>
          {hasLocalData && !isEditing && (
            <button 
              onClick={toggleEdit}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
              aria-label="Edit location"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Location</h3>
          
          {/* Address Field */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="address" className="block mb-2 font-medium text-gray-700">
                Address:
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.location.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={hasLocalData && !isEditing}
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="city" className="block mb-2 font-medium text-gray-700">
                City:
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.location.city}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={hasLocalData && !isEditing}
              />
            </div>
          </div>

          {/* State and Postal Code Fields */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="state" className="block mb-2 font-medium text-gray-700">
                State:
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.location.state}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={hasLocalData && !isEditing}
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="postalCode" className="block mb-2 font-medium text-gray-700">
                Postal Code:
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.location.postalCode}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={hasLocalData && !isEditing}
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
            {isEditing ? "Save & Next" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Location;