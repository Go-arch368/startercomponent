"use client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-md shadow-md text-center mb-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Welcome!</h1>
        <p className="mb-6 text-gray-600 text-sm sm:text-base">
          We&apos;re excited to help get your business online. Let&rsquo;s get started.
        </p>
        <div className="flex justify-center">
          <Button
            className="w-full sm:w-auto"
            color="primary"
            onClick={() => router.push("/business-info")}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
