"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface PreloaderProps {
  finishLoading?: () => void;
  timeout?: number;
  waitForElement?: string;
  waitTimeout?: number;
}

const Preloader = ({ finishLoading, timeout = 5000, waitForElement, waitTimeout = 15000 }: PreloaderProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!waitForElement) {
        setLoading(false);
        if (finishLoading) finishLoading();
      }
    }, timeout);

    if (waitForElement) {
      const maxWaitTimer = setTimeout(() => {
        console.log(`Preloader: Maximum wait time reached for ${waitForElement}`);
        setLoading(false);
        if (finishLoading) finishLoading();
      }, waitTimeout);

      const checkElementLoaded = () => {
        const element = document.querySelector(waitForElement);
        if (element) {
          const isSplineLoaded = waitForElement.includes('spline') ?
            element.querySelector('canvas') !== null :
            true;

          if (isSplineLoaded) {
            setTimeout(() => {
              setLoading(false);
              if (finishLoading) finishLoading();
            }, 500);

            clearInterval(checkInterval);
            clearTimeout(maxWaitTimer);
            return true;
          }
        }
        return false;
      };

      let checkInterval: NodeJS.Timeout;

      if (!checkElementLoaded()) {
        checkInterval = setInterval(() => {
          checkElementLoaded();
        }, 300);
      }

      return () => {
        if (checkInterval) clearInterval(checkInterval);
        clearTimeout(maxWaitTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [finishLoading, timeout, waitForElement, waitTimeout]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
              className="relative mb-8"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="w-24 h-24 rounded-full border-t-4 border-l-4 border-[#1E78FF] absolute inset-0"
              />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="flex items-center justify-center h-24 w-24"
              >
                <Image 
                  src="/favicon.svg" 
                  alt="Scribe Logo" 
                  width={40} 
                  height={40} 
                  className="z-10"
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-lg font-['DM Sans'] font-medium text-gray-800 dark:text-gray-200 mb-3">
                {waitForElement ? 'Loading 3D Scene...' : 'Loading Scribe'}
              </h3>
              
              <div className="relative w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: waitForElement ? "90%" : "100%" }}
                  transition={{
                    duration: waitForElement ? waitTimeout / 1000 : timeout / 1000,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1E78FF] to-[#8AB9FF]"
                />
              </div>
              
              <div className="flex mt-6 space-x-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-[#1E78FF]"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.2,
                    delay: 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-[#1E78FF]"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.2,
                    delay: 0.4,
                  }}
                  className="w-2 h-2 rounded-full bg-[#1E78FF]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader; 