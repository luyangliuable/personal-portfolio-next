import { IBlogHeading } from "../IBlogContentState"
import { EventEmitter } from 'events';
 
export default interface ItableOfContentsProps {
    headings?: IBlogHeading[];
    emitter?: EventEmitter,
    activeSectionIds?: string[];
    className?: string
}
