import React from "react";
import { PiImageSquareLight } from "react-icons/pi";
import "./BlogPostGraphics.css";

const BlogPostGraphics: React.FC<{}> = () => {
  return (
    <div className="blog-graphics flex">
      <div className="blog-graphics__paper">
        <div className="line"></div>
        <div className="line"></div>
        <div className="flex flex-row !w-full px-2 gap-1">
          <PiImageSquareLight className="text-4xl md:text-6xl text-gray-600" />
          <div className="flex flex-col flex-1 justify-between">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className="paper -two"></div>
    </div>
  );
};

export default BlogPostGraphics;
