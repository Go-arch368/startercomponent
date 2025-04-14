"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

const Location = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 ">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md text-center mb-20">
        <h2 className="text-xl font-semibold mb-4">Location Details</h2>
        <p className="mb-6 text-gray-600">
          This is your location step. Add your business location here.
        </p>

        <div className="flex justify-between">
          <Button
            className="bg-white text-gray-700 border-1"
            onClick={() => router.push("/business-info")}
          >
            Back
          </Button>
          <Button
            color="primary"
            onClick={() => router.push("/contact&timings")}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Location;
