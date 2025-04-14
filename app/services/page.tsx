"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

const Services = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-md shadow-md text-center mb-20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Services</h2>
        <p className="mb-6 text-sm sm:text-base text-gray-600">
          This is your services step. List your business services here.
        </p>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700"
            onClick={() => router.push("/contact&timings")}
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto"
            color="primary"
            onClick={() => router.push("/review&publish")}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Services;
