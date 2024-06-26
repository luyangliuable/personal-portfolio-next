"use client";

import React from 'react';
import { IResumePageProps } from "../../interfaces";
import "./ResumePage.css";

const ResumePage: React.FC<IResumePageProps> = (props) => {
    return (
        <main className="resume-page-content position-relative">
            <iframe className="browser" src="https://llcode.tech/api/image/6599eebc58701a6b8fe5908a" title="Resume" />
        </main>
    )
}

export default ResumePage;
