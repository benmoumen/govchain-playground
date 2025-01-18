"use client";

import { cn } from "@/lib/utils";
import { motion, type MotionValue } from "framer-motion";

type Tab = {
  title: string;
  value: string;
  content?:
    | string
    | React.ReactNode
    | MotionValue<number>
    | MotionValue<string>;
  icon?: React.ReactNode;
};

export const AnimatedTabs = ({
  tabs: propTabs,

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
  const goToStep = (step: number) => {
    if (step >= 0 && step < propTabs.length) {
      onStepChange(step);
    }
  };

  return (
    <>
      <div className="flex w-fit rounded-full bg-muted p-1">
        {propTabs.map((tab, idx) => (
          <TabBar
            key={tab.title}
            text={tab.title}
            selected={currentStep === idx}
            setSelected={() => goToStep(idx)}
            icon={tab.icon}
          />
        ))}
      </div>
      <FadeInDiv
        currentStep={currentStep}
        tabs={propTabs}
        className={cn("mt-4", contentClassName)}
      />
    </>
  );
};

interface TabBarProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  icon?: React.ReactNode;
}

export function TabBar({ text, selected, setSelected, icon }: TabBarProps) {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        "relative w-fit px-4 py-2 text-sm font-semibold capitalize",
        "text-foreground transition-colors",
        icon && "flex items-center justify-center gap-2.5"
      )}
    >
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: "spring", duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-full bg-background shadow-sm"
        />
      )}
    </button>
  );
}

export const FadeInDiv = ({
  className,
  tabs,
  currentStep,
}: {
  className?: string;
  tabs: Tab[];
  currentStep: number;
}) => {
  return (
    <div className="w-full h-full relative">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          initial={{
            opacity: 0,
            x: idx > currentStep ? 100 : -100,
            scale: 0.8,
          }}
          animate={{
            opacity: idx === currentStep ? 1 : 0,
            x: idx === currentStep ? 0 : idx > currentStep ? 100 : -100,
            scale: idx === currentStep ? 1 : 0.8,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "w-full h-full absolute top-0 left-0",
            idx === currentStep ? "pointer-events-auto" : "pointer-events-none",
            className
          )}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
