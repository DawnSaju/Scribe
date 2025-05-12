"use client";

import React, { useState, useEffect, useRef } from 'react';

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-gray-700';
  const hoverTextColor = 'text-black';
  const textSizeClass = 'text-sm';

  return (
    <a href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 596 595" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_g_87_1674)">
        <path d="M45 412.312H250.129C263.279 412.312 272.921 401.792 272.921 389.519C272.921 376.37 262.405 365.85 250.129 365.85H213.315C124.77 365.85 52.8884 293.965 52.8884 205.425C52.8884 116.885 124.77 45 213.315 45H396.526C396.526 45 417 46.3676 417 114.5C417 182.632 396.526 182.632 396.526 182.632H213.315C201.039 182.632 190.517 193.152 190.517 205.425C190.517 218.575 201.039 228.218 213.315 228.218H250.129C338.674 228.218 410.556 300.978 410.556 389.519C410.556 478.06 338.674 549.944 250.129 549.944H45V412.312Z" fill="url(#paint0_linear_87_1674)"/>
        </g>
        <path d="M267.862 297.18L249.099 367.072L241.195 387.585L300.816 335.994L314.402 320.376L326.595 332.728L305.365 342.817L240.351 400.057L271.194 388.614L270.89 393.103L346.038 378.646L393.465 314.703C393.465 314.703 391.977 307.086 369.12 281.984C346.263 256.883 338.848 255.379 338.848 255.379L267.862 297.18Z" fill="white"/>
        <path d="M326.595 332.728L314.402 320.376L301 334.5L242.827 385.691L241.593 389.115L263.329 371.543L267.481 376.836L305.864 342.851L326.595 332.728Z" fill="white"/>
        <g filter="url(#filter1_g_87_1674)">
        <path d="M506.622 112.467C509.504 112.435 512.043 112.819 514.681 114.041C523.777 118.251 546.771 145.136 549.983 155.006C551.451 159.514 550.673 163.142 548.392 167.237C546.503 170.633 543.866 173.532 541.071 176.203C534.506 182.479 527.192 188.079 520.327 194.035L477.352 231.673L438.729 265.752C431.455 272.168 424.262 279.1 416.504 284.915C413.379 287.257 410.143 288.382 406.46 289.457C404.54 289.166 402.565 288.637 400.846 287.721C393.645 283.886 364.885 251.436 362.693 243.228C361.913 240.309 362.556 238.037 364.119 235.496C370.476 225.157 392.631 208.139 402.702 199.356L451.288 156.857C459.63 149.536 468.03 142.263 476.277 134.834C482.019 129.661 487.364 124.208 493.51 119.478C497.661 116.283 501.458 113.692 506.622 112.467Z" fill="url(#paint1_linear_87_1674)"/>
        <path d="M506.622 112.467C509.504 112.435 512.043 112.819 514.681 114.041C523.777 118.251 546.771 145.136 549.983 155.006C551.451 159.514 550.673 163.142 548.392 167.237C546.503 170.633 543.866 173.532 541.071 176.203C534.506 182.479 527.192 188.079 520.327 194.035L477.352 231.673L438.729 265.752C431.455 272.168 424.262 279.1 416.504 284.915C413.379 287.257 410.143 288.382 406.46 289.457C404.54 289.166 402.565 288.637 400.846 287.721C393.645 283.886 364.885 251.436 362.693 243.228C361.913 240.309 362.556 238.037 364.119 235.496C370.476 225.157 392.631 208.139 402.702 199.356L451.288 156.857C459.63 149.536 468.03 142.263 476.277 134.834C482.019 129.661 487.364 124.208 493.51 119.478C497.661 116.283 501.458 113.692 506.622 112.467Z" stroke="white"/>
        </g>
        <g filter="url(#filter2_g_87_1674)">
        <path d="M347.725 263.979C347.956 263.984 348.189 263.96 348.417 263.994C354.231 264.878 380.328 294.993 385.433 300.86C376.263 313 368.48 321.704 360.616 335.189C353.685 347.075 348.517 359.875 341.72 371.745L341.398 372.299C329.805 375.222 317.666 376.176 305.945 378.577C281.435 383.599 261.203 392.236 238.66 402.819C245.244 396.314 252.662 390.374 259.638 384.278L299.405 349.538C301.578 347.553 303.901 345.782 306.231 343.989C310.009 344.221 313.937 344.672 317.567 343.332C322.188 341.627 324.429 337.278 326.464 333.123C326.391 332.92 326.315 332.717 326.245 332.513C325.336 329.882 324.519 327.744 322.602 325.64C319.969 322.753 316.52 320.903 312.558 320.884C307.766 320.861 304.553 323.454 301.377 326.66C300.257 330.738 300.274 334.224 300.495 338.395C289.903 347.743 279.223 356.988 268.451 366.129C259.29 374.039 250.3 382.118 240.94 389.795C244.332 384.204 248.006 378.815 251.183 373.09C263.633 350.362 272.551 325.871 277.629 300.459C287.13 295.701 297.451 292.529 307.027 287.846C321.26 280.885 334.171 272.083 347.725 263.979Z" fill="url(#paint2_linear_87_1674)"/>
        <path d="M347.725 263.979C347.956 263.984 348.189 263.96 348.417 263.994C354.231 264.878 380.328 294.993 385.433 300.86C376.263 313 368.48 321.704 360.616 335.189C353.685 347.075 348.517 359.875 341.72 371.745L341.398 372.299C329.805 375.222 317.666 376.176 305.945 378.577C281.435 383.599 261.203 392.236 238.66 402.819C245.244 396.314 252.662 390.374 259.638 384.278L299.405 349.538C301.578 347.553 303.901 345.782 306.231 343.989C310.009 344.221 313.937 344.672 317.567 343.332C322.188 341.627 324.429 337.278 326.464 333.123C326.391 332.92 326.315 332.717 326.245 332.513C325.336 329.882 324.519 327.744 322.602 325.64C319.969 322.753 316.52 320.903 312.558 320.884C307.766 320.861 304.553 323.454 301.377 326.66C300.257 330.738 300.274 334.224 300.495 338.395C289.903 347.743 279.223 356.988 268.451 366.129C259.29 374.039 250.3 382.118 240.94 389.795C244.332 384.204 248.006 378.815 251.183 373.09C263.633 350.362 272.551 325.871 277.629 300.459C287.13 295.701 297.451 292.529 307.027 287.846C321.26 280.885 334.171 272.083 347.725 263.979Z" stroke="white"/>
        </g>
        <defs>
        <filter id="filter0_g_87_1674" x="0" y="0" width="462" height="594.944" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        </filter>
        <filter id="filter1_g_87_1674" x="317.361" y="67.4651" width="278.37" height="266.992" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        </filter>
        <filter id="filter2_g_87_1674" x="193.66" y="218.975" width="236.773" height="228.844" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        </filter>
        <linearGradient id="paint0_linear_87_1674" x1="45" y1="297.472" x2="410.556" y2="297.472" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E78FF"/>
        <stop offset="1" stopColor="#8AB9FF"/>
        </linearGradient>
        <linearGradient id="paint1_linear_87_1674" x1="357.729" y1="246.976" x2="551.413" y2="260.088" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8AB9FF"/>
        <stop offset="1" stopColor="#1E78FF"/>
        </linearGradient>
        <linearGradient id="paint2_linear_87_1674" x1="237.565" y1="371.574" x2="385.678" y2="381.601" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E78FF"/>
        <stop offset="1" stopColor="#8AB9FF"/>
        </linearGradient>
        </defs>
      </svg>

    </div>
  );

  const navLinksData = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#footer' },
  ];


  const signupButtonElement = (
    <div className="relative group w-full sm:w-auto">
      <div className="absolute inset-0 -m-2 rounded-full
                    hidden sm:block
                    bg-gray-300
                    opacity-40 filter blur-lg pointer-events-none
                    transition-all duration-300 ease-out
                    group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
      <button className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-500 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 transition-all duration-200 w-full sm:w-auto">
        Login
      </button>
    </div>
  );

  return (
    <header className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-20
                      flex flex-col items-center
                      pl-6 pr-6 py-3 backdrop-blur-sm
                      ${headerShapeClass}
                      border border-gray-300 bg-white/70
                      w-[calc(100%-2rem)] sm:w-auto
                      transition-[border-radius] duration-0 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
          {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {signupButtonElement}
        </div>

        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-700 hover:text-black transition-colors w-full text-center">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {signupButtonElement}
        </div>
      </div>
    </header>
  );
}