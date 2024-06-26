import React, { RefObject, useRef, useEffect } from 'react';
import { cardGradientEffect } from "../../Utility/MouseUtility";
import { ExperienceSectionItem } from "../Interface/IExperienceSectionState";
import "./ExperienceSectionEvent.css";
import Image from "../../Image/Image";

interface ExperienceSectionEventProps {
  timeLineRef: RefObject<HTMLDivElement>,
  item: ExperienceSectionItem,
  index: number,
  alt?: string
}

const ExperienceSectionEvent: React.FC<ExperienceSectionEventProps> = ({ item, index, alt, timeLineRef }) => {
  const defaultDisplay = item.display === "NORMAL" || !item.display;
  const experienceSectionCardIndexIsEvenNumber = index % 2 === 0;
  const experienceSectionCardClassName = ["card experience-section-card flex flex-row justify-between items-center"];

  experienceSectionCardIndexIsEvenNumber ? experienceSectionCardClassName.push("exp-above")
                                       : experienceSectionCardClassName.push("exp-below");

  const imageWrapperClassName = ["experience-section-card__image-wrapper"];

  imageWrapperClassName.push("experience-section-card__image-wrapper")

  const experienceSectionCardTextExperienceBody = (): React.ReactElement => (
    <div className="w-80">
      <h2>{item.cardTitle}</h2>
      <div className="experience-section-card__text-body">
        <div className="experience-section-card__date"><i>{item.dateTime}</i></div>
        <div className="experience-section-card__job-title">{item.cardSubtitle}</div>
      </div>
    </div>
  )

  return (
    <div onMouseMove={cardGradientEffect}
         className={experienceSectionCardClassName.join(" ")}>
      {defaultDisplay && experienceSectionCardTextExperienceBody()}
      <div className="connecting-line"></div>
      <div className={imageWrapperClassName.join(" ")}>
        <Image compression={20} alt={alt} src={item.media.source.url} />
      </div>
    </div>
  );
}

export default React.memo(ExperienceSectionEvent);
