"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const steps = [
  { label: "Welcome", path: "/welcome" },
  { label: "Business Info", path: "/business-info" },
  { label: "Location", path: "/location" },
  { label: "Contact & Timings", path: "/contact&timings" },
  { label: "Services", path: "/services" },
  { label: "Review & Publish", path: "/review&publish" },
];

export default function Stepper() {
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => step.path === pathname);
  const router = useRouter();

  const getVisibleSteps = () => {
    if (currentStep <= 1) return steps.slice(0, 3);
    if (currentStep >= steps.length - 1) return steps.slice(-3);
    return steps.slice(currentStep - 1, currentStep + 2);
  };

  const visibleSteps = getVisibleSteps();

  const handleClick = (index: number) => {
    router.push(steps[index].path);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      handleClick(index);
    }
  };

  const renderCircle = (index: number) => {
    if (index < currentStep) {
      return (
        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 bg-green-100 text-sm font-bold text-green-600">
          <Check size={18} />
        </div>
      );
    }

    const isCurrent = index === currentStep;
    const circleClasses = clsx(
      "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium bg-white cursor-pointer",
      isCurrent ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-400"
    );

    return (
      <div
        className={circleClasses}
        role="button"
        tabIndex={0}
        onClick={() => handleClick(index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
      >
        {index + 1}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Stepper */}
      <div className="flex w-full flex-col items-center px-2 py-6 sm:hidden">
        <motion.p
          key={currentStep}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-sm font-medium text-gray-700"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          Step {currentStep + 1} of {steps.length}
        </motion.p>

        <div className="relative mb-3 flex w-full max-w-xs items-center justify-between">
          <div className="absolute top-4 left-0 right-0 z-0 h-0.5 bg-blue-600" />

          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => {
              const isVisible = visibleSteps.includes(step);
              return (
                <motion.div
                  key={step.label}
                  animate={{ opacity: 1, scale: 1 }}
                  className={clsx(
                    "relative flex min-w-[60px] flex-1 flex-col items-center",
                    { hidden: !isVisible }
                  )}
                  exit={{ opacity: 0, scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  layout
                  transition={{ duration: 0.3 }}
                >
                  {renderCircle(index)}
                  <div
                    className={clsx(
                      "mt-1 px-1 text-[11px] text-center whitespace-nowrap",
                      index === currentStep
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    )}
                  >
                    {step.label}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-1 flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={clsx(
                "h-2.5 w-2.5 rounded-full",
                index <= currentStep ? "bg-green-600" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden w-full flex-col items-center px-4 py-6 sm:flex">
        <p className="mb-4 text-sm font-medium text-gray-700">
          Step {currentStep + 1} of {steps.length}
        </p>

        <div className="relative flex w-full max-w-4xl items-center justify-between">
          <div className="absolute top-4 left-0 right-0 z-0 h-0.5 bg-blue-600" />

          {steps.map((step, index) => (
            <div
              key={step.label}
              className="relative z-10 flex min-w-[60px] flex-1 flex-col items-center"
            >
              {renderCircle(index)}
              <div
                className={clsx(
                  "mt-1 px-1 text-[11px] text-center whitespace-nowrap",
                  index === currentStep
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
                )}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
