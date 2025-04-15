"use client";
import { useState } from "react";
import businessData from "@/data/businessData.json";
import categoryandsubcategory from "@/data/category and subcategory.json";
import { ClockIcon } from "@heroicons/react/24/outline";

// Sample country codes (matches your JSON's +1)
const countryCodes = [
  { code: "+1", country: "United States" },
  { code: "+44", country: "United Kingdom" },
  { code: "+91", country: "India" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
];

export default function BusinessInformationForm() {
  const [formData, setFormData] = useState(businessData);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState(countryCodes[0].code);
  const [callCountryCode, setCallCountryCode] = useState(countryCodes[0].code);
  const [closedDays, setClosedDays] = useState(
    Object.fromEntries(
      Object.entries(businessData.subcategories[0].businesses[0].timings).map(([day, hours]) => [
        day,
        hours === "Closed",
      ])
    )
  );

  const business = formData.subcategories[0].businesses[0];
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

  const handleArrayChange = (arrayPath: string, index: number, field: string, value: any) => {
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = arrayPath.split(".");
    let current = newData;

    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }

    current[index][field] = value;
    setFormData(newData);
  };

  const addArrayItem = (arrayPath: string, newItem: any) => {
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = arrayPath.split(".");
    let current = newData;

    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }

    current.push(newItem);
    setFormData(newData);
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = arrayPath.split(".");
    let current = newData;

    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }

    current.splice(index, 1);
    setFormData(newData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addArrayItem("subcategories.0.businesses.0.gallery", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Form data logged to console (check developer tools)");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory("");
    updateFormData("subcategories.0.name", category);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);
    updateFormData("subcategories.0.name", subcategory);
  };

  const getSubcategories = () => {
    if (!selectedCategory) return [];
    const categoryObj = categoryandsubcategory.find((cat) => cat.category === selectedCategory);
    return categoryObj ? categoryObj.subcategories : [];
  };

  // Helper to format time from 24-hour to 12-hour format
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Handle time change for open/close times
  const handleTimeChange = (day: string, type: string, value: string) => {
    if (closedDays[day]) return;
    const timings = { ...business.timings };
    const current = timings[day as keyof typeof timings] === "Closed" 
      ? ["09:00", "17:00"] 
      : timings[day as keyof typeof timings].split(" - ");
    const openTime = type === "open" ? value : current[0]?.replace(/ [AP]M/, "") || "09:00";
    const closeTime = type === "close" ? value : current[1]?.replace(/ [AP]M/, "") || "17:00";
    const formatted = `${formatTime(openTime)} - ${formatTime(closeTime)}`;
    updateFormData(`subcategories.0.businesses.0.timings.${day}`, formatted);
  };

  // Handle closed day checkbox
  const handleClosedChange = (day: string) => {
    setClosedDays((prev) => ({ ...prev, [day]: !prev[day] }));
    updateFormData(
      `subcategories.0.businesses.0.timings.${day}`,
      !closedDays[day] ? "Closed" : "09:00 AM - 06:00 PM"
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Information Form</h2>

        {/* Category and Subcategory Selection */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Category</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              >
                <option value="">Select a category</option>
                {categoryandsubcategory.map((category, index) => (
                  <option key={index} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Subcategory:</label>
              <select
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
                disabled={!selectedCategory}
              >
                <option value="">Select a subcategory</option>
                {getSubcategories().map((subcategory, index) => (
                  <option key={index} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Business Name:</label>
              <input
                type="text"
                placeholder={initialBusiness.businessName} // "Sample Car Repair Business"
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.businessName", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Description:</label>
              <textarea
                placeholder={initialBusiness.description} // "Top-rated car repair services..."
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Location</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Address:</label>
              <input
                type="text"
                placeholder={initialBusiness.location.address} // "123 Main Street"
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
                placeholder={initialBusiness.location.city} // "Sample City"
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
                placeholder={initialBusiness.location.state} // "Sample State"
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
                placeholder={initialBusiness.location.postalCode} // "000000"
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.location.postalCode", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Phone:</label>
              <div className="flex">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-l-md text-sm"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder={initialBusiness.contact.phone.replace("+1-", "")} // "000-000-0000"
                  onChange={(e) =>
                    updateFormData(
                      "subcategories.0.businesses.0.contact.phone",
                      `${phoneCountryCode}-${e.target.value}`
                    )
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-r-md text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Email:</label>
              <input
                type="email"
                placeholder={initialBusiness.contact.email} // "info@samplecarrepair.com"
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.contact.email", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Website:</label>
              <input
                type="url"
                placeholder={initialBusiness.contact.website} // "https://www.samplecarrepair.com"
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.contact.website", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(business.timings).map((day) => (
              <div key={day} className="flex-1 min-w-[250px]">
                <label className="block mb-2 font-medium text-gray-700">
                  {day.charAt(0).toUpperCase() + day.slice(1)}:
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={closedDays[day]}
                      onChange={() => handleClosedChange(day)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Closed</span>
                  </div>
                  {!closedDays[day] && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ClockIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="time"
                          placeholder={
                            initialBusiness.timings[day as keyof typeof initialBusiness.timings].split(" - ")[0] || "09:00 AM"
                          }
                          onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                          className="w-full pl-8 p-2 border border-gray-300 rounded-md text-sm"
                          disabled={closedDays[day]}
                        />
                      </div>
                      <div className="relative flex-1">
                        <ClockIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="time"
                          placeholder={
                            initialBusiness.timings[day as keyof typeof initialBusiness.timings].split(" - ")[1] || "06:00 PM"
                          }
                          onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                          className="w-full pl-8 p-2 border border-gray-300 rounded-md text-sm"
                          disabled={closedDays[day]}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Services</h3>
          <div className="mb-4">
            {business.services.map((service, index) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="flex-1 min-w-[250px]">
                    <label className="block mb-2 font-medium text-gray-700">Service Name:</label>
                    <input
                      type="text"
                      placeholder={
                        initialBusiness.services[index]?.name || "Enter service name"
                      } // "Car Repair Service 1"
                      onChange={(e) =>
                        handleArrayChange(
                          "subcategories.0.businesses.0.services",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      required
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block mb-2 font-medium text-gray-700">Price:</label>
                    <input
                      type="text"
                      placeholder={
                        initialBusiness.services[index]?.price || "Enter price"
                      } // "$50+"
                      onChange={(e) =>
                        handleArrayChange(
                          "subcategories.0.businesses.0.services",
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                {business.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("subcategories.0.businesses.0.services", index)}
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
            onClick={() =>
              addArrayItem("subcategories.0.businesses.0.services", { name: "", price: "" })
            }
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition"
          >
            + Add Service
          </button>
        </div>

        {/* Gallery */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Gallery</h3>
          <div className="mb-4">
            {business.gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {business.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("subcategories.0.businesses.0.gallery", index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">No images uploaded yet</p>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop images here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">Supports JPG, PNG up to 5MB</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Highlights</h3>
          <div className="mb-4">
            {business.highlights.map((highlight, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={
                      initialBusiness.highlights[index] || "Enter highlight"
                    } // "Top Rated"
                    onChange={(e) => {
                      const newHighlights = [...business.highlights];
                      newHighlights[index] = e.target.value;
                      updateFormData("subcategories.0.businesses.0.highlights", newHighlights);
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                  />
                  {business.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("subcategories.0.businesses.0.highlights", index)
                      }
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addArrayItem("subcategories.0.businesses.0.highlights", "")}
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition"
          >
            + Add Highlight
          </button>
        </div>

        {/* Call to Action */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Call to Action</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Call Number:</label>
              <div className="flex">
                <select
                  value={callCountryCode}
                  onChange={(e) => setCallCountryCode(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-l-md text-sm"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder={initialBusiness.cta.call.replace("+1-", "")} // "000-000-0000"
                  onChange={(e) =>
                    updateFormData(
                      "subcategories.0.businesses.0.cta.call",
                      `${callCountryCode}-${e.target.value}`
                    )
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-r-md text-sm"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Booking URL:</label>
              <input
                type="text"
                placeholder={initialBusiness.cta.bookUrl} // "/book/car_repair_001"
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.cta.bookUrl", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Get Directions URL:</label>
              <input
                type="url"
                placeholder={initialBusiness.cta.getDirections} // "https://maps.google.com"
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.cta.getDirections", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">FAQs</h3>
          <div className="mb-4">
            {business.faqs.map((faq, index) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                <div className="mb-3">
                  <label className="block mb-2 font-medium text-gray-700">Question:</label>
                  <input
                    type="text"
                    placeholder={
                      initialBusiness.faqs[index]?.question || "Enter question"
                    } // "What services are included?"
                    onChange={(e) =>
                      handleArrayChange(
                        "subcategories.0.businesses.0.faqs",
                        index,
                        "question",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Answer:</label>
                  <textarea
                    placeholder={
                      initialBusiness.faqs[index]?.answer || "Enter answer"
                    } // "We offer a wide range..."
                    onChange={(e) =>
                      handleArrayChange(
                        "subcategories.0.businesses.0.faqs",
                        index,
                        "answer",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"
                  />
                </div>
                {business.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("subcategories.0.businesses.0.faqs", index)}
                    className="mt-2 text-red-500 text-sm hover:text-red-700"
                  >
                    Remove FAQ
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              addArrayItem("subcategories.0.businesses.0.faqs", { question: "", answer: "" })
            }
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition"
          >
            + Add FAQ
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-2.5 rounded-md text-base hover:bg-blue-600 transition w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}