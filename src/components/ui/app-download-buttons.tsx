"use client";
import {
  AppStoreButton,
  ButtonsContainer,
  GooglePlayButton,
} from "react-mobile-app-button";

export const AppDownloadButtons = () => {
  const APKUrl = "https://play.google.com/store/apps";
  const IOSUrl = "https://apps.apple.com/us/app";

  return (
    <ButtonsContainer gap={10}>
      <AppStoreButton
        url={IOSUrl}
        theme="dark"
        className="app-download-button"
        title="Download on the"
      />
      <GooglePlayButton
        url={APKUrl}
        theme="dark"
        className="app-download-button"
        title="Get it on"
      />
    </ButtonsContainer>
  );
};
