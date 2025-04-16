"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { ClockIcon } from "@heroicons/react/24/outline";
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
  const [formData, setFormData] = useState({
    subcategories: [
      {
        businesses: [
          {
            contact: { ...businessData.subcategories[0].businesses[0].contact },
            timings: { ...businessData.subcategories[0].businesses[0].timings },
            cta: { ...businessData.subcategories[0].businesses[0].cta },
          },
        ],
      },
    ],
  });
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

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const parseTimeTo24Hour = (time: string | undefined) => {
    if (!time || time === "Closed" || !time.includes(" ")) return "";
    try {
      const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return "";
      let [_, hours, minutes, period] = match;
      let hour = parseInt(hours, 10);
      if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
      if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, "0")}:${minutes}`;
    } catch (error) {
      console.error(`Error parsing time: ${time}`, error);
      return "";
    }
  };

  const getTimeValues = (timeString: string | undefined) => {
    if (!timeString || timeString === "Closed") {
      return { open: "09:00", close: "17:00" };
    }
    try {
      const [open, close] = timeString.split(" - ").map((t) => parseTimeTo24Hour(t));
      return {
        open: open || "09:00",
        close: close || "17:00",
      };
    } catch (error) {
      console.error(`Error splitting time string: ${timeString}`, error);
      return { open: "09:00", close: "17:00" };
    }
  };

  const handleTimeChange = (day: string, type: string, value: string) => {
    if (closedDays[day]) return;
    const timings = { ...formData.subcategories[0].businesses[0].timings };
    const { open, close } = getTimeValues(timings[day]);
    const newOpen = type === "open" ? value : open;
    const newClose = type === "close" ? value : close;
    const formatted = `${formatTime(newOpen)} - ${formatTime(newClose)}`;
    updateFormData(`subcategories.0.businesses.0.timings.${day}`, formatted);
  };

  const handleClosedChange = (day: string) => {
    setClosedDays((prev) => ({ ...prev, [day]: !prev[day] }));
    updateFormData(
      `subcategories.0.businesses.0.timings.${day}`,
      !closedDays[day] ? "Closed" : "09:00 AM - 06:00 PM"
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData, null, 2);
    console.log("Submitted Contact and Timings Data:", jsonData);
    alert("Submitted Contact and Timings Data:\n" + jsonData);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact and Timings</h2>

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
                  placeholder={initialBusiness.contact.phone.replace("+1-", "")}
                  value={formData.subcategories[0].businesses[0].contact.phone.replace(`${phoneCountryCode}-`, "")}
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
                placeholder={initialBusiness.contact.email}
                value={formData.subcategories[0].businesses[0].contact.email}
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
                placeholder={initialBusiness.contact.website}
                value={formData.subcategories[0].businesses[0].contact.website}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.contact.website", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
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
                  placeholder={initialBusiness.cta.call.replace("+1-", "")}
                  value={formData.subcategories[0].businesses[0].cta.call.replace(`${callCountryCode}-`, "")}
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
                placeholder={initialBusiness.cta.bookUrl}
                value={formData.subcategories[0].businesses[0].cta.bookUrl}
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
                placeholder={initialBusiness.cta.getDirections}
                value={formData.subcategories[0].businesses[0].cta.getDirections}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.cta.getDirections", e.target.value)
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
            {Object.keys(formData.subcategories[0].businesses[0].timings).map((day) => {
              const { open, close } = getTimeValues(formData.subcategories[0].businesses[0].timings[day]);
              return (
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
                            value={open}
                            onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                            className="w-full pl-8 p-2 border border-gray-300 rounded-md text-sm"
                            disabled={closedDays[day]}
                          />
                        </div>
                        <div className="relative flex-1">
                          <ClockIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="time"
                            value={close}
                            onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                            className="w-full pl-8 p-2 border border-gray-300 rounded-md text-sm"
                            disabled={closedDays[day]}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700"
            onClick={() => router.push("/location")}
            type="button"
          >
            Back
          </Button>
          {/* <Button
            type="submit"
            className="w-full sm:w-auto"
            color="primary"
          >
            Submit
          </Button> */}
          <Button
            className="w-full sm:w-auto"
            color="primary"
            onClick={() => router.push("/services")}
            type="button"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactAndTimings;