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

interface Step {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  storageKey: string;
  apiResponseKey: string | string[];
}

const steps: Step[] = [
  {
    label: "Welcome",
    path: "/welcome",
    icon: Home,
    storageKey: "welcomeFormData",
    apiResponseKey: "welcome",
  },
  {
    label: "Business Info",
    path: "/business-info",
    icon: Briefcase,
    storageKey: "businessInfoFormData",
    apiResponseKey: "business",
  },
  {
    label: "Location",
    path: "/location",
    icon: MapPin,
    storageKey: "locationFormData",
    apiResponseKey: "location",
  },
  {
    label: "Contact & Timings",
    path: "/contact&timings",
    icon: Phone,
    storageKey: "contactAndTimingsFormData",
    apiResponseKey: ["contact", "timings", "cta"],
  },
  {
    label: "Services",
    path: "/services",
    icon: Wrench,
    storageKey: "servicesFormData",
    apiResponseKey: "services",
  },
  {
    label: "Review & Publish",
    path: "/review&publish",
    icon: CheckCircle,
    storageKey: "publishFormData",
    apiResponseKey: "any",
  },
];

export default function Stepper() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [hasData, setHasData] = useState<Record<string, boolean>>({});
  const [isPublished, setIsPublished] = useState(false);

  const currentStep =
    steps.findIndex((step) => step.path === pathname) === -1
      ? 0
      : steps.findIndex((step) => step.path === pathname);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const checkData = React.useCallback(() => {
    if (!isMounted) return;

    const apiResponse = localStorage.getItem("apiResponse");
    let apiData: Record<string, any> = {};
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
        ? !!localStorage.getItem(step.storageKey) &&
          localStorage.getItem(step.storageKey) !== '""'
        : false;

      let apiDataExists = false;
      if (hasApiResponse && step.apiResponseKey) {
        if (step.apiResponseKey === "any") {
          apiDataExists = true;
        } else if (Array.isArray(step.apiResponseKey)) {
          apiDataExists = step.apiResponseKey.every(
            (key) => apiData[key] && Object.keys(apiData[key]).length > 0
          );
        } else {
          apiDataExists =
            apiData[step.apiResponseKey] &&
            Object.keys(apiData[step.apiResponseKey]).length > 0;
        }
      }

      acc[step.path] = formDataExists || apiDataExists;
      return acc;
    }, {} as Record<string, boolean>);

    setHasData(dataPresence);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    checkData();
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.storageArea === localStorage &&
        (steps.some((step) => step.storageKey === e.key) || e.key === "apiResponse")
      ) {
        checkData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isMounted, checkData]);

  const getVisibleSteps = () => {
    if (currentStep <= 1) return steps.slice(0, 3);
    if (currentStep >= steps.length - 1) return steps.slice(-3);
    return steps.slice(currentStep - 1, currentStep + 2);
  };

  const handleStepNavigation = (index: number) => {
    router.push(steps[index].path);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      handleStepNavigation(index);
    }
  };

  // Animation variants for steps
  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.3,
      },
    },
    exit: { opacity: 0, scale: 0.8, y: -10 },
  };

  const renderStepCircle = (index: number) => {
    const Icon = steps[index].icon;
    const isCurrent = index === currentStep;
    const hasStepData = hasData[steps[index].path] || isPublished;
    const isBeforeCurrent = index < currentStep;

    const circleClasses = clsx(
      "z-10 flex items-center justify-center rounded-full border-2 text-sm font-semibold bg-white cursor-pointer relative outline-none",
      {
        "h-10 w-10 border-green-600 text-green-600":
          (hasStepData || isBeforeCurrent) || isCurrent,
        "h-8 w-8": !isCurrent,
        "border-gray-300 text-gray-400":
          !hasStepData && !isBeforeCurrent && !isCurrent,
      }
    );

    return (
      <motion.div
        id={`step-${index}`}
        className={circleClasses}
        role="button"
        tabIndex={0}
        onClick={() => handleStepNavigation(index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        aria-label={`Go to ${steps[index].label} step`}
        whileTap={{ scale: 0.9 }}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AnimatePresence>
          {isCurrent && (
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-orange-600 pointer-events-none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icon size={isCurrent ? 22 : 20} aria-hidden="true" />
        </motion.div>
      </motion.div>
    );
  };

  const renderStepLabel = (index: number) => {
    const isCurrent = index === currentStep;
    const hasStepData = hasData[steps[index].path] || isPublished;
    const isBeforeCurrent = index < currentStep;

    const labelClasses = clsx(
      "mt-3 px-1 text-xs text-center max-w-[100px] flex items-center gap-1 font-semibold transition-colors duration-300",
      {
        "text-green-600 text-sm": isCurrent,
        "text-green-600": (hasStepData || isBeforeCurrent) && !isCurrent,
        "text-gray-600": !hasStepData && !isBeforeCurrent && !isCurrent,
      }
    );

    return (
      <motion.label
        htmlFor={`step-${index}`}
        className={labelClasses}
        title={steps[index].label}
        initial={{ opacity: 0.7, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <span className="truncate">{steps[index].label}</span>
        <AnimatePresence>
          {(hasStepData || isBeforeCurrent) && (
            <motion.span
              className="ml-1 flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0 bg-green-600 text-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              aria-hidden="true"
            >
              <BadgeCheck size={12} strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.label>
    );
  };

  const getConnectorClass = (index: number) => {
    const hasStepData = hasData[steps[index].path] || isPublished;
    const hasNextStepData = hasData[steps[index + 1].path] || isPublished;
    const isBeforeCurrent = index < currentStep;

    return clsx(
      "absolute top-5 z-0 h-[2px] w-full transition-colors duration-300 ease-in-out",
      {
        "bg-green-600": hasStepData || hasNextStepData || isBeforeCurrent,
        "bg-gray-300": !hasStepData && !hasNextStepData && !isBeforeCurrent,
      }
    );
  };

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

  const visibleSteps = getVisibleSteps();

  return (
    <nav aria-label="Stepper navigation">
      {/* Mobile View */}
      <div className="flex w-full flex-col items-center px-2 py-6 sm:hidden">
        <motion.p
          key={currentStep}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-sm font-semibold text-gray-700"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
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
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layoutId={`mobile-step-${globalIndex}`}
                  className="relative flex min-w-[80px] flex-1 flex-col items-center"
                  layout
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  {globalIndex < steps.length - 1 && !isLastVisible && (
                    <motion.div
                      className={getConnectorClass(globalIndex)}
                      style={{ left: "50%", right: "-50%" }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                  {renderStepCircle(globalIndex)}
                  {renderStepLabel(globalIndex)}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div className="mt-1 flex gap-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              role="presentation"
              className={clsx(
                "h-2.5 w-2.5 rounded-full transition-colors duration-300",
                {
                  "bg-green-600":
                    hasData[steps[index].path] || index < currentStep || isPublished,
                  "bg-gray-300":
                    !hasData[steps[index].path] &&
                    index >= currentStep &&
                    !isPublished,
                }
              )}
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      </div>

      {/* Desktop View */}
      <div className="hidden w-full flex-col items-center px-4 py-6 sm:flex">
        <motion.p
          className="mb-4 text-sm font-semibold text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          Step {currentStep + 1} of {steps.length}
        </motion.p>

        <motion.div
          className="relative flex w-full max-w-5xl items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.label}
              className="relative z-10 flex min-w-[90px] flex-1 flex-col items-center"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
            >
              {index < steps.length - 1 && (
                <motion.div
                  className={getConnectorClass(index)}
                  style={{ left: "50%", right: "-50%" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
              {renderStepCircle(index)}
              {renderStepLabel(index)}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </nav>
  );
}
