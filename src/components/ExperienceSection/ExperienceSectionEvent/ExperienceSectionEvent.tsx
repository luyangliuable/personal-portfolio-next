import React, { RefObject, useRef, useEffect } from "react";
import { cardGradientEffect } from "../../Utility/MouseUtility";
import { ExperienceSectionItem } from "../Interface/IExperienceSectionState";
import "./ExperienceSectionEvent.css";
import Image from "../../Image/Image";
import { cl } from "../../Utility/LogicUtility";

interface ExperienceSectionEventProps {
  timeLineRef: RefObject<HTMLDivElement>;
  item: ExperienceSectionItem;
  index: number;
  alt?: string;
}

const ExperienceSectionEvent: React.FC<ExperienceSectionEventProps> = ({
  item,
  index,
  alt,
}) => {
  const defaultDisplay = item.display === "NORMAL" || !item.display;
  const experienceSectionCardIndexIsEvenNumber = index % 2 === 0;
  const experienceSectionCardClassName = [""];

  experienceSectionCardIndexIsEvenNumber
    ? experienceSectionCardClassName.push("exp-above")
    : experienceSectionCardClassName.push("exp-below");

  const experienceSectionCardTextExperienceBody = (): React.ReactElement => (
    <div className="w-80 min-h-[80px] flex flex-col justify-between">
      <h2 className="text-xl font-bold">{item.cardTitle}</h2>
      <div className="experience-section-card__text-body">
        <div className="experience-section-card__date">
          <i>{item.dateTime}</i>
        </div>
        <div className="experience-section-card__job-title">
          {item.cardSubtitle}
        </div>
      </div>
    </div>
  );

  return (
    <div
      onMouseMove={cardGradientEffect}
      className={cl(
        "card experience-section-card px-2.5 py-3 flex flex-row justify-between items-center",
        {
          "exp-above": experienceSectionCardIndexIsEvenNumber,
          "exp-below": !experienceSectionCardIndexIsEvenNumber,
        },
      )}
    >
      {defaultDisplay && experienceSectionCardTextExperienceBody()}
      <div className="connecting-line"></div>
      <div className="experience-section-card__image-wrapper">
        <Image compression={20} alt={alt} src={item.media.source.url} />
      </div>
    </div>
  );
};

export default React.memo(ExperienceSectionEvent);
