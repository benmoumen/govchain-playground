"use client";

import { cn } from "@/lib/utils";
import { motion, type MotionValue } from "framer-motion";
import { useState } from "react";

type Tab = {
  title: string;
  value: string;
  content?:
    | string
    | React.ReactNode
    | MotionValue<number>
    | MotionValue<string>;
};

export const AnimatedTabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  currentStep,
  onStepChange,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  currentStep: number;
  onStepChange: (step: number) => void;
}) => {
  const [hovering, setHovering] = useState(false);

  const goToStep = (step: number) => {
    if (step >= 0 && step < propTabs.length) {
      onStepChange(step);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => goToStep(idx)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {currentStep === idx && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full ",
                  activeTabClassName
                )}
              />
            )}

            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        currentStep={currentStep}
        tabs={propTabs}
        hovering={hovering}
        className={cn("mt-4", contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
  currentStep,
}: {
  className?: string;
  tabs: Tab[];
  hovering?: boolean;
  currentStep: number;
}) => {
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - Math.abs(currentStep - idx) * 0.1,
            top: hovering ? (idx - currentStep) * -50 : 0,
            zIndex: -Math.abs(currentStep - idx),
            opacity:
              Math.abs(currentStep - idx) < 3
                ? 1 - Math.abs(currentStep - idx) * 0.1
                : 0,
          }}
          animate={{
            y: idx === currentStep ? [0, 40, 0] : 0,
          }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {/* Only render content when this step is active */}
          {idx === currentStep && tab.content}
        </motion.div>
      ))}
    </div>
  );
};
