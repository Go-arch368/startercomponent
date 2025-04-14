"use client";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

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

  const getVisibleSteps = () => {
    if (currentStep <= 1) return steps.slice(0, 3);
    if (currentStep >= steps.length - 1) return steps.slice(-3);
    return steps.slice(currentStep - 1, currentStep + 2);
  };

  const visibleSteps = getVisibleSteps();

  return (
    <>
     
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

        <div className="flex items-center justify-between w-full max-w-xs relative gap-y-6 mb-3">
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
                    "flex-1 min-w-[60px] flex flex-col items-center relative transition-all duration-300",
                    {
                      hidden: !isVisible,
                      flex: isVisible,
                    }
                  )}
                >
                  <motion.div
                    layout
                    className={clsx(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium z-10 bg-white",
                      index <= currentStep
                        ? "border-blue-600 text-blue-600"
                        : "border-gray-300 text-gray-400"
                    )}
                  >
                    {index + 1}
                  </motion.div>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mt-1"
        >
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={clsx(
                "w-2.5 h-2.5 rounded-full transition-colors duration-300",
                index <= currentStep ? "bg-blue-600" : "bg-gray-300"
              )}
              layout
            />
          ))}
        </motion.div>
      </div>

      
      <div className="w-full hidden sm:flex flex-col items-center py-6 px-4">
        <p className="text-sm text-gray-700 font-medium mb-4">
          Step {currentStep + 1} of {steps.length}
        </p>
        <div className="flex items-center justify-between w-full max-w-4xl gap-4">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex-1 min-w-[60px] flex flex-col items-center"
            >
              <div
                className={clsx(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium z-10 bg-white",
                  index <= currentStep
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-300 text-gray-400"
                )}
              >
                {index + 1}
              </div>
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
