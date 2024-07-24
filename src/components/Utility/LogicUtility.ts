import {EffectCallback, DependencyList} from "react";


export const toggleClassName = (
    el: HTMLElement,
    set: boolean,
    className: string
): void => {
    if (set) {
        el?.classList.add(className)
    } else {
        el?.classList.remove(className);
    }
}

export const toggleProperty = (
    el: HTMLElement,
    set: boolean,
    trueProperty: Record<string, string>,
    falseProperty: Record<string, string>
): void => {
    if (set) {
        setProperty(el, trueProperty);
    } else {
        setProperty(el, falseProperty);
    }
}

export const setProperty = (el: HTMLElement, prop: Record<string, string>) => {
    Object.keys(prop).forEach((key: string) => {
        const val = prop[key];
        el.style.setProperty(key, val);
    });
}

export const dp = (callback: EffectCallback, dependencyList: any[]) => {
    // Validate the dependency list
    dependencyList.forEach(item => {
        if (!item) return;
    });

    return () => {
        callback();
    };
};
