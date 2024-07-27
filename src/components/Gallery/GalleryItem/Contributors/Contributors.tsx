"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import { Octokit } from '@octokit/rest';
import Image from "../../../Image/Image";

const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_TOKEN
});

interface IContributorsProps {
  repoName?: string,
  repoOwner?: string
}

const Contributors: React.FC<IContributorsProps> | null = ({repoName, repoOwner}) => {
  const contributorTooltipRef = useRef<HTMLDivElement>(null);
  const [contributors, setContributors] = useState<any[]>([]);

  useEffect(() => {
    const fetchContributors = async () => {
      let contributors: any[] = [];

      try {
        const { data } = await octokit.repos.listContributors({
          owner: repoOwner!,
          repo: repoName!
        });
        contributors = data.map((item) => {
          return {
            login: item.login,
            avatarUrl: item.avatar_url,
            profileUrl: item.html_url,
            contributions: item.contributions
          }
        })
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }

      if (!contributors.some(item => item.login === "luyangliuable")) {
        contributors.unshift({
          login: "luyangliuable",
          avatarUrl: "https://avatars.githubusercontent.com/u/23611033?v=4",
          profileUrl: "https://github.com/luyangliuable",
          contributions: 0
        })
      }

      setContributors(contributors);
    };
    if (repoOwner && repoName) fetchContributors();
  }, [repoName, repoOwner]);

  if (!repoName || !repoOwner) return null;

  return (
    <div className="position-absolute gallery-item__metadata flex w-full">
      {
        createPortal(
          <div
            ref={contributorTooltipRef}
            className="contributor--tooltip flex justify-center items-center"
            style={{
            }}
          >
            waga
          </div>,
          document.body
        )
      }
      {
        contributors.map(item => (
          <a
            onClick={(e) => e.stopPropagation()}
            onMouseOver={(e) => {
              if (contributorTooltipRef.current) {
                contributorTooltipRef.current.innerHTML = item.login;
                contributorTooltipRef.current.style.opacity = '1';
                contributorTooltipRef.current.style.display = 'block';
              }
            }}
            onMouseMove={(e) => {
              if (contributorTooltipRef.current) {
                contributorTooltipRef.current.style.left = `${e.pageX + 10}px`;
                contributorTooltipRef.current.style.top = `${e.pageY + 10}px`;
              }
            }}
            onMouseOut={() => {
              if (contributorTooltipRef.current) {
                contributorTooltipRef.current.style.opacity = '0';
              }
            }}
            className="contributor position-relative"
            key={item.login}
            href={item.profileUrl}>
            <Image className="user-image" src={item.avatarUrl} alt={item.login} />
          </a>
        ))
      }
    </div>
  )
}

export default Contributors;
