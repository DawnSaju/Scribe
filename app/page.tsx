"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import FAQSection from "@/components/FAQSection";
import Preloader from '@/components/Preloader';
import { ProductDemo } from '@/components/ui/ProductDemo';
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
      <section id="product_demo" className="mb-10">
        <div className="relative">
          <ProductDemo
            className="dark:hidden block"
            animations="from-center"
            videoSrc="https://www.youtube.com/watch?v=eQKLLXpCy2s"
            thumbnailSrc="./Scribe_thumbnail.png"
            thumbnailAlt="Product Demo"
          />
          <ProductDemo
            className="hidden dark:block"
            animations="from-center"
            videoSrc="https://www.youtube.com/watch?v=eQKLLXpCy2s"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Product Demo"
          />
        </div>
      </section>
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
