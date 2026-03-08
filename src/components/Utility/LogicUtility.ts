import { EffectCallback } from "react";

export const addClassName = (el: HTMLElement, className: string): void => {
    el?.classList.add(className);
};

export const removeClassName = (el: HTMLElement, className: string): void => {
    el?.classList.remove(className);
};

export const setPropertyOnElement = (
    el: HTMLElement,
    property: Record<string, string>,
): void => {
    setProperty(el, property);
};

export const setProperty = (el: HTMLElement, prop: Record<string, string>) => {
    Object.keys(prop).forEach((key: string) => {
        const val = prop[key];
        el.style.setProperty(key, val);
    });
};

export const dp = (callback: EffectCallback, dependencyList: any[]) => {
    // Validate the dependency list
    dependencyList.forEach((item) => {
        if (!item) return;
    });

    return () => {
        callback();
    };
};

export const cl = (...args: any[]) => {
    let res = "";

    args.forEach((item) => {
        if (item && typeof item === "object") {
            const a = Object.keys(item).reduce((acc: string, key: string) => {
                if (item[key]) {
                    acc = acc + ` ${key}`;
                }
                return acc.trim();
            }, "");

            res = res + ` ${a}`;
        } else if (item) {
            res = res + ` ${item}`;
        }
    });

    return res.trim();
};

export const clamp = (
    min: number,
    max: number,
    value?: number,
    factor?: number,
): number => {
    const validValue = (value ?? 0) * (factor ?? 1);
    return Math.min(max, Math.max(min, validValue));
};

export const deepCompare = (json1: any, json2: any) => {
    return JSON.stringify(json1) === JSON.stringify(json2);
};
