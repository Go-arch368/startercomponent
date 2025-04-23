"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/data/businessData.json";

const currencyCodes = [
  { code: "USD $50", country: "United States" },
  { code: "USD $75", country: "United States" },
  { code: "USD $100", country: "United States" },
  { code: "GBP £50", country: "United Kingdom" },
  { code: "GBP £75", country: "United Kingdom" },
  { code: "GBP £100", country: "United Kingdom" },
  { code: "INR ₹100", country: "India" },
  { code: "INR ₹200", country: "India" },
  { code: "INR ₹300", country: "India" },
  { code: "JPY ¥50", country: "Japan" },
  { code: "JPY ¥75", country: "Japan" },
  { code: "JPY ¥100", country: "Japan" },
  { code: "CNY ¥50", country: "China" },
  { code: "CNY ¥75", country: "China" },
  { code: "CNY ¥100", country: "China" },
];

const defaultFormData = {
  subcategories: [
    {
      businesses: [
        {
          services: businessData.subcategories[0].businesses[0].services.map((service) => ({
            name: service.name,
            price: service.price || "USD $50",
          })),
        },
      ],
    },
  ],
};


function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      console.log(`Saved to ${key}:`, value);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

interface Service {
  name: string;
  price: string;
}

interface ApiResponse {
  services?: Service[];
}

