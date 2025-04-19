"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@heroui/button";
import businessData from "@/data/businessData.json";

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "INR" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
];

const FORM_DATA_KEY = "galleryFaqsCtaFormData";
const CALL_COUNTRY_CODE_KEY = "callCountryCode";
const BUSINESS_DATA_KEY = "businessData";

interface FAQ {
  question: string;
  answer: string;
}

interface CTA {
  call: string;
  bookUrl: string;
  getDirections: string;
}

interface Business {
  businessName: string;
  description: string;
  location: any;
  contact: any;
  services: any[];
  timings: any;
  gallery: string[];
  faqs: FAQ[];
  cta: CTA;
}

interface FormData {
  subcategories: {
    businesses: Business[];
  }[];
}

const GalleryFAQsAndCTA = () => {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    return savedData
      ? JSON.parse(savedData)
      : {
          subcategories: [
            {
              businesses: [
                {
                  businessName: "",
                  description: "",
                  location: {},
                  contact: {},
                  services: [],
                  timings: {},
                  gallery: [],
                  faqs: [],
                  cta: {
                    call: "",
                    bookUrl: "",
                    getDirections: "",
                  },
                },
              ],
            },
          ],
        };
  });
  const [callCountryCode, setCallCountryCode] = useState(() => {
    return localStorage.getItem(CALL_COUNTRY_CODE_KEY) || countryCodes[0].code;
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const initialBusiness = businessData.subcategories[0].businesses[0];

  // Load initial data and merge from previous steps
  useEffect(() => {
    if (initialized) return;

    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    } else {
      const welcomeData = JSON.parse(localStorage.getItem("welcome") || "{}");
      const businessFormData = JSON.parse(localStorage.getItem("businessFormData") || "{}");
      const locationFormData = JSON.parse(localStorage.getItem("locationFormData") || "{}");
      const contactAndTimingsFormData = JSON.parse(
        localStorage.getItem("contactAndTimingsFormData") || "{}"
      );
      const servicesFormData = JSON.parse(localStorage.getItem("servicesFormData") || "{}");

      setFormData({
        subcategories: [
          {
            businesses: [
              {
                businessName:
                  businessFormData.subcategories?.[0]?.businesses?.[0]?.businessName ||
                  initialBusiness.businessName,
                description:
                  businessFormData.subcategories?.[0]?.businesses?.[0]?.description ||
                  initialBusiness.description,
                location:
                  locationFormData.subcategories?.[0]?.businesses?.[0]?.location ||
                  initialBusiness.location,
                contact:
                  contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.contact ||
                  initialBusiness.contact,
                services:
                  servicesFormData.subcategories?.[0]?.businesses?.[0]?.services ||
                  initialBusiness.services,
                timings:
                  contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.timings ||
                  initialBusiness.timings,
                gallery: [],
                faqs: [],
                cta: {
                  call:
                    contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.cta?.call ||
                    initialBusiness.cta.call,
                  bookUrl:
                    contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.cta?.bookUrl ||
                    initialBusiness.cta.bookUrl,
                  getDirections:
                    contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.cta
                      ?.getDirections || initialBusiness.cta.getDirections,
                },
              },
            ],
          },
        ],
      });
    }
    setInitialized(true);
  }, [initialized]);

  // Save formData and callCountryCode to localStorage
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      localStorage.setItem(CALL_COUNTRY_CODE_KEY, callCountryCode);
    }
  }, [formData, callCountryCode, initialized]);

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
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPG and PNG files are supported.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      addArrayItem("subcategories.0.businesses.0.gallery", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    
    const welcomeData = JSON.parse(localStorage.getItem("welcome") || "{}");
    const businessFormData = JSON.parse(localStorage.getItem("businessFormData") || "{}");
    const locationFormData = JSON.parse(localStorage.getItem("locationFormData") || "{}");
    const contactAndTimingsFormData = JSON.parse(
      localStorage.getItem("contactAndTimingsFormData") || "{}"
    );
    const servicesFormData = JSON.parse(localStorage.getItem("servicesFormData") || "{}");
    const currentBusiness = formData.subcategories[0].businesses[0];

    // Create complete business data object
    const completeBusinessData = {
      welcome: {
        category: welcomeData.category || "",
        subcategory: welcomeData.subcategory || "",
      },
      business: {
        businessName:
          businessFormData.subcategories?.[0]?.businesses?.[0]?.businessName ||
          currentBusiness.businessName ||
          "",
        description:
          businessFormData.subcategories?.[0]?.businesses?.[0]?.description ||
          currentBusiness.description ||
          "",
      },
      location:
        locationFormData.subcategories?.[0]?.businesses?.[0]?.location ||
        currentBusiness.location ||
        {},
      contact:
        contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.contact ||
        currentBusiness.contact ||
        {},
      services:
        servicesFormData.subcategories?.[0]?.businesses?.[0]?.services ||
        currentBusiness.services ||
        [],
      timings:
        contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.timings ||
        currentBusiness.timings ||
        {},
      gallery: currentBusiness.gallery || [],
      faqs: currentBusiness.faqs || [],
      cta: {
        call: currentBusiness.cta.call || "",
        bookUrl: currentBusiness.cta.bookUrl || "",
        getDirections: currentBusiness.cta.getDirections || "",
      },
    };

    try {
     
      localStorage.setItem(BUSINESS_DATA_KEY, JSON.stringify(completeBusinessData));

    
      const response = await axios.post("http://localhost:4000/businesses", completeBusinessData);

      console.log("API Response:", response.data);

      
      localStorage.setItem("apiResponse", JSON.stringify(response.data));

    
      localStorage.removeItem("welcome");
      localStorage.removeItem("businessFormData");
      localStorage.removeItem("locationFormData");
      localStorage.removeItem("contactAndTimingsFormData");
      localStorage.removeItem("servicesFormData");
      localStorage.removeItem(FORM_DATA_KEY);
      localStorage.removeItem(CALL_COUNTRY_CODE_KEY);

      alert("Business published successfully!");
      router.push("/review&publish");
    } catch (error) {
      console.error("Error publishing business:", error);
      alert("Failed to publish business. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const currentBusiness = formData.subcategories[0].businesses[0];

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form
        className="bg-gray-50 rounded-lg shadow-sm p-6"
        data-testid="gallery-faqs-cta-form"
        aria-describedby="form-instructions"
      >
        <p id="form-instructions" className="sr-only">
          Upload images to the gallery, add FAQs, and provide call-to-action details. Use the buttons to navigate or publish the business.
        </p>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Gallery, FAQs, and Call to Action
        </h2>

        {/* Gallery Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Gallery</h3>
          <div className="mb-4">
            {currentBusiness.gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {currentBusiness.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("subcategories.0.businesses.0.gallery", index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition focus:ring-2 focus:ring-red-500"
                      aria-label={`Remove image ${index + 1}`}
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
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  aria-label="Upload image to gallery"
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
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG up to 5MB
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Call to Action</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label id="call-label" className="block mb-2 font-medium text-gray-700">
                Call Number:
              </label>
              <div className="flex" role="group" aria-labelledby="call-label">
                <label htmlFor="call-code" className="sr-only">
                  Select country code for call
                </label>
                <select
                  id="call-code"
                  value={callCountryCode}
                  onChange={(e) => setCallCountryCode(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-l-md text-sm focus:ring-2 focus:ring-blue-500"
                  aria-label="Country code"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="call-number"
                  placeholder="Phone number"
                  value={currentBusiness.cta.call.replace(`${callCountryCode}-`, "") || ""}
                  onChange={(e) =>
                    updateFormData(
                      "subcategories.0.businesses.0.cta.call",
                      `${callCountryCode}-${e.target.value.replace(/[^0-9]/g, "")}`
                    )
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-r-md text-sm focus:ring-2 focus:ring-blue-500"
                  aria-label="Call number"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="book-url" className="block mb-2 font-medium text-gray-700">
                Booking URL:
              </label>
              <input
                type="url"
                id="book-url"
                placeholder="https://example.com/book"
                value={currentBusiness.cta.bookUrl || ""}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.cta.bookUrl", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="directions-url" className="block mb-2 font-medium text-gray-700">
                Get Directions URL:
              </label>
              <input
                type="url"
                id="directions-url"
                placeholder="https://maps.google.com/..."
                value={currentBusiness.cta.getDirections || ""}
                onChange={(e) =>
                  updateFormData("subcategories.0.businesses.0.cta.getDirections", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">FAQs</h3>
          <div className="mb-4">
            {currentBusiness.faqs.map((faq, index) => (
              <div
                key={index}
                className="mb-4 p-3 border border-gray-400 rounded-md bg-white"
              >
                <div className="mb-3">
                  <label
                    htmlFor={`faq-question-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Question:
                  </label>
                  <input
                    type="text"
                    id={`faq-question-${index}`}
                    placeholder="Enter question"
                    value={faq.question || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "subcategories.0.businesses.0.faqs",
                        index,
                        "question",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`faq-answer-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Answer:
                  </label>
                  <textarea
                    id={`faq-answer-${index}`}
                    placeholder="Enter answer"
                    value={faq.answer || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "subcategories.0.businesses.0.faqs",
                        index,
                        "answer",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm h-24 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {currentBusiness.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("subcategories.0.businesses.0.faqs", index)}
                    className="mt-2 text-red-800 text-sm hover:text-red-900 focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove FAQ ${index + 1}`}
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
              addArrayItem("subcategories.0.businesses.0.faqs", {
                question: "",
                answer: "",
              })
            }
            className="bg-green-700 text-white px-4 py-2 rounded-md text-sm hover:bg-green-800 transition focus:ring-2 focus:ring-green-700"
            aria-label="Add new FAQ"
          >
            + Add FAQ
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/services")}
            type="button"
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            color="primary"
            onClick={handlePublish}
            type="button"
            disabled={isPublishing}
            aria-label={isPublishing ? "Publishing in progress" : "Publish business"}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GalleryFAQsAndCTA;