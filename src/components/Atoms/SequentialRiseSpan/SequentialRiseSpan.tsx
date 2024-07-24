import React, { ReactElement, useState, useRef, useEffect, RefObject, JSXElementConstructor } from "react";
import "./SequentialRiseSpan.css";

export interface ISequentialRiseSpanProps {
  children: string;
  className?: string;
  elementType?: keyof JSX.IntrinsicElements;
  wordsPerAnimation?: number,
  animationDelayMiliseconds?: number,
  numberOfLettersPerLine?: number,
  calculationAdjustment?: number,
  minNumberOfLettersPerLine?: number,
  maxNumberOfLettersPerLine?: number
}


const SequentialRiseSpan: React.FC<ISequentialRiseSpanProps> = ({
  calculationAdjustment,
  children,
  elementType,
  className,
  numberOfLettersPerLine,
  minNumberOfLettersPerLine,
  maxNumberOfLettersPerLine
}) => {
  const spanItemRef = useRef<HTMLDivElement>(null);
  const [wrappedLines, setWrappedLines] = useState<ReactElement<{ key: number; className: string; }>[]>([]);
  const [lineRefs, setLineRefs] = useState<RefObject<any>[]>([]);
  const [measuredLettersPerLine, setMeasuredLettersPerLine] = useState<number>(numberOfLettersPerLine ?? 0);

  const calculateLettersPerLine = () => {
    const targetElement = spanItemRef.current;

    if (numberOfLettersPerLine || measuredLettersPerLine > 0 || targetElement === undefined) return;

    const createTempSpan = () => {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.textContent = children;
      return tempSpan;
    }

    const getCharWidth = () => {
      const tempSpan = createTempSpan();
      document.body.appendChild(tempSpan);
      const charWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);
      return charWidth/(children.length);
    }

    const charWidth = getCharWidth();

    if (targetElement) {
      const elementStyle = window.getComputedStyle(targetElement);
      const elementPadding = parseFloat(elementStyle.paddingLeft) + parseFloat(elementStyle.paddingRight);
      const targetElementWidth = targetElement.offsetWidth - elementPadding;
      calculationAdjustment = calculationAdjustment ?? 1.12;
      setMeasuredLettersPerLine(Math.floor(targetElementWidth * calculationAdjustment / charWidth));
    }
  }

  const slideUp = (target: Element, observer: any): void => {
    target.classList.add('slide-up');
    observer.unobserve(target);
  }

  useEffect(() => {
    const addIntersectionObserver = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) slideUp(entry.target, observer)
        });
      }, { threshold: [0.1, 0.5, 1] });

      lineRefs.forEach(ref => {
        if (ref.current) observer.observe(ref.current);
      });

      return observer;
    }

    const observer = addIntersectionObserver();
    return () => observer.disconnect();
  }, [lineRefs]);


  useEffect(() => {
    if (!numberOfLettersPerLine) {
      if (measuredLettersPerLine === 0) calculateLettersPerLine();
      window.addEventListener('resize', calculateLettersPerLine);
    }

    return () => {
      window.removeEventListener('resize', calculateLettersPerLine);
    }
  }, [numberOfLettersPerLine]);

  useEffect(() => {
    let currentLine = '';
    let lines: string[] = [];

    if (!numberOfLettersPerLine && !measuredLettersPerLine) return;

    const determineFinalLineNumberofLettersPerLine = () => {
      if (numberOfLettersPerLine) return numberOfLettersPerLine;
      const max = maxNumberOfLettersPerLine ?? Number.MAX_SAFE_INTEGER;
      const min = Math.max(measuredLettersPerLine, (minNumberOfLettersPerLine ?? 0));
      return Math.min(min, max);
    }

    const finalNumberOfLettersPerLine = determineFinalLineNumberofLettersPerLine();

    String(children).split(' ').forEach((word) => {
      if ((currentLine + (currentLine ? ' ' : '') + word).length > finalNumberOfLettersPerLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += (currentLine.length > 0 ? ' ' : '') + word;
      }
    });
    lines.push(currentLine);

    setLineRefs(lines.map(() => React.createRef<any>()));

    const linesElements = lines.map((line, index) => {
      const LineElement = React.createElement(
        elementType || 'p',
        {
          key: index,
          className: ["visible-hidden", className].join(" ")
        },
        line
      );
      return LineElement;
    });

    setWrappedLines(linesElements);
  }, [measuredLettersPerLine, numberOfLettersPerLine]);

  return (
    <div className="sequential-rise-span" ref={spanItemRef}>
      {
        measuredLettersPerLine !== 0 &&
        wrappedLines.map((line, index) => {
          const lineElement = React.cloneElement(line as React.ReactElement, {
            style: { animationDelay: `${index * 100}ms` },
            ref: lineRefs[index]
          })
          return (<div key={index} className="w-full break-words">{lineElement}</div>)
        })
      }
    </div>
  );
}
export default React.memo(SequentialRiseSpan);