const Services = () => {
  const router = useRouter();
  const [formData, setFormData] = useLocalStorage("servicesFormData", defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [hasPublishedData, setHasPublishedData] = useState(false);

  useEffect(() => {
    const apiResponseRaw = localStorage.getItem("apiResponse");
    let apiResponse: ApiResponse = {};
    let publishedDataExists = false;

    
    try {
      apiResponse = apiResponseRaw ? JSON.parse(apiResponseRaw) : {};
      publishedDataExists = Boolean(apiResponse?.services?.length);
    } catch (e) {
      console.error("Error parsing apiResponse:", e);
      publishedDataExists = false;
    }

    setHasPublishedData(publishedDataExists);

    const servicesFormDataRaw = localStorage.getItem("servicesFormData");
    if (servicesFormDataRaw && servicesFormDataRaw !== "null") {
     
      try {
        const parsedFormData = JSON.parse(servicesFormDataRaw);
        setFormData(parsedFormData);
        setIsEditing(true);
        console.log("Loaded draft:", parsedFormData);
      } catch (e) {
        console.error("Error parsing servicesFormData:", e);
      }
    } else if (publishedDataExists) {
  
      const publishedServices = apiResponse.services!.map((service: Service) => ({
        name: service.name,
        price: service.price,
      }));
      setFormData({
        subcategories: [
          {
            businesses: [
              {
                services: publishedServices,
              },
            ],
          },
        ],
      });
      setIsEditing(false); 
      console.log("Loaded published:", publishedServices);
    } else {
     
      setFormData(defaultFormData);
      setIsEditing(true); 
      console.log("Loaded defaults:", defaultFormData);
    }
  }, []);

  const isReadOnly = hasPublishedData && !isEditing;

  const updateFormData = (path: string, value: any) => {
    if (isReadOnly) return;
    const keys = path.split(".");
    const newData = JSON.parse(JSON.stringify(formData));
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
    console.log("Updated formData:", newData);
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    if (isReadOnly) return;
    const services = [...formData.subcategories[0].businesses[0].services];
    services[index] = { ...services[index], [field]: value };
    updateFormData("subcategories.0.businesses.0.services", services);
  };

  const addService = () => {
    if (isReadOnly) return;
    const services = [...formData.subcategories[0].businesses[0].services];
    services.push({
      name: "",
      price: "USD $50",
    });
    updateFormData("subcategories.0.businesses.0.services", services);
  };

  const removeService = (index: number) => {
    if (isReadOnly) return;
    const services = [...formData.subcategories[0].businesses[0].services];
    if (services.length > 1) {
      services.splice(index, 1);
      updateFormData("subcategories.0.businesses.0.services", services);
    }
  };

  const handleNext = () => {
    if (!isReadOnly) {
     
      setFormData(formData);
    }
    router.push("/review&publish");
  };

  const toggleEdit = () => {
    if (isEditing && hasPublishedData) {

      const apiResponseRaw = localStorage.getItem("apiResponse");
      if (apiResponseRaw) {
        try {
          const apiResponse: ApiResponse = JSON.parse(apiResponseRaw);
          const publishedServices = apiResponse.services!.map((service: Service) => ({
            name: service.name,
            price: service.price,
          }));
          setFormData({
            subcategories: [
              {
                businesses: [
                  {
                    services: publishedServices,
                  },
                ],
              },
            ],
          });
          console.log("Reverted to published:", publishedServices);
        } catch (e) {
          console.error("Error reverting to apiResponse:", e);
        }
      }
      setIsEditing(false);
    } else if (isEditing && !hasPublishedData) {
      setFormData(defaultFormData);
      localStorage.removeItem("servicesFormData");
      setIsEditing(true); 
      console.log("Reset to defaults:", defaultFormData);
    } else {
      setIsEditing(true); 
      console.log("Entered edit mode");
    }
  };

  const isSaveDisabled = formData.subcategories[0].businesses[0].services.some(
    (service: Service) => !service.name.trim()
  );

  return (
    <main className="max-w-4xl mx-auto p-5">
      <form
        className="bg-gray-50 rounded-lg shadow-sm p-6"
        aria-describedby="form-instructions"
        data-testid="services-form"
      >
        <p id="form-instructions" className="sr-only">
          Enter service details including name and price. Add or remove services as needed. Use the buttons to navigate.
        </p>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Services</h2>
          <button
            onClick={toggleEdit}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>
        </div>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            Viewing published services information.{" "}
            <button
              onClick={toggleEdit}
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit Services
            </button>
          </div>
        ) : hasPublishedData ? (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            Editing services information. Changes will be saved as draft.
          </div>
        ) : null}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Services</h3>
          <div className="mb-4">
            {formData.subcategories[0].businesses[0].services.map((service: Service, index: number) => (
              <div
                key={index}
                className="mb-4 p-3 border border-gray-200 rounded-md bg-white"
              >
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="flex-1 min-w-[250px]">
                    <label
                      htmlFor={`service-name-${index}`}
                      className="block mb-2 font-medium text-gray-700"
                    >
                      Service Name:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id={`service-name-${index}`}
                        placeholder="Enter service name"
                        value={service.name || ""}
                        onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                        readOnly={isReadOnly}
                        className={`w-full p-2 ${isReadOnly ? "pr-10 bg-gray-100" : "border border-gray-300"} rounded-md text-sm focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {isReadOnly && (
                        <button
                          onClick={toggleEdit}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                          aria-label={`Edit service ${index + 1} name`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label
                      htmlFor={`service-price-${index}`}
                      className="block mb-2 font-medium text-gray-700"
                    >
                      Price:
                    </label>
                    <div className="relative">
                      {isReadOnly ? (
                        <div className="p-2 pr-10 bg-gray-100 rounded-md text-sm">
                          {service.price}
                        </div>
                      ) : (
                        <select
                          id={`service-price-${index}`}
                          value={service.price || "USD $50"}
                          onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          {currencyCodes.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.code} ({currency.country})
                            </option>
                          ))}
                        </select>
                      )}
                      {isReadOnly && (
                        <button
                          onClick={toggleEdit}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                          aria-label={`Edit service ${index + 1} price`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {!isReadOnly &&
                  formData.subcategories[0].businesses[0].services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="mt-2 text-red-600 text-sm hover:text-red-800 focus:ring-2 focus:ring-red-600"
                      aria-label={`Remove service ${index + 1}`}
                    >
                      Remove Service
                    </button>
                  )}
              </div>
            ))}
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={addService}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition focus:ring-2 focus:ring-green-600"
              aria-label="Add new service"
            >
              + Add Service
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/contact&timings")}
            type="button"
          >
            Back
          </Button>
          {isEditing && (
            <Button
              className="w-full sm:w-auto border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
              onClick={toggleEdit}
              type="button"
            >
              Cancel
            </Button>
          )}
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            color="primary"
            onClick={handleNext}
            type="button"
            disabled={isEditing && isSaveDisabled}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default Services;