import { JSXElementConstructor } from 'react';

export interface ExperienceSectionItem {
    dateTime: string,
    cardTitle: string,
    objectPosition?: "top" | "bottom" | "center",
    location?: string,
    url: string,
    cardSubtitle: string,
    cardDetailedText: string,
    importance?: number, // from 0 - 1
    display?: "IMAGE" | "NORMAL"
    media: {
        type: "IMAGE" | "VIDEO" | "AUDIO",
        source: {
            url: string
        }
    }
}

export interface IExperienceSectionState<
    P = any,
    W extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>
> {
    render?: () => React.ReactElement<P, W>,
    timeLineLength?: number
}
