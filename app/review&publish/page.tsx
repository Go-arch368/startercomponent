
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/data/businessData.json";
import axios from "axios";

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
const PUBLISH_FORM_DATA_KEY = "publishFormData";

interface FAQ {
  question: string;
  answer: string;
}

interface CTA {
  call: string;
  bookUrl: string;
  getDirections: string;
}

interface Service {
  name: string;
  price: string;
}

interface Business {
  businessName: string;
  description: string;
  location: any;
  contact: any;
  services: Service[];
  timings: any;
  gallery: string[];
  faqs: FAQ[];
  cta: CTA;
}

interface FormData {
  subcategories?: {
    businesses?: Business[];
  }[];
}

interface WelcomeData {
  category: string;
  subcategory: string;
}

interface PublishedBusinessData {
  welcome: {
    category: string;
    subcategory: string;
  };
  business: {
    businessName: string;
    description: string;
  };
  location: {
    address: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  services: Service[];
  timings: { [key: string]: string };
  gallery: string[];
  faqs: FAQ[];
  cta: CTA;
}

// Axios instance for MockAPI
const api = axios.create({
  baseURL: "https://680b2310d5075a76d989f52e.mockapi.io",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const GalleryFAQsAndCTA = () => {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [callCountryCode, setCallCountryCode] = useState<string>(countryCodes[0].code);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [welcomeData, setWelcomeData] = useState<WelcomeData>({
    category: "",
    subcategory: "",
  });
  const [isPublished, setIsPublished] = useState(false); // Track successful publish

  const initialBusiness = businessData.subcategories[0].businesses[0];

  // Check if apiResponse exists with welcome data, redirect to /welcome if not
  useEffect(() => {
    if (typeof window === "undefined" || isPublished) return;

    const apiResponseRaw = localStorage.getItem("apiResponse") || "{}";
    let apiResponse: { welcome?: WelcomeData } = {};

    try {
      apiResponse = JSON.parse(apiResponseRaw) || {};
    } catch (err) {
      console.error("Error parsing apiResponse:", err);
    }

    if (!apiResponse.welcome?.category?.trim() || !apiResponse.welcome?.subcategory?.trim()) {
      console.warn("apiResponse is missing category or subcategory, redirecting to /welcome");
      router.push("/welcome");
    } else {
      setWelcomeData({
        category: apiResponse.welcome.category || "",
        subcategory: apiResponse.welcome.subcategory || "",
      });
    }
  }, [router, isPublished]);

  useEffect(() => {
    if (initialized || typeof window === "undefined") return;

    const publishFormData = localStorage.getItem(PUBLISH_FORM_DATA_KEY);
    const isPublished = publishFormData ? JSON.parse(publishFormData).published : false;
    setIsReadOnly(isPublished);

    let parsedApiResponse: {
      welcome?: { completed?: boolean; category?: string; subcategory?: string };
      gallery?: string[];
      faqs?: FAQ[];
      cta?: CTA;
    } = {};

    const apiResponse = localStorage.getItem("apiResponse");
    if (apiResponse && apiResponse !== "{}" && apiResponse !== '""') {
      try {
        parsedApiResponse = JSON.parse(apiResponse) || {};
      } catch (err) {
        console.error("Invalid apiResponse JSON:", err);
      }
    }

    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    const savedCallCode = localStorage.getItem(CALL_COUNTRY_CODE_KEY);
    if (savedCallCode) setCallCountryCode(savedCallCode);

    if (savedFormData && savedFormData !== "null") {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (err) {
        console.error("Error parsing savedFormData:", err);
      }
    } else {
      const businessFormData = JSON.parse(localStorage.getItem("businessInfoFormData") || "{}");
      const locationFormData: { subcategories?: { businesses?: { location: any }[] }[] } = 
        JSON.parse(localStorage.getItem("locationFormData") || '{"subcategories":[{"businesses":[{"location":{}}]}]}');
      const contactAndTimingsFormData: { subcategories?: { businesses?: { contact?: any; timings?: any }[] }[] } = 
        JSON.parse(localStorage.getItem("contactAndTimingsFormData") || '{"subcategories":[{"businesses":[{}]}]}');
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
                  locationFormData.subcategories?.[0]?.businesses?.[0]?.location || initialBusiness.location,
                contact:
                  contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.contact ||
                  initialBusiness.contact,
                services:
                  servicesFormData.subcategories?.[0]?.businesses?.[0]?.services || initialBusiness.services,
                timings:
                  contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.timings ||
                  initialBusiness.timings,
                gallery: parsedApiResponse.gallery || initialBusiness.gallery || [],
                faqs: parsedApiResponse.faqs || initialBusiness.faqs || [],
                cta: {
                  call:
                    parsedApiResponse.cta?.call ||
                    parsedApiResponse.cta?.call ||
                    initialBusiness.cta.call,
                  bookUrl:
                    parsedApiResponse.cta?.bookUrl ||
                    parsedApiResponse.cta?.bookUrl ||
                    initialBusiness.cta.bookUrl,
                  getDirections:
                    parsedApiResponse.cta?.getDirections ||
                    parsedApiResponse.cta?.getDirections ||
                    initialBusiness.cta.getDirections,
                },
              },
            ],
          },
        ],
      });
    }

    setInitialized(true);
  }, [initialized]);

  useEffect(() => {
    if (initialized && formData && !isReadOnly) {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      localStorage.setItem(CALL_COUNTRY_CODE_KEY, callCountryCode);
    }
  }, [formData, callCountryCode, initialized, isReadOnly]);

  const updateFormData = (path: string, value: any) => {
    if (!formData || isReadOnly) return;
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
    if (!formData || isReadOnly) return;
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
    if (!formData || isReadOnly) return;
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
    if (!formData || isReadOnly) return;
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
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (!file || !formData) return;

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

  const handleEdit = () => {
    setIsReadOnly(false);
    localStorage.setItem(PUBLISH_FORM_DATA_KEY, JSON.stringify({ published: false }));
  };

  const handlePublishOrUpdate = async () => {
    if (!formData) return;
    setIsPublishing(true);

    try {
      const apiResponseRaw = localStorage.getItem("apiResponse") || "{}";
      let apiResponse: { welcome?: WelcomeData } = {};
      try {
        apiResponse = JSON.parse(apiResponseRaw) || {};
      } catch (err) {
        console.error("Error parsing apiResponse:", err);
        throw new Error("Invalid apiResponse in localStorage.");
      }

      const category = apiResponse.welcome?.category?.trim() || "";
      const subcategory = apiResponse.welcome?.subcategory?.trim() || "";
      if (!category || !subcategory) {
        throw new Error("Category and subcategory must be provided from the welcome step.");
      }

      const businessFormDataRaw = localStorage.getItem("businessInfoFormData") || "{}";
      const locationFormDataRaw = localStorage.getItem("locationFormData") || "{}";
      const contactAndTimingsFormDataRaw = localStorage.getItem("contactAndTimingsFormData") || "{}";
      const servicesFormDataRaw = localStorage.getItem("servicesFormData") || "{}";

      let businessFormData: FormData = { subcategories: [{ businesses: [] }] };
      let locationFormData: { subcategories?: { businesses?: { location: any }[] }[] } = {
        subcategories: [{ businesses: [{ location: {} }] }],
      };
      let contactAndTimingsFormData: { subcategories?: { businesses?: { contact?: any; timings?: any }[] }[] } = {
        subcategories: [{ businesses: [{}] }],
      };
      let servicesFormData: FormData = { subcategories: [{ businesses: [] }] };

      try {
        businessFormData = JSON.parse(businessFormDataRaw) as FormData || { subcategories: [{ businesses: [] }] };
        locationFormData = JSON.parse(locationFormDataRaw) || { subcategories: [{ businesses: [{ location: {} }] }] };
        contactAndTimingsFormData = JSON.parse(contactAndTimingsFormDataRaw) || {
          subcategories: [{ businesses: [{}] }],
        };
        servicesFormData = JSON.parse(servicesFormDataRaw) || { subcategories: [{ businesses: [] }] };
      } catch (err) {
        console.error("Error parsing localStorage data:", err);
        throw new Error("Invalid data in localStorage.");
      }

      const currentBusiness = formData.subcategories?.[0]?.businesses?.[0] || {
        businessName: "",
        description: "",
        location: {},
        contact: {},
        services: [],
        timings: {},
        gallery: [],
        faqs: [],
        cta: { call: "", bookUrl: "", getDirections: "" },
      };
      const contactData =
        contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.contact || currentBusiness.contact || {};
      const phone = contactData.phone || "";
      const email = contactData.email || "";
      const website = contactData.website || "";

      const completeBusinessData: PublishedBusinessData = {
        welcome: {
          category: category,
          subcategory: subcategory,
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
          locationFormData.subcategories?.[0]?.businesses?.[0]?.location || currentBusiness.location || {
            address: "",
            city: "",
          },
        contact: {
          phone,
          email,
          website,
        },
        services:
          servicesFormData.subcategories?.[0]?.businesses?.[0]?.services || currentBusiness.services || [],
        timings:
          contactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.timings || currentBusiness.timings || {},
        gallery: currentBusiness.gallery || [],
        faqs: currentBusiness.faqs || [],
        cta: {
          call: currentBusiness.cta.call || "",
          bookUrl: currentBusiness.cta.bookUrl || "",
          getDirections: currentBusiness.cta.getDirections || "",
        },
      };

      if (!completeBusinessData.business.businessName) {
        throw new Error("Business name is required.");
      }
      if (!completeBusinessData.welcome.category.trim() || !completeBusinessData.welcome.subcategory.trim()) {
        throw new Error("Category and subcategory are required and cannot be empty.");
      }
      if (!completeBusinessData.location.address || !completeBusinessData.location.city) {
        throw new Error("Address and city are required.");
      }
      if (!completeBusinessData.services.length) {
        throw new Error("At least one service is required.");
      }

      console.log("Publishing/Updating data:", JSON.stringify(completeBusinessData, null, 2));

      const lastPublishedBusinessId = localStorage.getItem("lastPublishedBusinessId");
      let response;
      if (lastPublishedBusinessId && isPublished) {
        // Update existing record
        response = await api.put(`/data/${lastPublishedBusinessId}`, completeBusinessData);
      } else {
        // Create new record
        response = await api.post("/data", completeBusinessData);
        localStorage.setItem("lastPublishedBusinessId", response.data.id);
      }
      const savedBusiness = response.data;

      // Store data in localStorage
      localStorage.setItem(PUBLISH_FORM_DATA_KEY, JSON.stringify({ published: true }));
      localStorage.setItem(BUSINESS_DATA_KEY, JSON.stringify(completeBusinessData));
      localStorage.setItem("apiResponse", JSON.stringify(completeBusinessData));
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData)); // Ensure form data persists
      localStorage.setItem(CALL_COUNTRY_CODE_KEY, callCountryCode); // Persist call country code

      setIsPublished(true);
      setIsReadOnly(true); // Set to read-only mode

      alert(isPublished ? "Business updated successfully!" : "Business published successfully!");
      setTimeout(()=>{
         window.location.reload()
      },1000)
    } catch (error) {
      console.error("Error publishing/updating business:", error);
      let errorMessage = "Failed to publish/update business. Please try again.";
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        errorMessage =
          error.response?.data?.message ||
          `Server error (${error.response?.status || "unknown"}). Please try again.`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!formData) return <div>Loading...</div>;

  const currentBusiness = formData.subcategories?.[0]?.businesses?.[0] || {
    businessName: "",
    description: "",
    location: {},
    contact: {},
    services: [],
    timings: {},
    gallery: [],
    faqs: [],
    cta: { call: "", bookUrl: "", getDirections: "" },
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form
        className="bg-gray-50 rounded-lg shadow-sm p-6 relative"
        data-testid="gallery-faqs-cta-form"
        aria-describedby="form-instructions"
      >
        <p id="form-instructions" className="sr-only">
          Upload images to the gallery, add FAQs, and provide call-to-action details. Use the buttons to navigate or publish the business.
        </p>
        {isReadOnly && (
          <button
            type="button"
            onClick={handleEdit}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-gray-500 p-2 rounded-full"
            aria-label="Edit published business data"
          >
            <Pencil className="h-5 w-5" />
          </button>
        )}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Gallery, FAQs, and Call to Action</h2>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-gray-100 text-gray-800 rounded-md">
            Viewing published data. Click the pencil icon in the top-right to edit.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
            Edit mode: You can modify all fields.
          </div>
        )}

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
                    {!isReadOnly && (
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
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">No images uploaded yet</p>
            )}
            {!isReadOnly && (
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
            )}
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
                  onChange={(e) => !isReadOnly && setCallCountryCode(e.target.value)}
                  className={`w-24 p-2 border border-gray-300 rounded-l-md text-sm ${
                    isReadOnly ? "bg-gray-100" : "focus:ring-2 focus:ring-gray-500"
                  }`}
                  aria-label="Country code"
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
                  id="call-number"
                  placeholder="Phone number"
                  value={currentBusiness.cta.call.replace(`${callCountryCode}-`, "") || ""}
                  onChange={(e) =>
                    !isReadOnly &&
                    updateFormData(
                      "subcategories.0.businesses.0.cta.call",
                      `${callCountryCode}-${e.target.value.replace(/[^0-9]/g, "")}`
                    )
                  }
                  className={`flex-1 p-2 border border-gray-300 rounded-r-md text-sm ${
                    isReadOnly ? "bg-gray-100" : "focus:ring-2 focus:ring-gray-500"
                  }`}
                  aria-label="Call number"
                  readOnly={isReadOnly}
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
                  !isReadOnly && updateFormData("subcategories.0.businesses.0.cta.bookUrl", e.target.value)
                }
                className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                  isReadOnly ? "bg-gray-100" : "focus:ring-2 focus:ring-gray-500"
                }`}
                readOnly={isReadOnly}
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
                  !isReadOnly && updateFormData("subcategories.0.businesses.0.cta.getDirections", e.target.value)
                }
                className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                  isReadOnly ? "bg-gray-100" : "focus:ring-2 focus:ring-gray-500"
                }`}
                readOnly={isReadOnly}
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
                className="mb-4 p-3 border border-gray-200 rounded-md bg-white"
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
                      !isReadOnly &&
                      handleArrayChange("subcategories.0.businesses.0.faqs", index, "question", e.target.value)
                    }
                    className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                      isReadOnly ? "bg-gray-100" : "focus:ring-2 focus:ring-gray-500"
                    }`}
                    readOnly={isReadOnly}
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
                      !isReadOnly &&
                      handleArrayChange("subcategories.0.businesses.0.faqs", index, "answer", e.target.value)
                    }
                    className={`w-full p-2 border border-gray-300 rounded-md text-sm h-24 ${
                      isReadOnly ? "bg-gray-100" : "focus:ring-2 focus:ring-gray-500"
                    }`}
                    readOnly={isReadOnly}
                  />
                </div>
                {!isReadOnly && currentBusiness.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("subcategories.0.businesses.0.faqs", index)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove FAQ ${index + 1}`}
                  >
                    Remove FAQ
                  </button>
                )}
              </div>
            ))}
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={() =>
                addArrayItem("subcategories.0.businesses.0.faqs", {
                  question: "",
                  answer: "",
                })
              }
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 focus:ring-2 focus:ring-green-600"
              aria-label="Add new FAQ"
            >
              + Add FAQ
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-gray-500"
            onClick={() => router.push("/services")}
            type="button"
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            onClick={handlePublishOrUpdate}
            type="button"
            disabled={isPublishing}
            aria-label={isPublishing ? "Publishing/Updating in progress" : isReadOnly ? "Publish business" : "Update business"}
          >
            {isPublishing ? "Processing..." : isReadOnly ? "Publish" : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GalleryFAQsAndCTA;
