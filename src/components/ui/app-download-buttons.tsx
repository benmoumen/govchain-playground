"use client";
import { useTheme } from "next-themes";
import {
    AppStoreButton,
    ButtonsContainer,
    GooglePlayButton
} from "react-mobile-app-button";
  


export const AppDownloadButtons = () => {
    const APKUrl = "https://play.google.com/store/apps";
    const IOSUrl = "https://apps.apple.com/us/app";
      const { theme: currentTheme } = useTheme();
      const theme = currentTheme as "dark" | "light" | undefined;
  
    return (
      <ButtonsContainer gap={10}>
        <GooglePlayButton
          url={APKUrl}
                theme={theme}
                className={"custom-style"}
                
                title="Download app"
        />
  
        <AppStoreButton
          url={IOSUrl}
          theme={theme}
                className={"custom-style"}
                title="Download on"
        />
      </ButtonsContainer>
    );
  };