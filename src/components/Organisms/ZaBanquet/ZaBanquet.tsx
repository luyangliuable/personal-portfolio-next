import React from "react";
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

const generateFlowers = (num: number) => {
  const flowers = [];
  for (let i = 0; i < num; i++) {
    const left = Math.random() * 90; // Adjust range as needed for more spread
    const top = Math.random() * 90;  // Adjust range as needed for more spread
    const scale = 1 + Math.random() * 0.5; // Random scale between 1 and 1.5
    const rotate = Math.random() * 360; // Random rotation between 0 and 360 degrees
    const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];

    flowers.push(
      <div
        className="flower"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
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
  return flowers;
};

const ZaBanquet = () => {
  return (
    <div className="flowers">
      <div className="bunch">
        {generateFlowers(20)}
      </div>
    </div>
  );
};

export default ZaBanquet;
