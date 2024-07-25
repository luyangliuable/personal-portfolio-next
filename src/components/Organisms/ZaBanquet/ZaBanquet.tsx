import React, { useEffect, useRef, useState } from "react";
import "./ZaBanquet.css";

const colorThemes: Record<string, string>[] = [
  {
    '--color-1': '#ffebcc',
    '--color-2': 'orange',
    '--color-3': '#ff9966',
    '--color-4': '#ff6633'
  },
  {
    '--color-1': '#ffccf2',
    '--color-2': '#ff99e6',
    '--color-3': '#ff66d9',
    '--color-4': '#ff33cc'
  },
  {
    '--color-1': '#d3cce3',
    '--color-2': 'purple',
    '--color-3': '#9379aa',
    '--color-4': '#521c81'
  },
  {
    '--color-1': '#ffcccc',
    '--color-2': '#ff9999',
    '--color-3': '#ff6666',
    '--color-4': '#ff3333'
  },
  {
    '--color-1': '#ffffff',
    '--color-2': 'white',
    '--color-3': 'orange',
    '--color-4': '#d9d9d9'
  }
];

const ZaBanquet = () => {
  const flowersContainerRef = useRef<HTMLDivElement>(null);
  const [flowers, setFlowers] = useState<JSX.Element[]>([]);
  const [flowersRef, setFlowersRef] = useState<React.RefObject<HTMLDivElement>[]>([]);

  const generateFlowers = (num: number) => {
    const flowers = [];
    const refs = [];

    for (let i = 0; i < num; i++) {
      const flowerRef = React.createRef<HTMLDivElement>();
      refs.push(flowerRef);

      const left = Math.random() * 90; // Adjust range as needed for more spread
      const top = Math.random() * 90;  // Adjust range as needed for more spread
      const scale = 1 + Math.random() * 0.5; // Random scale between 1 and 1.5
      const rotate = Math.random() * 360; // Random rotation between 0 and 360 degrees
      const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];

      flowers.push(
        <div
          ref={flowerRef}
          className="flower"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${i * 50}ms`,
            '--rotation': `${rotate}deg`,
            transform: `scale(${scale}) rotate(var(--rotation))`,
            '--color-1': theme['--color-1'],
            '--color-2': theme['--color-2'],
            '--color-3': theme['--color-3'],
            '--color-4': theme['--color-4']
          } as React.CSSProperties}
          key={i}
        >
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
        </div>
      );
    }
    setFlowers(flowers);
    setFlowersRef(refs);
  };

  useEffect(() => {
    generateFlowers(20);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log(entry.target);
          entry.target.classList.add("show");
        }
      });
    }, { threshold: [0.1, 0.5, 1] });

    flowersRef.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      flowersRef.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [flowersRef]);

  return (
    <div className="flowers" ref={flowersContainerRef}>
      <div className="bunch">
        {flowers}
      </div>
    </div>
  );
};

export default React.memo(ZaBanquet);
