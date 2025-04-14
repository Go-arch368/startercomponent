'use client';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const steps = [
  { label: 'Welcome', path: '/welcome' },
  { label: 'Business Info', path: '/business-info' },
  { label: 'Location', path: '/location' },
  { label: 'Contact & Timings', path: '/contact&timings' },
  { label: 'Services', path: '/services' },
  { label: 'Review & Publish', path: '/review&publish' },
];

export default function Stepper() {
  const pathname = usePathname();
  const currentStep = steps.findIndex(step => step.path === pathname);

  return (
    <div className="flex justify-between items-center px-2 py-3 bg-white shadow-sm rounded-md text-xs">
      {steps.map((step, index) => (
        <div key={step.label} className="flex-1 flex flex-col items-center">
          <div
            className={clsx(
              'w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center text-[10px] md:text-xs',
              index <= currentStep
                ? 'border-blue-600 text-blue-600'
                : 'border-gray-300 text-gray-400'
            )}
          >
            {index + 1}
          </div>
          <span
            className={clsx(
              'text-[10px] mt-0.5 text-center leading-tight',
              index === currentStep
                ? 'text-blue-600 font-medium'
                : 'text-gray-400'
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
