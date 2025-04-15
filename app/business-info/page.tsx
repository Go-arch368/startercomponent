'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
export default function BusinessInformationForm() {
  const router = useRouter()
  const [services, setServices] = useState([{ id: 1 }]);
  const [galleryItems, setGalleryItems] = useState([{ id: 1 }]);
  const [highlights, setHighlights] = useState([{ id: 1 }]);
  const [faqs, setFaqs] = useState([{ id: 1 }]);

  const addService = () => {
    setServices([...services, { id: services.length + 1 }]);
  };

  const addGalleryItem = () => {
    setGalleryItems([...galleryItems, { id: galleryItems.length + 1 }]);
  };

  const addHighlight = () => {
    setHighlights([...highlights, { id: highlights.length + 1 }]);
  };

  const addFaq = () => {
    setFaqs([...faqs, { id: faqs.length + 1 }]);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Information Form</h2>
        
        {/* Category & Subcategory */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Category & Subcategory</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="category" className="block mb-2 font-medium text-gray-700">Category:</label>
              <select id="category" name="category" className="w-full p-2 border border-gray-300 rounded-md text-sm">
                <option value="">Select Category</option>
                <option value="automotive">Automotive</option>
                <option value="health">Health</option>
                <option value="home">Home</option>
                <option value="professional">Professional Services</option>
              </select>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="subcategory" className="block mb-2 font-medium text-gray-700">Subcategory:</label>
              <select id="subcategory" name="subcategory" className="w-full p-2 border border-gray-300 rounded-md text-sm">
                <option value="">Select Subcategory</option>
                <option value="car-repair">Car Repair</option>
                <option value="car-wash">Car Wash</option>
                <option value="auto-parts">Auto Parts</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="businessName" className="block mb-2 font-medium text-gray-700">Business Name:</label>
              <input type="text" id="businessName" name="businessName" placeholder="e.g. Sample Car Repair Business" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="description" className="block mb-2 font-medium text-gray-700">Description:</label>
              <textarea id="description" name="description" placeholder="Top-rated car repair services in your local area."
                className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"></textarea>
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Location</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="address" className="block mb-2 font-medium text-gray-700">Address:</label>
              <input type="text" id="address" name="address" placeholder="123 Main Street" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="city" className="block mb-2 font-medium text-gray-700">City:</label>
              <input type="text" id="city" name="city" placeholder="Sample City" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="state" className="block mb-2 font-medium text-gray-700">State:</label>
              <input type="text" id="state" name="state" placeholder="Sample State" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="postalCode" className="block mb-2 font-medium text-gray-700">Postal Code:</label>
              <input type="text" id="postalCode" name="postalCode" placeholder="000000" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">Phone:</label>
              <input type="tel" id="phone" name="phone" placeholder="+1-000-000-0000" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email:</label>
              <input type="email" id="email" name="email" placeholder="info@samplecarrepair.com" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="website" className="block mb-2 font-medium text-gray-700">Website:</label>
              <input type="url" id="website" name="website" placeholder="https://www.samplecarrepair.com" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
        </div>
        
        {/* Business Hours */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="monday" className="block mb-2 font-medium text-gray-700">Monday:</label>
              <input type="text" id="monday" name="monday" placeholder="09:00 AM - 06:00 PM" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="tuesday" className="block mb-2 font-medium text-gray-700">Tuesday:</label>
              <input type="text" id="tuesday" name="tuesday" placeholder="09:00 AM - 06:00 PM" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="wednesday" className="block mb-2 font-medium text-gray-700">Wednesday:</label>
              <input type="text" id="wednesday" name="wednesday" placeholder="09:00 AM - 06:00 PM" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="thursday" className="block mb-2 font-medium text-gray-700">Thursday:</label>
              <input type="text" id="thursday" name="thursday" placeholder="09:00 AM - 06:00 PM" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="friday" className="block mb-2 font-medium text-gray-700">Friday:</label>
              <input type="text" id="friday" name="friday" placeholder="09:00 AM - 06:00 PM" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="saturday" className="block mb-2 font-medium text-gray-700">Saturday:</label>
              <input type="text" id="saturday" name="saturday" placeholder="10:00 AM - 04:00 PM" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="sunday" className="block mb-2 font-medium text-gray-700">Sunday:</label>
              <input type="text" id="sunday" name="sunday" placeholder="Closed" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
        </div>
        
        {/* Services */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Services</h3>
          <div className="mb-4" id="services-container">
            {services.map((service, index) => (
              <div key={service.id} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <label htmlFor={`serviceName${index + 1}`} className="block mb-2 font-medium text-gray-700">Service Name:</label>
                    <input 
                      type="text" 
                      id={`serviceName${index + 1}`} 
                      name={`serviceName${index + 1}`} 
                      placeholder={`Car Repair Service ${index + 1}`} 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <label htmlFor={`servicePrice${index + 1}`} className="block mb-2 font-medium text-gray-700">Price:</label>
                    <input 
                      type="text" 
                      id={`servicePrice${index + 1}`} 
                      name={`servicePrice${index + 1}`} 
                      placeholder="$50+" 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addService} className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition">
            + Add Another Service
          </button>
        </div>
        
        {/* Gallery */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Gallery</h3>
          <div className="mb-4" id="gallery-container">
            {galleryItems.map((item, index) => (
              <div key={item.id} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                <div className="flex-1 min-w-[250px]">
                  <label htmlFor={`gallery${index + 1}`} className="block mb-2 font-medium text-gray-700">Image URL:</label>
                  <input 
                    type="text" 
                    id={`gallery${index + 1}`} 
                    name={`gallery${index + 1}`} 
                    placeholder={`/images/sample${index + 1}.jpg`} 
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addGalleryItem} className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition">
            + Add Another Image
          </button>
        </div>
        
        {/* Highlights */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Highlights</h3>
          <div className="mb-4" id="highlights-container">
            {highlights.map((highlight, index) => (
              <div key={highlight.id} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                <div className="flex-1 min-w-[250px]">
                  <label htmlFor={`highlight${index + 1}`} className="block mb-2 font-medium text-gray-700">Highlight:</label>
                  <input 
                    type="text" 
                    id={`highlight${index + 1}`} 
                    name={`highlight${index + 1}`} 
                    placeholder={index === 0 ? "Top Rated" : `Highlight ${index + 1}`} 
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addHighlight} className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition">
            + Add Another Highlight
          </button>
        </div>
        
        {/* Call to Action */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Call to Action</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="ctaCall" className="block mb-2 font-medium text-gray-700">Call Number:</label>
              <input type="tel" id="ctaCall" name="ctaCall" placeholder="+1-000-000-0000" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="ctaBookUrl" className="block mb-2 font-medium text-gray-700">Booking URL:</label>
              <input type="text" id="ctaBookUrl" name="ctaBookUrl" placeholder="/book/car_repair_001" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="ctaDirections" className="block mb-2 font-medium text-gray-700">Get Directions URL:</label>
              <input type="url" id="ctaDirections" name="ctaDirections" placeholder="https://maps.google.com" 
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">FAQs</h3>
          <div className="mb-4" id="faqs-container">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                <div className="flex-1 min-w-[250px] mb-3">
                  <label htmlFor={`faqQuestion${index + 1}`} className="block mb-2 font-medium text-gray-700">Question:</label>
                  <input 
                    type="text" 
                    id={`faqQuestion${index + 1}`} 
                    name={`faqQuestion${index + 1}`} 
                    placeholder={index === 0 ? "What services are included?" : `FAQ Question ${index + 1}`} 
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[250px]">
                  <label htmlFor={`faqAnswer${index + 1}`} className="block mb-2 font-medium text-gray-700">Answer:</label>
                  <textarea 
                    id={`faqAnswer${index + 1}`} 
                    name={`faqAnswer${index + 1}`} 
                    placeholder={index === 0 ? "We offer a wide range of services including consultations and repairs." : `FAQ Answer ${index + 1}`}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addFaq} className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition">
            + Add Another FAQ
          </button>
        </div>
        
        <button type="submit" className="bg-blue-500 text-white px-5 py-2.5 rounded-md text-base hover:bg-blue-600 transition mt-6">
          Submit
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700"
            onClick={() => router.push("/welcome")}
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto"
            color="primary"
            onClick={() => router.push("/location")}
          >
            Next
          </Button>
        </div>
    </div>
  );
}