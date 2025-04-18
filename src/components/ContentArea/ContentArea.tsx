"use server";
import "./ContentArea.css";

import ContentAreaHandler from "./ContentAreaHandler/ContentAreaHandler";

const ContentArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="content-area mb-[var(--footer-height)] bg-[var(--background-color)] box-shadow-lg">
      <ContentAreaHandler />
      {children}
    </div>
  );
};

export default ContentArea;
