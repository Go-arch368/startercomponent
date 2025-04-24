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

const FORM_DATA_KEY = "contactAndTimingsFormData";
const PHONE_COUNTRY_CODE_KEY = "phoneCountryCode";
const CALL_COUNTRY_CODE_KEY = "callCountryCode";

const ContactAndTimings = () => {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState({
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    timings: {
      monday: "09:00 AM - 06:00 PM",
      tuesday: "09:00 AM - 06:00 PM",
      wednesday: "09:00 AM - 06:00 PM",
      thursday: "09:00 AM - 06:00 PM",
      friday: "09:00 AM - 06:00 PM",
      saturday: "10:00 AM - 04:00 PM",
      sunday: "Closed",
    },
    cta: {
      call: "",
      bookUrl: "",
      getDirections: "",
    },
  });
  const [phoneCountryCode, setPhoneCountryCode] = useState(countryCodes[0].code);
  const [callCountryCode, setCallCountryCode] = useState(countryCodes[0].code);
  const [closedDays, setClosedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: true,
  });
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (initialized || typeof window === "undefined") return;

    const apiResponse = localStorage.getItem("apiResponse");
    let parsedApiResponse = null;
    try {
      parsedApiResponse = apiResponse ? JSON.parse(apiResponse) : null;
    } catch (error) {
      console.error("Error parsing apiResponse:", error);
    }

    // Determine mode based on apiResponse
    const hasPublishedData =
      parsedApiResponse &&
      apiResponse !== "{}" &&
      apiResponse !== '""' &&
      (parsedApiResponse.contact || parsedApiResponse.timings || parsedApiResponse.cta);
    setIsReadOnly(hasPublishedData);

    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    const savedPhoneCode = localStorage.getItem(PHONE_COUNTRY_CODE_KEY);
    const savedCallCode = localStorage.getItem(CALL_COUNTRY_CODE_KEY);

    if (savedPhoneCode) setPhoneCountryCode(savedPhoneCode);
    if (savedCallCode) setCallCountryCode(savedCallCode);

    if (hasPublishedData && !savedFormData) {
      // Load published data from apiResponse
      const newFormData = {
        contact: {
          phone: parsedApiResponse.contact?.phone || "",
          email: parsedApiResponse.contact?.email || "",
          website: parsedApiResponse.contact?.website || "",
        },
        timings: {
          monday: parsedApiResponse.timings?.monday || "09:00 AM - 06:00 PM",
          tuesday: parsedApiResponse.timings?.tuesday || "09:00 AM - 06:00 PM",
          wednesday: parsedApiResponse.timings?.wednesday || "09:00 AM - 06:00 PM",
          thursday: parsedApiResponse.timings?.thursday || "09:00 AM - 06:00 PM",
          friday: parsedApiResponse.timings?.friday || "09:00 AM - 06:00 PM",
          saturday: parsedApiResponse.timings?.saturday || "10:00 AM - 04:00 PM",
          sunday: parsedApiResponse.timings?.sunday || "Closed",
        },
        cta: {
          call: parsedApiResponse.cta?.call || "",
          bookUrl: parsedApiResponse.cta?.bookUrl || "",
          getDirections: parsedApiResponse.cta?.getDirections || "",
        },
      };
      setFormData(newFormData);

      const newClosedDays = { ...closedDays };
      Object.keys(newClosedDays).forEach((day) => {
        newClosedDays[day as keyof typeof newClosedDays] =
          newFormData.timings[day as keyof typeof newFormData.timings] === "Closed";
      });
      setClosedDays(newClosedDays);
    } else if (savedFormData) {
      // Load draft data from contactAndTimingsFormData
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);

        const newClosedDays = { ...closedDays };
        Object.keys(newClosedDays).forEach((day) => {
          newClosedDays[day as keyof typeof newClosedDays] =
            parsedData.timings[day as keyof typeof parsedData.timings] === "Closed";
        });
        setClosedDays(newClosedDays);
      } catch (error) {
        console.error("Error parsing draft data:", error);
      }
    } else {
      // Load default data from businessData
      const initialBusiness = businessData.subcategories[0].businesses[0];
      setFormData({
        contact: { ...initialBusiness.contact },
        timings: { ...initialBusiness.timings },
        cta: { ...initialBusiness.cta },
      });
    }

    setInitialized(true);
  }, [initialized]);

  useEffect(() => {
    if (initialized && !isReadOnly) {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      localStorage.setItem(PHONE_COUNTRY_CODE_KEY, phoneCountryCode);
      localStorage.setItem(CALL_COUNTRY_CODE_KEY, callCountryCode);
    }
  }, [formData, phoneCountryCode, callCountryCode, initialized, isReadOnly]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    const [section, field] = name.split(".");
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleTimeChange = (day: string, type: "open" | "close", value: string) => {
    if (isReadOnly || closedDays[day as keyof typeof closedDays]) return;

    const currentTime = formData.timings[day as keyof typeof formData.timings];
    if (currentTime === "Closed") return;

    const [hours, minutes] = value.split(":");
    if (!hours || !minutes) return; // Basic validation

    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const adjustedHour = hourNum % 12 || 12;
    const formattedTime = `${adjustedHour}:${minutes} ${period}`;

    const [openPart, closePart] = currentTime.split(" - ");
    let newTime = currentTime;

    if (type === "open") {
      newTime = `${formattedTime} - ${closePart}`;
    } else {
      newTime = `${openPart} - ${formattedTime}`;
    }

    setFormData((prev) => ({
      ...prev,
      timings: {
        ...prev.timings,
        [day]: newTime,
      },
    }));
  };

  const handleClosedChange = (day: string) => {
    if (isReadOnly) return;

    const newClosedDays = {
      ...closedDays,
      [day]: !closedDays[day as keyof typeof closedDays],
    };
    setClosedDays(newClosedDays);

    setFormData((prev) => ({
      ...prev,
      timings: {
        ...prev.timings,
        [day]: newClosedDays[day as keyof typeof newClosedDays] ? "Closed" : "09:00 AM - 06:00 PM",
      },
    }));
  };

  const handleNext = () => {
    if (!isReadOnly) {
      // Save draft data only in edit mode
      const dataToSave = {
        contact: formData.contact,
        timings: formData.timings,
        cta: formData.cta,
      };
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(PHONE_COUNTRY_CODE_KEY, phoneCountryCode);
      localStorage.setItem(CALL_COUNTRY_CODE_KEY, callCountryCode);
    }
    router.push("/services");
  };

  const toggleEdit = () => {
    if (isReadOnly) {
      // Switch to edit mode
      setIsReadOnly(false);
    } else {
      // Revert to published data and clear draft
      const apiResponse = localStorage.getItem("apiResponse");
      if (apiResponse && apiResponse !== "{}" && apiResponse !== '""') {
        try {
          const parsedApiResponse = JSON.parse(apiResponse);
          const newFormData = {
            contact: {
              phone: parsedApiResponse.contact?.phone || "",
              email: parsedApiResponse.contact?.email || "",
              website: parsedApiResponse.contact?.website || "",
            },
            timings: {
              monday: parsedApiResponse.timings?.monday || "09:00 AM - 06:00 PM",
              tuesday: parsedApiResponse.timings?.tuesday || "09:00 AM - 06:00 PM",
              wednesday: parsedApiResponse.timings?.wednesday || "09:00 AM - 06:00 PM",
              thursday: parsedApiResponse.timings?.thursday || "09:00 AM - 06:00 PM",
              friday: parsedApiResponse.timings?.friday || "09:00 AM - 06:00 PM",
              saturday: parsedApiResponse.timings?.saturday || "10:00 AM - 04:00 PM",
              sunday: parsedApiResponse.timings?.sunday || "Closed",
            },
            cta: {
              call: parsedApiResponse.cta?.call || "",
              bookUrl: parsedApiResponse.cta?.bookUrl || "",
              getDirections: parsedApiResponse.cta?.getDirections || "",
            },
          };
          setFormData(newFormData);

          const newClosedDays = { ...closedDays };
          Object.keys(newClosedDays).forEach((day) => {
            newClosedDays[day as keyof typeof newClosedDays] =
              newFormData.timings[day as keyof typeof newFormData.timings] === "Closed";
          });
          setClosedDays(newClosedDays);

          // Clear draft data
          localStorage.removeItem(FORM_DATA_KEY);
        } catch (error) {
          console.error("Error reverting to published data:", error);
        }
      }
      setIsReadOnly(true);
    }
  };

  if (!initialized) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact and Timings</h2>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            Viewing published data.{" "}
            <button
              onClick={toggleEdit}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
            {formData.contact.phone || formData.contact.email || formData.cta.call
              ? "Editing contact and timings. Changes will be saved as draft."
              : "Creating new contact and timings. Data will be saved as draft."}
            {isReadOnly === false && (
              <button
                onClick={toggleEdit}
                className="ml-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Phone</label>
              <div className="flex">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => {
                    if (isReadOnly) return;
                    setPhoneCountryCode(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        phone: `${e.target.value}-${prev.contact.phone.replace(/^\+\d+-/, "")}`,
                      },
                    }));
                  }}
                  className={`w-24 p-2 border border-gray-300 rounded-l-md text-sm ${
                    isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={isReadOnly}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone.replace(`${phoneCountryCode}-`, "")}
                  onChange={(e) => {
                    if (isReadOnly) return;
                    setFormData((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        phone: `${phoneCountryCode}-${e.target.value}`,
                      },
                    }));
                  }}
                  className={`flex-1 p-2 border border-gray-300 rounded-r-md text-sm ${
                    isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                  isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Website</label>
              <input
                type="url"
                name="contact.website"
                value={formData.contact.website}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                  isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Call to Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Call Number</label>
              <div className="flex">
                <select
                  value={callCountryCode}
                  onChange={(e) => {
                    if (isReadOnly) return;
                    setCallCountryCode(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      cta: {
                        ...prev.cta,
                        call: `${e.target.value}-${prev.cta.call.replace(/^\+\d+-/, "")}`,
                      },
                    }));
                  }}
                  className={`w-24 p-2 border border-gray-300 rounded-l-md text-sm ${
                    isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={isReadOnly}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="cta.call"
                  value={formData.cta.call.replace(`${callCountryCode}-`, "")}
                  onChange={(e) => {
                    if (isReadOnly) return;
                    setFormData((prev) => ({
                      ...prev,
                      cta: {
                        ...prev.cta,
                        call: `${callCountryCode}-${e.target.value}`,
                      },
                    }));
                  }}
                  className={`flex-1 p-2 border border-gray-300 rounded-r-md text-sm ${
                    isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Booking URL</label>
              <input
                type="url"
                name="cta.bookUrl"
                value={formData.cta.bookUrl}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                  isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Get Directions</label>
              <input
                type="url"
                name="cta.getDirections"
                value={formData.cta.getDirections}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                  isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>

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
                        className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
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
                            value={hours.split(" - ")[0]?.replace(" AM", "").replace(" PM", "") || ""}
                            onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="time"
                            value={hours.split(" - ")[1]?.replace(" AM", "").replace(" PM", "") || ""}
                            onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
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

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/location")}
          >
            Back
          </Button>
          <Button
            color="primary"
            onClick={handleNext}
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactAndTimings;