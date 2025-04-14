"use client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

export default function BusinessInfo() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center  bg-gray-50 px-4 sm:px-6">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-md shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
          Let&apos;s Get Your Business Online!
        </h2>
        <p className="mb-6 text-sm sm:text-base text-center text-gray-600">
          Enter the basic information about your business below.
        </p>

        <form className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium mb-1">
              Business Name
            </label>
            <input
              id="businessName"
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tagline" className="block text-sm font-medium mb-1">
              Tagline
            </label>
            <input
              id="tagline"
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Subcategory</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <Button
              className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700"
              onClick={() => router.push("/welcome")}
              type="button"
            >
              Back
            </Button>
            <Button
              color="primary"
              className="w-full sm:w-auto"
              onClick={() => router.push("/location")}
              type="button"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
