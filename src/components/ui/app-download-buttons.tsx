"use client";
import Image from "next/image";

export const AppDownloadButtons = () => {
  const APKUrl = "https://play.google.com/store/apps";
  const IOSUrl = "https://apps.apple.com/us/app";
  const imageDimensions = { width: 160, height: 47.4 };

  return (
    <div className="flex justify-start items-start gap-2">
      <a href={IOSUrl} target="_blank" rel="noopener noreferrer">
        <Image
          src="/download/apple.svg"
          alt="Download on the App Store"
          width={imageDimensions.width}
          height={imageDimensions.height}
        />
      </a>
      <a href={APKUrl} target="_blank" rel="noopener noreferrer">
        <Image
          src="/download/google.svg"
          alt="Get it on Google Play"
          width={imageDimensions.width}
          height={imageDimensions.height}
        />
      </a>
    </div>
  );
};
