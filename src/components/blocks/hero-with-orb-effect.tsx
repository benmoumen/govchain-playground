import { Button } from "@/components/ui/button";
import { OrbEffect } from "@/components/ui/orb-effect";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";

interface HeroProps {
  mainHeading: string | React.ReactNode;
  tagline: string;
  buttonLabel?: string;
  buttonHref?: string;
  caption?: string | React.ReactNode;
  containerClassName?: string;
}

export function Hero({
  mainHeading,
  tagline,
  buttonLabel = "Get Started",
  buttonHref = "/",
  caption = "",
  containerClassName,
}: HeroProps) {
  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "fade-bottom overflow-hidden pb-0",
        containerClassName
      )}
    >
      <div
        className={cn(
          "relative bg-background py-16 md:py-28 lg:py-36 px-6",
          "overflow-hidden",
          containerClassName
        )}
      >
        <div className="container mx-auto flex flex-col gap-16 lg:gap-28">
          <div className="flex flex-col items-center space-y-6 lg:space-y-10 text-center">
            <h1
              className="inline-block animate-fade-in bg-gradient-to-b from-foreground 
            via-foreground/90 to-muted-foreground bg-clip-text text-3xl font-bold 
            text-transparent drop-shadow-xl sm:text-4xl lg:text-5xl xl:text-6xl lg:leading-normal xl:leading-normal"
            >
              {mainHeading}
            </h1>

            <p
              className="max-w-lg animate-fade-in font-medium 
            text-muted-foreground opacity-0 [animation-delay:150ms] sm:text-lg lg:text-xl"
            >
              {tagline}
            </p>

            <div
              className="relative z-10 animate-fade-in opacity-0 [animation-delay:300ms]
            flex flex-col items-center space-y-3 w-full"
            >
              <Button
                asChild
                variant="default"
                effect="expandIcon"
                icon={ArrowRightIcon}
                iconPlacement="right"
                className="bg-gradient-to-b from-brand to-brand/80 
                  hover:from-brand/90 hover:to-brand/70 text-white"
              >
                <a href={buttonHref}>{buttonLabel}</a>
              </Button>

              <span className="text-xs text-muted-foreground/80">
                {caption}
              </span>
            </div>

            <OrbEffect />
          </div>
        </div>
      </div>
    </section>
  );
}
