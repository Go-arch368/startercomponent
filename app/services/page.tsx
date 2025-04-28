"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil, Trash2 } from "lucide-react";
import businessData from "@/data/businessData.json";

const Services = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [services, setServices] = useState<{ name: string; price: string }[]>([
    { name: "", price: "" },
  ]);
  const [initialServices, setInitialServices] = useState<{ name: string; price: string }[]>([]);

  useEffect(() => {
    const apiResponse = localStorage.getItem("apiResponse");
    const servicesFormData = localStorage.getItem("servicesFormData");

    let existingData = null;

    if (servicesFormData && servicesFormData !== "null") {
      try {
        const parsedFormData = JSON.parse(servicesFormData);
        const draftServices = parsedFormData.subcategories?.[0]?.businesses?.[0]?.services || [];
        if (draftServices.length > 0) {
          existingData = draftServices;
        }
      } catch (e) {
        console.error("Error parsing draft data", e);
      }
    }

    if (!existingData && apiResponse) {
      try {
        const parsedApiResponse = JSON.parse(apiResponse);
        const publishedServices = parsedApiResponse?.services || [];
        if (publishedServices.length > 0) {
          existingData = publishedServices;
        }
      } catch (e) {
        console.error("Error parsing api response", e);
      }
    }

    if (existingData) {
      setServices(existingData);
      setInitialServices(existingData);
      setHasExistingData(true);
      setIsEditing(false);
    } else {
      setServices(businessData.subcategories[0].businesses[0].services);
      setIsEditing(true);
      setHasExistingData(false);
    }
  }, []);

  const handleServiceChange = (index: number, field: "name" | "price", value: string) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
    localStorage.setItem("hasChanges", "true");
  };

  const addService = () => {
    setServices([...services, { name: "", price: "" }]);
    localStorage.setItem("hasChanges", "true");
  };

  const removeService = (index: number) => {
    if (services.length <= 1) return;
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    localStorage.setItem("hasChanges", "true");
  };

  const handleNext = () => {
    const dataToSave = {
      subcategories: [
        {
          businesses: [
            {
              services,
            },
          ],
        },
      ],
    };
    localStorage.setItem("servicesFormData", JSON.stringify(dataToSave));
    localStorage.setItem("hasChanges", "true");
    router.push("/review&publish");
  };

  const toggleEdit = () => {
    if (isEditing) {
      setServices(initialServices);
      const dataToSave = {
        subcategories: [
          {
            businesses: [
              {
                services: initialServices,
              },
            ],
          },
        ],
      };
      localStorage.setItem("servicesFormData", JSON.stringify(dataToSave));
    } else {
      localStorage.setItem("isEditModeActive", "true");
      localStorage.setItem("hasChanges", "true");
      console.log("Edit mode enabled via Services pencil");
    }
    setIsEditing(!isEditing);
  };

  const isReadOnly = hasExistingData && !isEditing;

  return (
    <main className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Services</h2>
          {isReadOnly && (
            <button
              onClick={toggleEdit}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit Services"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-gray-100 text-gray-800 rounded-md">
            Viewing saved services.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            {hasExistingData ? "Editing services." : "Please enter your services."}
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Service Details</h3>
          {services.map((service, index) => (
            <div key={index} className="flex flex-wrap gap-4 mb-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-2 font-medium text-gray-700">Service Name:</label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2 ${
                    isReadOnly ? "bg-gray-100" : "border border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-gray-500`}
                  placeholder="Enter service name"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block mb-2 font-medium text-gray-700">Price:</label>
                <input
                  type="text"
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2 ${
                    isReadOnly ? "bg-gray-100" : "border border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-gray-500`}
                  placeholder="Enter price"
                />
              </div>
              {!isReadOnly && services.length > 1 && (
                <button
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-800 mt-6"
                  aria-label={`Remove service ${index + 1}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <Button
              className="mt-4 bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500"
              onClick={addService}
            >
              Add Service
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-gray-500"
            onClick={() => router.push("/contact&timings")}
          >
            Back
          </Button>
          {isEditing && hasExistingData && (
            <Button
              className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-gray-500"
              onClick={toggleEdit}
            >
              Cancel
            </Button>
          )}
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700"
            color="primary"
            onClick={handleNext}
            disabled={services.some((s) => !s.name.trim())}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Services;