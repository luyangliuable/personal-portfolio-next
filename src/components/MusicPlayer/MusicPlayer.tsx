"use client";

import { createPortal } from 'react-dom';
import "./MusicPlayer.css"
import MusicPlayerItem from './MusicPlayerItem/MusicPlayerItem';
import React, { ReactNode } from 'react';

interface IMusicPlayerProps {
    children?: ReactNode
}

const MusicPlayer: React.FC<IMusicPlayerProps> = ({ children }) => {
    return (
        <>
            {
                createPortal(
                    <div className="music-player box-shadow-large flex flex-col items-center">
                        <div className="music-player--play"></div>
                        <div className="overflow-y-scroll w-full p-4">
                            <MusicPlayerItem
                                imageSrc=""
                                imageSrcAlt=""
                                artistName="Artist ABC"
                                length="03:10"
                                musicTitle="Test Music" />
                            <MusicPlayerItem
                                imageSrc=""
                                imageSrcAlt=""
                                artistName="Artist ABC"
                                length="03:10"
                                musicTitle="Test Music" />
                            <MusicPlayerItem
                                imageSrc=""
                                imageSrcAlt=""
                                artistName="Artist ABC"
                                length="03:10"
                                musicTitle="Test Music" />
                            <MusicPlayerItem
                                imageSrc=""
                                imageSrcAlt=""
                                artistName="Artist ABC"
                                length="03:10"
                                musicTitle="Test Music" />
                            <MusicPlayerItem
                                imageSrc=""
                                imageSrcAlt=""
                                artistName="Artist ABC"
                                length="03:10"
                                musicTitle="Test Music" />
                            <MusicPlayerItem
                                imageSrc=""
                                imageSrcAlt=""
                                artistName="Artist ABC"
                                length="03:10"
                                musicTitle="Test Music" />
                            {children}
                        </div>
                    </div>,
                    document.body
                )
            }
        </>
    )
}

export default MusicPlayer;
