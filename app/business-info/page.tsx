"use client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

export default function BusinessInfo() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Let&apos;s Get Your Business Online!
        </h2>
        <p className="mb-6">
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
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="tagline" className="block text-sm font-medium mb-1">
              Tagline
            </label>
            <input
              id="tagline"
              type="text"
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select id="category" className="w-full border px-3 py-2 rounded-md">
              <option>Subcategory</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="w-full border px-3 py-2 rounded-md"
              rows={4}
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button
              className="border-1 bg-white text-gray-700"
              onClick={() => router.push("/welcome")}
              type="button"
            >
              Back
            </Button>
            <Button
              color="primary"
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