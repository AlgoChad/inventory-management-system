import { useState, useEffect, useCallback } from "react";

const useScreenHeight = (percentage: number) => {
    const [height, setHeight] = useState<string>("");

    const updateHeight = useCallback(() => {
        const screenHeight = window.innerHeight;
        const calculatedHeight = screenHeight * percentage;
        setHeight(`${calculatedHeight}px`);
    }, [percentage]);

    useEffect(() => {
        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, [updateHeight]);

    return height;
};

export default useScreenHeight;