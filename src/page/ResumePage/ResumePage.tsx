"use client";

import React from "react";
import { apiImageUrl } from "../../config/api";
import { IResumePageProps } from "../../interfaces";
import "./ResumePage.css";

const resumeImageId = "6599eebc58701a6b8fe5908a";

const ResumePage: React.FC<IResumePageProps> = (props) => {
    return (
        <main className="resume-page-content relative">
            <iframe
                className="browser"
                src={apiImageUrl(resumeImageId)}
                title="Resume"
            />
        </main>
    );
};

export default ResumePage;
