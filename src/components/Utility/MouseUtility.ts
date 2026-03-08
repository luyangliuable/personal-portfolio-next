const cardGradientEffect = (
    e: any,
    inverse?: boolean,
    scale?: number,
    offsetX?: number,
    offsetY?: number,
): void => {
    const rect = e.target.getBoundingClientRect();
    let x, y;

    scale = scale ?? 1;
    offsetX = offsetX ?? 0;
    offsetY = offsetY ?? 0;

    if (inverse) {
        x = -e.clientX + rect.left;
        y = -e.clientY + rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }

    x = x / scale - offsetX;
    y = y / scale - offsetY;

    e.target.style.setProperty("--mouse-x", `${x}px`);
    e.target.style.setProperty("--mouse-y", `${y}px`);
};

export { cardGradientEffect };
