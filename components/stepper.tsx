
"use client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
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
  { label: "Welcome", path: "/welcome", icon: Home, storageKey: "welcomeFormData", apiResponseKey: "welcome" },
  { label: "Business Info", path: "/business-info", icon: Briefcase, storageKey: "businessInfoFormData", apiResponseKey: "business" },
  { label: "Location", path: "/location", icon: MapPin, storageKey: "locationFormData", apiResponseKey: "location" },
  { label: "Contact & Timings", path: "/contact&timings", icon: Phone, storageKey: "contactAndTimingsFormData", apiResponseKey: ["contact", "timings", "cta"] },
  { label: "Services", path: "/services", icon: Wrench, storageKey: "servicesFormData", apiResponseKey: "services" },
  { label: "Review & Publish", path: "/review&publish", icon: CheckCircle, storageKey: "publishFormData", apiResponseKey: "any" },
];

export default function Stepper() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => step.path === pathname) === -1 ? 0 : steps.findIndex((step) => step.path === pathname);
  const router = useRouter();
  const [hasData, setHasData] = useState<{ [key: string]: boolean }>({});
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const checkData = () => {
    if (!isMounted) return;

    const apiResponse = localStorage.getItem("apiResponse");
    let apiData: { [key: string]: any } = {};
    let hasApiResponse = false;

    try {
      if (apiResponse && apiResponse !== '""') {
        apiData = JSON.parse(apiResponse);
        hasApiResponse = true;
      }
    } catch (error) {
      console.error("Error parsing apiResponse:", error);
    }
    setIsPublished(hasApiResponse);

    const dataPresence = steps.reduce((acc, step) => {
      const formDataExists = step.storageKey
        ? !!localStorage.getItem(step.storageKey) && localStorage.getItem(step.storageKey) !== '""'
        : false;

      let apiDataExists = false;
      if (hasApiResponse && step.apiResponseKey) {
        if (step.apiResponseKey === "any") {
          apiDataExists = true;
        } else if (Array.isArray(step.apiResponseKey)) {
          apiDataExists = step.apiResponseKey.every((key) => apiData[key] && Object.keys(apiData[key]).length > 0);
        } else {
          apiDataExists = apiData[step.apiResponseKey] && Object.keys(apiData[step.apiResponseKey]).length > 0;
        }
      }

      acc[step.path] = formDataExists || apiDataExists;
      return acc;
    }, {} as { [key: string]: boolean });

    setHasData(dataPresence);
  };

  useEffect(() => {
    if (!isMounted) return;

    checkData();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.storageArea === localStorage && steps.some(step => step.storageKey === e.key || e.key === "apiResponse")) {
        checkData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="w-full py-6">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-8 w-1/3 rounded bg-gray-200 mb-4"></div>
          <div className="flex justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                <div className="mt-2 h-4 w-16 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
    const isCurrent = index === currentStep;
    const hasStepData = hasData[steps[index].path];

    const circleClasses = clsx(
      "z-10 flex items-center justify-center rounded-full border-2 text-sm font-semibold bg-white cursor-pointer",
      {
        "h-9 w-9": isCurrent, // Larger radius for current step
        "h-8 w-8": !isCurrent, // Default size for other steps
        "border-green-700 text-green-700": hasStepData && isPublished,
        "border-orange-500 text-orange-500": !hasStepData,
        "border-blue-800 text-blue-800": isCurrent && hasStepData && !isPublished, // Darker blue for current step
        "border-gray-300 text-gray-400": !isCurrent && hasStepData && !isPublished,
      }
    );

    return (
      <div
        id={`step-${index}`}
        className={circleClasses}
        role="button"
        tabIndex={0}
        onClick={() => handleClick(index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        aria-label={`Go to ${steps[index].label} step`}
      >
        <Icon size={20} aria-hidden="true" /> {/* Increased icon size */}
      </div>
    );
  };

  const renderLabel = (index: number) => {
    const isCurrent = index === currentStep;
    const hasStepData = hasData[steps[index].path];

    const labelClasses = clsx(
      "mt-1 px-1 text-xs text-center max-w-[100px] flex items-center gap-1 font-semibold",
      {
        "text-green-700": hasStepData && isPublished,
        "text-orange-500": !hasStepData,
        "text-blue-800": isCurrent && hasStepData && !isPublished, // Darker blue for current step
        "text-gray-600": !isCurrent && hasStepData && !isPublished,
      }
    );

    return (
      <label
        htmlFor={`step-${index}`}
        className={labelClasses}
        title={steps[index].label}
      >
        <span className="truncate">{steps[index].label}</span>
        {hasStepData && (
          <span
            className={clsx(
              "ml-1 flex h-6 w-6 items-center justify-center rounded-full text-white flex-shrink-0",
              isPublished ? "bg-green-700" : "bg-blue-800" // Darker blue for checkmark
            )}
            aria-hidden="true"
          >
            <BadgeCheck size={14} strokeWidth={2} />
          </span>
        )}
      </label>
    );
  };

  return (
    <nav aria-label="Stepper navigation">
      {/* Mobile View */}
      <div className="flex w-full flex-col items-center px-2 py-6 sm:hidden">
        <motion.p
          key={currentStep}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-sm font-semibold text-gray-700"
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
                  className="relative flex min-w-[70px] flex-1 flex-col items-center" // Increased min-w for more gap
                  exit={{ opacity: 0, scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  layout
                  transition={{ duration: 0.3 }}
                >
                  {globalIndex < steps.length - 1 && !isLastVisible && (
                    <div
                      className={clsx(
                        "absolute top-4 z-0 h-0.5",
                        hasData[steps[globalIndex].path] && hasData[steps[globalIndex + 1].path]
                          ? "bg-green-700"
                          : !hasData[steps[globalIndex].path] || !hasData[steps[globalIndex + 1].path]
                          ? "bg-orange-500"
                          : "bg-blue-800" // Darker blue for connector
                      )}
                      style={{
                        left: "calc(50% + 1.5rem)", // Increased gap around connector
                        right: "calc(-50% + 1.5rem)",
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
          {steps.map((step, index) => (
            <div
              key={index}
              role="presentation"
              className={clsx(
                "h-2.5 w-2.5 rounded-full",
                hasData[step.path]
                  ? isPublished
                    ? "bg-green-700"
                    : "bg-blue-800" // Darker blue for dots
                  : "bg-orange-500"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden w-full flex-col items-center px-4 py-6 sm:flex">
        <p className="mb-4 text-sm font-semibold text-gray-700">
          Step {currentStep + 1} of {steps.length}
        </p>

        <div className="relative flex w-full max-w-5xl items-center justify-between"> {/* Increased max-w for more gap */}
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="relative z-10 flex min-w-[80px] flex-1 flex-col items-center" // Increased min-w for more gap
            >
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "absolute top-4 z-0 h-0.5",
                    hasData[steps[index].path] && hasData[steps[index + 1].path]
                      ? isPublished
                        ? "bg-green-700"
                        : "bg-blue-800" // Darker blue for connector
                      : "bg-orange-500"
                  )}
                  style={{
                    left: "calc(50% + 1.5rem)", // Increased gap around connector
                    right: "calc(-50% + 1.5rem)",
                  }}
                />
              )}
              {renderCircle(index)}
              {renderLabel(index)}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
