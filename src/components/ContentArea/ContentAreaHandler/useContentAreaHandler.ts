"use client";

import { useEffect } from "react";

const useContentAreaHandler = () => {
  useEffect(() => {
    const footerElement = document.querySelector(
      "footer",
    ) as HTMLBaseElement | null;
    if (footerElement) {
      const footerHeight = footerElement.offsetHeight;
      document.documentElement.style.setProperty(
        "--footer-height",
        `${footerHeight}px`,
      );
    }
  }, []);
};

export default useContentAreaHandler;
