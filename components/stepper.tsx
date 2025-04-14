"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";  // Import the router for navigation
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

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
  const router = useRouter();  // Initialize the router

  const getVisibleSteps = () => {
    if (currentStep <= 1) return steps.slice(0, 3);
    if (currentStep >= steps.length - 1) return steps.slice(-3);
    return steps.slice(currentStep - 1, currentStep + 2);
  };

  const visibleSteps = getVisibleSteps();

  const renderCircle = (index: number) => {
    const handleClick = () => {
      // Navigate to the corresponding path of the clicked step
      router.push(steps[index].path);
    };

    if (index < currentStep) {
      return (
        <div className="w-8 h-8 rounded-full border-2 border-green-600 bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold z-10">
          <Check size={18} />
        </div>
      );
    }
    if (index === currentStep) {
      return (
        <div
          className="w-8 h-8 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center text-sm font-medium z-10 bg-white cursor-pointer"
          onClick={handleClick}  // On click, navigate to the step's path
        >
          {index + 1}
        </div>
      );
    }
    return (
      <div
        className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center text-sm font-medium z-10 bg-white cursor-pointer"
        onClick={handleClick}  // On click, navigate to the step's path
      >
        {index + 1}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Stepper */}
      <div className="w-full flex flex-col items-center py-6 px-2 sm:hidden">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-700 font-medium mb-2"
        >
          Step {currentStep + 1} of {steps.length}
        </motion.p>

        <div className="relative w-full max-w-xs flex items-center justify-between mb-3">
          {/* Line Background - Changed to Blue */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-blue-600 z-0" />

          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => {
              const isVisible = visibleSteps.includes(step);
              return (
                <motion.div
                  key={step.label}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={clsx(
                    "flex-1 min-w-[60px] flex flex-col items-center relative",
                    { hidden: !isVisible }
                  )}
                >
                  {renderCircle(index)}

                  <div
                    className={clsx(
                      "mt-1 text-[11px] text-center whitespace-nowrap px-1",
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

        {/* Dot indicators */}
        <div className="flex gap-2 mt-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={clsx(
                "w-2.5 h-2.5 rounded-full",
                index <= currentStep ? "bg-green-600" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="w-full hidden sm:flex flex-col items-center py-6 px-4">
        <p className="text-sm text-gray-700 font-medium mb-4">
          Step {currentStep + 1} of {steps.length}
        </p>

        <div className="relative w-full max-w-4xl flex items-center justify-between">
         
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-blue-600 z-0" />

          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex-1 min-w-[60px] flex flex-col items-center relative z-10"
            >
              {renderCircle(index)}
              <div
                className={clsx(
                  "mt-1 text-[11px] text-center whitespace-nowrap px-1",
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
