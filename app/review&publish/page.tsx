'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';

const ReviewAndPublish = () => {
  const router = useRouter();

  const handleSubmit = () => {
    alert('Business info published successfully!');
    router.push('/welcome'); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md text-center mb-20">
        <h2 className="text-xl font-semibold mb-4">Review & Publish</h2>
        <p className="mb-6 text-gray-600">
          This is your final step. Review your details and publish your business.
        </p>

        <div className="flex justify-between">
          <Button
            className="bg-white text-gray-700"
            onClick={() => router.push('/services')}
          >
            Back
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndPublish;
