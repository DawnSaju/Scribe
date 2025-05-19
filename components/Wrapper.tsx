"use client";

import { useState, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";
import Preloader from "@/components/Preloader";

const Wrapper = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [isSplineReady, setIsSplineReady] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const splineRef = useRef<unknown>(null);
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: "400px 0px",
            }
        );

        const node = ref.current;

        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) {
                observer.unobserve(node);
            }
        };
    }, []);

    const handleSplineLoad = (splineApp: unknown) => {
        console.log("Spline scene loaded");
        splineRef.current = splineApp;

        setIsSplineReady(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 200);
    };

    return (
        <div>
            {isVisible && isLoading && (
                <Preloader
                    timeout={30000}
                    waitForElement="#spline-scene canvas"
                    waitTimeout={30000}
                />
            )}

            <div
                ref={ref}
                style={{
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                    clipPath: "inset(5px 0px 70px 0px)",
                    position: "relative",
                    zIndex: 1,
                }}
                className="hidden flex justify-center lg:block"
            >
                {hasMounted && isVisible && (
                    <div 
                        id="spline-scene"
                        className={`transition-opacity duration-700 ease-in-out ${!isSplineReady || isLoading ? 'opacity-0' : 'opacity-100'}`}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <Spline
                            scene="https://draft.spline.design/HPNsbwfWtwJQ8pxP/scene.splinecode"
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                            onLoad={handleSplineLoad}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wrapper;