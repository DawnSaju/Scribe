"use client";

import React from 'react';
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 sm:py-16 lg:py-20  dark:bg-neutral-900 text-neutral-800font-pj">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-['DM Sans'] font-bold sm:text-4xl xl:text-5xl">
            Start your journey now!
          </h2>

          <div className="relative inline-flex mt-10 group">
            <div
              className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#1E78FF] to-[#8AB9FF] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"
            ></div>
            <a
              title="Get Started with Scribe"
              className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-[#1E78FF] font-['DM Sans'] rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-700"
              role="button"
              href="/auth"
            >
              Get Started with Scribe
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between mt-16 lg:mt-24">
          <div className="mb-8 lg:mb-0 lg:flex-shrink-0">
            <span className="text-2xl font-bold">Scribe</span>
          </div>

          <ul className="flex flex-row items-center space-y-0 sm:flex-row sm:items-center sm:justify-center gap-y-4 gap-x-6 md:gap-x-8 lg:gap-x-10 mb-8 lg:mb-0 lg:order-2">
            <li>
              <Link href="/" title="About Scribe" className="text-base font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:text-blue-600 dark:hover:text-teal-500 font-pj">
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" title="Scribe Features" className="text-base font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:text-blue-600 dark:hover:text-teal-500 font-pj">
                About
              </Link>
            </li>
            <li>
              <Link href="#faq" title="Scribe Pricing" className="text-base font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:text-blue-600 dark:hover:text-teal-500 font-pj">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="mailto:dawnsajubusiness@gmail.com" title="Contact Scribe" className="text-base font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:text-blue-600 dark:hover:text-teal-500 font-pj">
                Contact
              </Link>
            </li>
          </ul>

          <ul className="flex items-center justify-center space-x-4 lg:order-3">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter"
                className="inline-flex items-center justify-center w-10 h-10 text-neutral-700 dark:text-neutral-300 transition-all duration-200 rounded-full bg-neutral-200 dark:bg-neutral-700/50 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              >
                <Twitter size={20} />
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook"
                className="inline-flex items-center justify-center w-10 h-10 text-neutral-700 dark:text-neutral-300 transition-all duration-200 rounded-full bg-neutral-200 dark:bg-neutral-700/50 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              >
                <Facebook size={20} />
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer" title="Instagram"
                className="inline-flex items-center justify-center w-10 h-10 text-neutral-700 dark:text-neutral-300 transition-all duration-200 rounded-full bg-neutral-200 dark:bg-neutral-700/50 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              >
                <Instagram size={20} />
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer" title="GitHub"
                className="inline-flex items-center justify-center w-10 h-10 text-neutral-700 dark:text-neutral-300 transition-all duration-200 rounded-full bg-neutral-200 dark:bg-neutral-700/50 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              >
                <Github size={20} />
              </a>
            </li>
          </ul>
        </div>

        <hr className="mt-10 mb-10 border-neutral-200 dark:border-neutral-700" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <ul className="flex flex-col items-center space-y-3 sm:space-y-0 sm:flex-row sm:space-x-6 order-2 sm:order-2 mt-4 sm:mt-0">
            <li>
              <Link href="/privacy-policy" title="Privacy Policy" className="text-sm font-normal text-neutral-600 dark:text-neutral-400 transition-all duration-200 hover:text-neutral-900 dark:hover:text-neutral-100 font-pj">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" title="Terms & Conditions" className="text-sm font-normal text-neutral-600 dark:text-neutral-400 transition-all duration-200 hover:text-neutral-900 dark:hover:text-neutral-100 font-pj">
                Terms & Conditions
              </Link>
            </li>
          </ul>
          <p className="order-1 mt-8 text-sm font-normal text-center text-neutral-600 dark:text-neutral-400 sm:mt-0 sm:text-left sm:order-1 font-pj">
            © Copyright {currentYear}, Scribe. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 