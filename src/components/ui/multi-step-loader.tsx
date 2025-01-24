"use client";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string | React.ReactNode;
  description?: string | React.ReactNode;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0); // Minimum opacity is 0, keep it 0.2 if you're sane.

        return (
          <motion.div
            key={index}
            className={cn("text-left flex gap-2 mb-4")}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value && (
                <CheckIcon className="text-black dark:text-white" />
              )}
              {index <= value && (
                <CheckFilled
                  className={cn(
                    "text-black dark:text-white",
                    value === index &&
                      "text-black dark:text-lime-500 opacity-100"
                  )}
                />
              )}
            </div>
            <div
              className={cn(
                "text-black dark:text-white",
                value === index && "text-black dark:text-lime-500 opacity-100"
              )}
            >
              {loadingState.text}
              {loadingState.description && (
                <div className="text-xs text-muted-foreground">
                  {loadingState.description}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  embed,
  loadingStates,
  currentState = 0,
  loading,
  successMessage,
  onClose,
}: {
  embed?: boolean;
  loadingStates: LoadingState[];
  currentState: number;
  loading?: boolean;
  successMessage?: string | React.ReactNode;
  onClose?: () => void;
}) => {
  const [bufferedState, setBufferedState] = useState(currentState);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (loading) {
      interval = setInterval(() => {
        setBufferedState((prev) => {
          if (prev < currentState) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 1500); // Adjust the delay as needed
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [currentState, loading]);

  const allStepsDone = bufferedState >= loadingStates.length - 1;

  function handleClose(): void {
    console.log("Closing loader...");
    if (onClose) onClose();
    loading = false;
    currentState = 0;
  }

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className={cn(
            "w-full h-full backdrop-blur-2xl",
            embed ? "" : "fixed inset-0 z-[100]"
          )}
        >
          {!embed && (
            <button
              className="sticky top-4 h-8 w-8 z-[110] right-0 ml-auto bg-black dark:bg-white rounded-full flex items-center justify-center"
              onClick={handleClose}
            >
              <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
            </button>
          )}
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-96 w-auto relative flex flex-col items-center justify-center">
              <LoaderCore value={bufferedState} loadingStates={loadingStates} />

              {successMessage && allStepsDone && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2 }}
                  className="z-[100] flex flex-col items-start max-w-md"
                >
                  {successMessage}
                </motion.div>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
