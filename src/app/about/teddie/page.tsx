"use client";

import {useRef, RefObject, useEffect} from 'react';
import "./Teddie.css";
import Image from "next/image";
import TeddieImage from "./teddie.png";
import { useScrollPosition } from '../../../hooks';

const Teddie = () => {

  const imageStackRef: RefObject<HTMLDivElement> = useRef(null);

  const {scrollY} = useScrollPosition();

  useEffect(() => {
    imageStackRef.current?.childNodes.forEach((item, index) => {
      if (item instanceof HTMLElement) {
        /* const rotationAngle = index * 5 * Math.random(); */
        const rotationAngle = index * 3;
        item.style.transform = `rotate(${rotationAngle}deg)`;
        item.style.bottom = `${5 + index*.2}%`;
        item.style.right = `${10 + index*.2}%`;
      };
    });
  }, [])

  useEffect(() => {
    imageStackRef.current?.childNodes.forEach((item, index) => {
      if (item instanceof HTMLElement) {
        const speed = .1;

        let maxY, maxX;
        if (index === 1) {
          maxY = 60;
          maxX = 20;
        } else if (index === 2) {
          maxY = 75;
          maxX = 50;
        } else if (index === 3) {
          maxY = 105;
          maxX = 20;
        } else {
          maxY = 105;
          maxX = 55;
        }

        const s = Math.max((scrollY ?? 0) - 250, 0)*speed;
        const rotationAngle = Math.max(index * 3 - (s*.5), 0);
        item.style.transform = `rotate(${rotationAngle}deg)`;

        const offset = Math.min(s * index, maxX);
        item.style.right = `${10 + index*.2 + offset}%`;

        const offsetY = Math.min(s * index, maxY);
        item.style.bottom = `${10 + index*.2 - offsetY}%`;

      };
    });
  }, [scrollY]);

  return (
    <main>
      <div className="teddie--hero flex justify-start items-start flex-col p-24">
        <div className="image-stack" ref={imageStackRef}>
          <div className="image"></div>
          <div className="image-2"></div>
          <div className="image-2"></div>
          <div className="image-2"></div>
        </div>
        <div className="secondary-text">Exploring the Life of</div>
        <div className="main-text">Teddie the Dog</div>
      </div>
    </main>
  );
}

export default Teddie;
