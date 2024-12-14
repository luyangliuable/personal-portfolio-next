"use server";

import ContentAreaHandler from "./ContentAreaHandler/ContentAreaHandler";

const ContentArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="mb-[var(--footer-height)] bg-[var(--background-color)] box-shadow-lg">
            <ContentAreaHandler />
            {children}
        </div>
    );
};

export default ContentArea;
