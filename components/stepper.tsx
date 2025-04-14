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
  const currentStep = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="flex items-center justify-between w-full max-w-5xl px-6 relative">
        {steps.map((step, index) => (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {/* Left line */}
            {index !== 0 && (
              <div
                className={clsx(
                  'absolute left-0 top-1/3 w-1/2 h-0.5 z-0 translate-y-[-50%]',
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                )}
              />
            )}

            {/* Circle */}
            <div
              className={clsx(
                'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium z-10 bg-white',
                index <= currentStep
                  ? 'border-blue-600 text-blue-600'
                  : 'border-gray-300 text-gray-400'
              )}
            >
              {index + 1}
            </div>

            {/* Right line */}
            {index !== steps.length - 1 && (
              <div
                className={clsx(
                  'absolute right-0 top-1/3 w-1/2 h-0.5 z-0 translate-y-[-50%]',
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                )}
              />
            )}

            {/* Label */}
            <div
              className={clsx(
                'mt-2 text-[11px] text-center whitespace-nowrap',
                index === currentStep
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-400'
              )}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
