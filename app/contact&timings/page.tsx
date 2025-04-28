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
      localStorage.setItem("hasChanges", "true");
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
    localStorage.setItem("hasChanges", "true");
  };

  const handleTimeChange = (day: string, type: "open" | "close", value: string) => {
    if (isReadOnly || closedDays[day as keyof typeof closedDays]) return;

    const currentTime = formData.timings[day as keyof typeof formData.timings];
    if (currentTime === "Closed") return;

    const [hours, minutes] = value.split(":");
    if (!hours || !minutes) return;

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
    localStorage.setItem("hasChanges", "true");
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
    localStorage.setItem("hasChanges", "true");
  };

  const handleNext = () => {
    if (!isReadOnly) {
      const dataToSave = {
        contact: formData.contact,
        timings: formData.timings,
        cta: formData.cta,
      };
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(PHONE_COUNTRY_CODE_KEY, phoneCountryCode);
      localStorage.setItem(CALL_COUNTRY_CODE_KEY, callCountryCode);
      localStorage.setItem("hasChanges", "true");
    }
    router.push("/services");
  };

  const toggleEdit = () => {
    if (isReadOnly) {
      setIsReadOnly(false);
      localStorage.setItem("isEditModeActive", "true");
      localStorage.setItem("hasChanges", "true");
      console.log("Edit mode enabled via ContactAndTimings pencil");
    } else {
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
        } catch (error) {
          console.error("Error resetting form data:", error);
        }
      }
      setIsReadOnly(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form className="bg-gray-50 rounded-lg shadow-sm p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contact & Timings</h2>
          {isReadOnly && (
            <button
              onClick={toggleEdit}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit Contact and Timings"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-gray-100 text-gray-800 rounded-md">
            Viewing saved contact and timings information.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            {isReadOnly ? "Editing contact and timings." : "Please enter your contact and timings information."}
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Phone Number:</label>
              <div className="flex">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => !isReadOnly && setPhoneCountryCode(e.target.value)}
                  className={`w-24 p-2 border border-gray-300 rounded-l-md text-sm ${
                    isReadOnly ? "bg-gray-100" : ""
                  } focus:ring-2 focus:ring-gray-500`}
                  disabled={isReadOnly}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <input
                  name="contact.phone"
                  type="tel"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  className={`flex-1 p-2 border border-gray-300 rounded-r-md text-sm ${
                    isReadOnly ? "bg-gray-100" : ""
                  } focus:ring-2 focus:ring-gray-500`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Email:</label>
              <input
                name="contact.email"
                type="email"
                value={formData.contact.email}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                  isReadOnly ? "bg-gray-100" : ""
                } focus:ring-2 focus:ring-gray-500`}
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700">Website:</label>
              <input
                name="contact.website"
                type="url"
                value={formData.contact.website}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                  isReadOnly ? "bg-gray-100" : ""
                } focus:ring-2 focus:ring-gray-500`}
                placeholder="Enter website URL"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Hours</h3>
          {Object.keys(formData.timings).map((day) => (
            <div key={day} className="flex items-center gap-4 mb-4">
              <div className="w-24 capitalize">{day}:</div>
              <div className="flex-1">
                {closedDays[day as keyof typeof closedDays] ? (
                  <span className="text-gray-500">Closed</span>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={
                        formData.timings[day as keyof typeof formData.timings]
                          .split(" - ")[0]
                          .replace(/ (AM|PM)/, "")
                          .replace(/^(\d):/, "0$1:")
                      }
                      onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                      readOnly={isReadOnly}
                      className={`w-32 p-2 border border-gray-300 rounded-md text-sm ${
                        isReadOnly ? "bg-gray-100" : ""
                      } focus:ring-2 focus:ring-gray-500`}
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={
                        formData.timings[day as keyof typeof formData.timings]
                          .split(" - ")[1]
                          .replace(/ (AM|PM)/, "")
                          .replace(/^(\d):/, "0$1:")
                      }
                      onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                      readOnly={isReadOnly}
                      className={`w-32 p-2 border border-gray-300 rounded-md text-sm ${
                        isReadOnly ? "bg-gray-100" : ""
                      } focus:ring-2 focus:ring-gray-500`}
                    />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={closedDays[day as keyof typeof closedDays]}
                  onChange={() => handleClosedChange(day)}
                  disabled={isReadOnly}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                Closed
              </label>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-gray-500"
            onClick={() => router.push("/location")}
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700"
            color="primary"
            onClick={handleNext}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactAndTimings;