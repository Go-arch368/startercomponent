"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Pencil } from "lucide-react";
import businessData from "@/data/businessData.json";

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "INR" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
];

const ContactAndTimings = () => {
  const router = useRouter();
  const [hasPublishedData, setHasPublishedData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => ({
    contact: {
      phone: "",
      email: "",
      website: ""
    },
    timings: {
      monday: "09:00 AM - 06:00 PM",
      tuesday: "09:00 AM - 06:00 PM",
      wednesday: "09:00 AM - 06:00 PM",
      thursday: "09:00 AM - 06:00 PM",
      friday: "09:00 AM - 06:00 PM",
      saturday: "10:00 AM - 04:00 PM",
      sunday: "Closed"
    },
    cta: {
      call: "",
      bookUrl: "",
      getDirections: ""
    }
  }));
  const [phoneCountryCode, setPhoneCountryCode] = useState(countryCodes[0].code);
  const [callCountryCode, setCallCountryCode] = useState(countryCodes[0].code);
  const [closedDays, setClosedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: true
  });

  useEffect(() => {
    const apiResponse = localStorage.getItem("apiResponse");
    const contactAndTimingsFormData = localStorage.getItem("contactAndTimingsFormData");

    // Check if apiResponse exists and has contact/timings data
    let publishedDataExists = false;
    try {
      const parsedApiResponse = apiResponse ? JSON.parse(apiResponse) : null;
      publishedDataExists = Boolean(
        parsedApiResponse?.contact && 
        parsedApiResponse?.timings && 
        parsedApiResponse?.cta
      );
    } catch (e) {
      publishedDataExists = false;
    }

    setHasPublishedData(publishedDataExists);

    if (publishedDataExists) {
      // Load from published data
      const parsedApiResponse = JSON.parse(apiResponse!);
      setFormData({
        contact: {
          phone: parsedApiResponse.contact?.phone || "",
          email: parsedApiResponse.contact?.email || "",
          website: parsedApiResponse.contact?.website || ""
        },
        timings: {
          monday: parsedApiResponse.timings?.monday || "09:00 AM - 06:00 PM",
          tuesday: parsedApiResponse.timings?.tuesday || "09:00 AM - 06:00 PM",
          wednesday: parsedApiResponse.timings?.wednesday || "09:00 AM - 06:00 PM",
          thursday: parsedApiResponse.timings?.thursday || "09:00 AM - 06:00 PM",
          friday: parsedApiResponse.timings?.friday || "09:00 AM - 06:00 PM",
          saturday: parsedApiResponse.timings?.saturday || "10:00 AM - 04:00 PM",
          sunday: parsedApiResponse.timings?.sunday || "Closed"
        },
        cta: {
          call: parsedApiResponse.cta?.call || "",
          bookUrl: parsedApiResponse.cta?.bookUrl || "",
          getDirections: parsedApiResponse.cta?.getDirections || ""
        }
      });
      
      // Set closed days based on timings
      const newClosedDays = { ...closedDays };
      Object.keys(newClosedDays).forEach(day => {
        newClosedDays[day as keyof typeof newClosedDays] = 
          parsedApiResponse.timings?.[day] === "Closed";
      });
      setClosedDays(newClosedDays);
      
      setIsEditing(false); // Start in read-only mode
    } else if (contactAndTimingsFormData) {
      // Load from draft data
      try {
        const parsedData = JSON.parse(contactAndTimingsFormData);
        setFormData(parsedData);
        setIsEditing(true); // Start in edit mode
      } catch (error) {
        console.error("Error parsing draft data", error);
      }
    } else {
      // Load default data
      const initialBusiness = businessData.subcategories[0].businesses[0];
      setFormData({
        contact: { ...initialBusiness.contact },
        timings: { ...initialBusiness.timings },
        cta: { ...initialBusiness.cta }
      });
      setIsEditing(true); // Start in edit mode
    }

    // Load saved country codes
    const savedPhoneCountryCode = localStorage.getItem("phoneCountryCode");
    const savedCallCountryCode = localStorage.getItem("callCountryCode");
    if (savedPhoneCountryCode) setPhoneCountryCode(savedPhoneCountryCode);
    if (savedCallCountryCode) setCallCountryCode(savedCallCountryCode);
  }, []);

  const isReadOnly = hasPublishedData && !isEditing;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleTimeChange = (day: string, type: 'open' | 'close', value: string) => {
    if (isReadOnly || closedDays[day as keyof typeof closedDays]) return;

    const currentTime = formData.timings[day as keyof typeof formData.timings];
    if (currentTime === "Closed") return;

    const [openPart, closePart] = currentTime.split(" - ");
    let newTime = currentTime;

    if (type === 'open') {
      newTime = `${value} - ${closePart}`;
    } else {
      newTime = `${openPart} - ${value}`;
    }

    setFormData(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        [day]: newTime
      }
    }));
  };

  const handleClosedChange = (day: string) => {
    if (isReadOnly) return;

    const newClosedDays = {
      ...closedDays,
      [day]: !closedDays[day as keyof typeof closedDays]
    };
    setClosedDays(newClosedDays);

    setFormData(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        [day]: newClosedDays[day as keyof typeof newClosedDays] ? "Closed" : "09:00 AM - 06:00 PM"
      }
    }));
  };

  const handleNext = () => {
    // Save to localStorage
    localStorage.setItem("contactAndTimingsFormData", JSON.stringify(formData));
    localStorage.setItem("phoneCountryCode", phoneCountryCode);
    localStorage.setItem("callCountryCode", callCountryCode);
    router.push("/services");
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contact and Timings</h2>
          {isReadOnly && (
            <button
              onClick={toggleEdit}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {isReadOnly && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            Viewing published data.{" "}
            <button 
              onClick={toggleEdit}
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Click here to edit
            </button>
          </div>
        )}

        {/* Contact Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Phone</label>
              {isReadOnly ? (
                <div className="p-2 bg-gray-100 rounded-md">{formData.contact.phone}</div>
              ) : (
                <div className="flex">
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="w-24 p-2 border border-gray-300 rounded-l-md"
                  >
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={formData.contact.phone.replace(`${phoneCountryCode}-`, "")}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          phone: `${phoneCountryCode}-${e.target.value}`
                        }
                      }));
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-r-md"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Email</label>
              {isReadOnly ? (
                <div className="p-2 bg-gray-100 rounded-md">{formData.contact.email}</div>
              ) : (
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Website</label>
              {isReadOnly ? (
                <div className="p-2 bg-gray-100 rounded-md">{formData.contact.website}</div>
              ) : (
                <input
                  type="url"
                  name="contact.website"
                  value={formData.contact.website}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Call to Action</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Call Number</label>
              {isReadOnly ? (
                <div className="p-2 bg-gray-100 rounded-md">{formData.cta.call}</div>
              ) : (
                <div className="flex">
                  <select
                    value={callCountryCode}
                    onChange={(e) => setCallCountryCode(e.target.value)}
                    className="w-24 p-2 border border-gray-300 rounded-l-md"
                  >
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="cta.call"
                    value={formData.cta.call.replace(`${callCountryCode}-`, "")}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        cta: {
                          ...prev.cta,
                          call: `${callCountryCode}-${e.target.value}`
                        }
                      }));
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-r-md"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Booking URL</label>
              {isReadOnly ? (
                <div className="p-2 bg-gray-100 rounded-md">{formData.cta.bookUrl}</div>
              ) : (
                <input
                  type="text"
                  name="cta.bookUrl"
                  value={formData.cta.bookUrl}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Get Directions</label>
              {isReadOnly ? (
                <div className="p-2 bg-gray-100 rounded-md">{formData.cta.getDirections}</div>
              ) : (
                <input
                  type="url"
                  name="cta.getDirections"
                  value={formData.cta.getDirections}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Hours</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(formData.timings).map(([day, hours]) => (
              <div key={day} className="space-y-2">
                <label className="block font-medium text-gray-700">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
                
                {isReadOnly ? (
                  <div className="p-2 bg-gray-100 rounded-md">
                    {hours === "Closed" ? "Closed" : hours}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`closed-${day}`}
                        checked={closedDays[day as keyof typeof closedDays]}
                        onChange={() => handleClosedChange(day)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor={`closed-${day}`} className="ml-2 text-sm text-gray-600">
                        Closed
                      </label>
                    </div>
                    
                    {!closedDays[day as keyof typeof closedDays] && (
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <input
                            type="time"
                            value={hours.split(" - ")[0].replace(" AM", "").replace(" PM", "")}
                            onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="time"
                            value={hours.split(" - ")[1].replace(" AM", "").replace(" PM", "")}
                            onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <Button
            className="border border-gray-300 bg-white text-gray-700"
            onClick={() => router.push("/location")}
          >
            Back
          </Button>
          <Button
            color="primary"
            onClick={handleNext}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactAndTimings;