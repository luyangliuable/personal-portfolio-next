"use client";

import { useRef, RefObject, useEffect } from 'react';
import "./Teddie.css";
import Image from "next/image";
import TeddieImage from "./teddie.png";
import { useScrollPosition } from '../../../hooks';
import Bento from '../../../components/Bento/Bento';
import LandingPageCard from '../../../components/LandingPageCard/LandingPageCard';

const Teddie = () => {

    const imageStackRef: RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
    }, [])

    return (
        <main>
            <div className="teddie--hero flex justify-start items-start flex-col p-24">
                <div className="secondary-text">Exploring the Life of</div>
                <div className="main-text">Teddie the Dog</div>
            </div>
            <LandingPageCard className="teddie--gallery" blendWithBackground>
                <div className="flex justify-center items-center">
                    <Bento className="image-stack px-5" gap="2rem">
                        <Bento.Item rowSpan={2} colSpan={3}>
                            <div className="image"></div>
                        </Bento.Item>
                        <Bento.Item colSpan={2}>
                            <div className="image"></div>
                        </Bento.Item>
                        <Bento.Item colSpan={1}>
                            <div className="image"></div>
                        </Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                        <Bento.Item colSpan={1}><div className="image"></div></Bento.Item>
                    </Bento>
                </div>
            </LandingPageCard>

        </main>
    );
}

export default Teddie;
