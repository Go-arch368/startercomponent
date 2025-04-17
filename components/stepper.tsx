"use client";
import clsx from "clsx";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Briefcase,
  MapPin,
  Phone,
  Wrench,
  CheckCircle,
  BadgeCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const steps = [
  { label: "Welcome", path: "/welcome", icon: Home },
  { label: "Business Info", path: "/business-info", icon: Briefcase },
  { label: "Location", path: "/location", icon: MapPin },
  { label: "Contact & Timings", path: "/contact&timings", icon: Phone },
  { label: "Services", path: "/services", icon: Wrench },
  { label: "Review & Publish", path: "/review&publish", icon: CheckCircle },
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
    const Icon = steps[index].icon;
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;

    const circleClasses = clsx(
      "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium bg-white cursor-pointer",
      {
        "border-green-600 text-green-600": isCompleted,
        "border-blue-600 text-blue-600": isCurrent,
        "border-gray-300 text-gray-400": !isCompleted && !isCurrent,
      }
    );

    return (
      <div
        className={circleClasses}
        role="button"
        tabIndex={0}
        onClick={() => handleClick(index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        aria-label={`Go to ${steps[index].label} step`}
      >
        <Icon size={18} aria-hidden="true" />
      </div>
    );
  };

  const renderLabel = (index: number) => {
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;

    const labelClasses = clsx(
      "mt-1 px-1 text-xs text-center max-w-[100px] truncate flex items-center gap-1",
      {
        "text-green-600 font-medium": isCompleted,
        "text-blue-600 font-medium": isCurrent,
        "text-gray-600": !isCompleted && !isCurrent,
      }
    );

    return (
      <div className={labelClasses}>
        {steps[index].label}
        {isCompleted && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
            <BadgeCheck size={12} strokeWidth={3} />
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile View */}
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
          <AnimatePresence mode="popLayout">
            {visibleSteps.map((step, index) => {
              const globalIndex = steps.findIndex((s) => s.path === step.path);
              const isLastVisible =
                globalIndex ===
                steps.findIndex((s) => s.path === visibleSteps[visibleSteps.length - 1].path);
              return (
                <motion.div
                  key={step.label}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative flex min-w-[60px] flex-1 flex-col items-center"
                  exit={{ opacity: 0, scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  layout
                  transition={{ duration: 0.3 }}
                >
                  {globalIndex < steps.length - 1 && !isLastVisible && (
                    <div
                      className="absolute top-4 z-0 h-0.5 bg-blue-600"
                      style={{
                        left: "calc(50% + 1rem)",
                        right: "calc(-50% + 1rem)",
                      }}
                    />
                  )}
                  {renderCircle(globalIndex)}
                  {renderLabel(globalIndex)}
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

      {/* Desktop View */}
      <div className="hidden w-full flex-col items-center px-4 py-6 sm:flex">
        <p className="mb-4 text-sm font-medium text-gray-700">
          Step {currentStep + 1} of {steps.length}
        </p>

        <div className="relative flex w-full max-w-4xl items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="relative z-10 flex min-w-[60px] flex-1 flex-col items-center"
            >
              {index < steps.length - 1 && (
                <div
                  className="absolute top-4 z-0 h-0.5 bg-blue-600"
                  style={{
                    left: "calc(50% + 1rem)",
                    right: "calc(-50% + 1rem)",
                  }}
                />
              )}
              {renderCircle(index)}
              {renderLabel(index)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
