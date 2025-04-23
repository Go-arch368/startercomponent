"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/data/businessData.json";

const Location = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasPublishedData, setHasPublishedData] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    // Check localStorage for existing data
    const apiResponse = localStorage.getItem("apiResponse");
    const locationFormData = localStorage.getItem("locationFormData");

    // Determine if we have valid published data
    let publishedDataExists = false;
    try {
      const parsedApiResponse = apiResponse ? JSON.parse(apiResponse) : null;
      publishedDataExists = Boolean(
        (parsedApiResponse?.location?.address && parsedApiResponse?.location?.city) ||
        (parsedApiResponse?.location?.subcategories?.[0]?.businesses?.[0]?.location?.address)
      );
    } catch (e) {
      publishedDataExists = false;
    }

    setHasPublishedData(publishedDataExists);

    if (publishedDataExists) {
      // Load from published data (apiResponse)
      const parsedApiResponse = JSON.parse(apiResponse!);
      const locationData = parsedApiResponse.location?.subcategories?.[0]?.businesses?.[0]?.location || 
                           parsedApiResponse.location;
      
      setFormData({
        address: locationData.address || "",
        city: locationData.city || "",
        state: locationData.state || "",
        postalCode: locationData.postalCode || "",
      });
      setIsEditing(false); // Start in read-only mode
    } else {
      // Load from draft or use defaults
      let draftData = {
        address: businessData.subcategories[0].businesses[0].location.address,
        city: businessData.subcategories[0].businesses[0].location.city,
        state: businessData.subcategories[0].businesses[0].location.state,
        postalCode: businessData.subcategories[0].businesses[0].location.postalCode,
      };

      if (locationFormData && locationFormData !== "null") {
        try {
          const parsedFormData = JSON.parse(locationFormData);
          const draftLocation = parsedFormData.subcategories?.[0]?.businesses?.[0]?.location || {};
          draftData = {
            address: draftLocation.address || draftData.address,
            city: draftLocation.city || draftData.city,
            state: draftLocation.state || draftData.state,
            postalCode: draftLocation.postalCode || draftData.postalCode,
          };
        } catch (e) {
          console.error("Error parsing draft data", e);
        }
      }

      setFormData(draftData);
      setIsEditing(true); // Start in edit mode
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Save data to localStorage (as draft)
    const dataToSave = {
      subcategories: [{
        businesses: [{
          location: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode
          }
        }]
      }]
    };
    localStorage.setItem("locationFormData", JSON.stringify(dataToSave));
    router.push("/contact&timings");
  };

  const toggleEdit = () => {
    if (isEditing && hasPublishedData) {
      // Revert to published data when canceling edit
      const apiResponse = JSON.parse(localStorage.getItem("apiResponse") || "{}");
      const locationData = apiResponse.location?.subcategories?.[0]?.businesses?.[0]?.location || 
                         apiResponse.location || {};
      
      setFormData({
        address: locationData.address || "",
        city: locationData.city || "",
        state: locationData.state || "",
        postalCode: locationData.postalCode || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const isReadOnly = hasPublishedData && !isEditing;

  return (
    <main className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Location</h2>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            Viewing published location information.{" "}
            <button 
              onClick={toggleEdit}
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit Location
            </button>
          </div>
        ) : hasPublishedData ? (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            Editing location information. Changes will be saved as draft.
          </div>
        ) : null}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Location Details</h3>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Address:</label>
            <div className="relative">
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className={`w-full p-2 ${isReadOnly ? 'pr-10 bg-gray-100' : 'border border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your business address"
              />
              {isReadOnly && (
                <button
                  onClick={toggleEdit}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label="Edit address"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">City:</label>
            <div className="relative">
              <input
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className={`w-full p-2 ${isReadOnly ? 'pr-10 bg-gray-100' : 'border border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your city"
              />
              {isReadOnly && (
                <button
                  onClick={toggleEdit}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label="Edit city"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

     
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">State:</label>
            <div className="relative">
              <input
                name="state"
                type="text"
                value={formData.state}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className={`w-full p-2 ${isReadOnly ? 'pr-10 bg-gray-100' : 'border border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your state"
              />
              {isReadOnly && (
                <button
                  onClick={toggleEdit}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label="Edit state"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Postal Code:</label>
            <div className="relative">
              <input
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className={`w-full p-2 ${isReadOnly ? 'pr-10 bg-gray-100' : 'border border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your postal code"
              />
              {isReadOnly && (
                <button
                  onClick={toggleEdit}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label="Edit postal code"
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
            onClick={() => router.push("/business-info")}
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
            disabled={!formData.address.trim() || !formData.city.trim()}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Location;