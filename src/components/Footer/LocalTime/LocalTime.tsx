"use client";
import React, { useState, useEffect } from 'react';

const LocalTime = () => {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        const updateTime = () => {
            setTime(new Date());
        };
        const intervalId = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(intervalId);
    }, []);

    if (!time) {
        return <span>Loading...</span>;
    }

    return (
        <span>
            {new Intl.DateTimeFormat("en-AU", {
                timeZone: "Australia/Melbourne",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }).format(time) + " (UTC +10:00)"}
        </span>
    );
}

export default LocalTime;
