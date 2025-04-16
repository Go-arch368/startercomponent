"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
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

const Services = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
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

  const handleServiceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const services = [...formData.subcategories[0].businesses[0].services];
    services[index] = { ...services[index], [field]: value };
    updateFormData("subcategories.0.businesses.0.services", services);
  };

  const addService = () => {
    const services = [...formData.subcategories[0].businesses[0].services];
    services.push({
      name: "",
      price: "USD $50",
    });
    updateFormData("subcategories.0.businesses.0.services", services);
  };

  const removeService = (index: number) => {
    const services = [...formData.subcategories[0].businesses[0].services];
    services.splice(index, 1);
    updateFormData("subcategories.0.businesses.0.services", services);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData, null, 2);
    console.log("Submitted Services Data:", jsonData);
    alert("Submitted Services Data:\n" + jsonData);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Services</h2>

        {/* Services */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Services</h3>
          <div className="mb-4">
            {formData.subcategories[0].businesses[0].services.map((service, index) => (
              <div
                key={index}
                className="mb-4 p-3 border border-gray-200 rounded-md bg-white"
              >
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="flex-1 min-w-[250px]">
                    <label className="block mb-2 font-medium text-gray-700">
                      Service Name:
                    </label>
                    <input
                      type="text"
                      placeholder={
                        initialBusiness.services[index]?.name || "Enter service name"
                      }
                      value={service.name}
                      onChange={(e) =>
                        handleServiceChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      required
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block mb-2 font-medium text-gray-700">
                      Price:
                    </label>
                    <select
                      value={service.price}
                      onChange={(e) =>
                        handleServiceChange(index, "price", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      {currencyCodes.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} ({currency.country})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {formData.subcategories[0].businesses[0].services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="mt-2 text-red-500 text-sm hover:text-red-700"
                  >
                    Remove Service
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addService}
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition"
          >
            + Add Service
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700"
            onClick={() => router.push("/contact&timings")}
            type="button"
          >
            Back
          </Button>
       
          <Button
            className="w-full sm:w-auto"
            color="primary"
            onClick={() => router.push("/review&publish")}
            type="button"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Services;