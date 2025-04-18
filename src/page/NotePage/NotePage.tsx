"use client";

import React, { useEffect, useState } from "react";
import HeroHeader from "../../components/HeroHeader/HeroHeader";
import Card from "../../components/Card/Card";
import Accordion from "../../components/Accordion/Accordion";
import BlogPostResponse from "../../repositories/Response/BlogPostResponse";
import EmojIcon from "../../components/EmojIcon/EmojIcon";
import SkeletonPage from "../SkeletonPage/SkeletonPage";
import BlogPostGraphics from "../../components/BlogPostGraphics/BlogPostGraphics";
import type { Metadata } from "next";

import "./NotePage.css";

export interface INotesProps extends Metadata {
  content: BlogPostResponse[];
}

const Notes: React.FC<INotesProps> = ({ title, description, content }) => {
  const heroHeaderContent = Object.freeze({
    heading: title,
    description: description,
  });

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  if (!isPageLoaded) {
    return <SkeletonPage />;
  }

  const grouped = content!.reduce(
    (acc: Record<string, any>, item: BlogPostResponse) => {
      const tagName = item.tags.length > 0 ? item.tags[0] : "random";

      if (acc.hasOwnProperty(tagName)) {
        acc[tagName].push(item);
      } else {
        acc[tagName] = [item];
      }

      return acc;
    },
    {},
  );

  const authorImage = "https://llcode.tech/api/image/65817ae96c73ceb16ba51731";

  const emojIconMap: Record<string, string[]> = {
    random: ["😀", "😃", "😄", "😁", "😆"],
    "object-oriented-programming": ["📦"],
    reading: ["📚"],
    "c++": ["⚙️"],
    devops: ["🔧"],
    cybersecurity: ["🔒"],
    "summer-research": ["🔍"],
    "software-testing": ["✅"],
    shell_bash: ["🐚"],
    "data-science": ["📊"],
    "agile-methodology": ["🔄"],
    mlops: ["🤖"],
    "c#": ["⚙️"],
    rust: ["🦀"],
    algorithms: ["🧩"],
    "parallel-computing": ["📈"],
    "research-methods": ["🔍"],
    powershell: ["📘"],
    "code-smells": ["👃"],
    "ui-ux": ["📱"],
    "package-management": ["📦"],
    "computer-networks": ["🌐"],
    "design-process": ["📝"],
    "vim-and-emacs": ["💻"],
    cryptography: ["🔑"],
    javascript: ["⚙️"],
    data: ["📊"],
    django: ["🔨"],
    c: ["🇨️"],
    redux: ["🔄"],
    react: ["⚛️"],
    git: ["🔧"],
    "REST-api": ["📡"],
    sql: ["💻"],
  };

  const getIcon = (category: string) => {
    return (
      <div
        style={{
          width: "40px",
          minWidth: "40px",
          height: "40px",
          minHeight: "40px",
        }}
      >
        <EmojIcon emojis={emojIconMap[category] ?? emojIconMap["random"]} />
      </div>
    );
  };

  return (
    <main>
      <HeroHeader
        heading={heroHeaderContent.heading! as string}
        description={heroHeaderContent.description! as string}
        graphics={<BlogPostGraphics />}
      />
      <Accordion className="notes normalised-width">
        {Object.keys(grouped).map((category) => {
          return (
            <Accordion.Item
              key={category}
              icon={getIcon(category)}
              heading={`${category} (${grouped[category].length})`}
            >
              {grouped[category].map((content: BlogPostResponse) => {
                return (
                  <Card
                    key={content._id.$oid}
                    heading={content.heading}
                    authorImage={authorImage}
                    author={content.author}
                    date_created={content.date_created}
                    date_updated={content.date_last_modified}
                    body={content.body}
                    minuteRead={content.reading_time_minutes}
                    in_progress={content.in_progress}
                    tags={content.tags}
                    image={content.image && content.image.$oid}
                    link={`/digital-chronicles/coding-note/${content._id.$oid}`}
                  />
                );
              })}
            </Accordion.Item>
          );
        })}
      </Accordion>
    </main>
  );
};

export default Notes;
