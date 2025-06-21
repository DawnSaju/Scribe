"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import FAQSection from "@/components/FAQSection";
import Preloader from '@/components/Preloader';
const Content = dynamic(() => import ("@/components/Content"), { ssr: false });
const Hero = dynamic(() => import ("@/components/Hero"), { ssr: false });
const Footer = dynamic(() => import ("@/components/Footer"), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  
  return (
    <main>
      {isLoading && (
        <Preloader finishLoading={() => setIsLoading(false)} timeout={2500} />
      )}

      {!isLoading && (
      <>
      <Hero/>
      <Content/>
      <section id="faq">
        <FAQSection/>
      </section>
      <section id="footer">
        <Footer/>
      </section>
      </>
      )}
    </main>
  )
}
