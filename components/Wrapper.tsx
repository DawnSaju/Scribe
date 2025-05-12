"use client";

import { useState, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";

const Wrapper = () => {
    const [isVisible, setIsVisisble] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        setHasMounted(true);
    })

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setIsVisisble(entry.isIntersecting)
            },
            {
                threshold: 0.5,
                rootMargin: "200px 0px"
            }
        );

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div>
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
                    <>
                        <Spline 
                            scene="https://draft.spline.design/Kn42jKCP6w2FAfR3/scene.splinecode"
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default Wrapper;