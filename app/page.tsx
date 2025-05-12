"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { use, useEffect, useState } from "react";
import FAQSection from "@/components/FAQSection";
import { TestimonialsColumn } from "@/components/ui/Testimonials";
import { motion } from "framer-motion";
const Content = dynamic(() => import ("@/components/Content"), { ssr: false });
const Hero = dynamic(() => import ("@/components/Hero"), { ssr: false });
const Footer = dynamic(() => import ("@/components/Footer"), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const testimonials = [
      {
          text: "Scribe's floating toolbar is genius! I can grab new English words from shows without pausing. My vocabulary journal fills up so quickly, and it's actually fun.",
          image: "https://randomuser.me/api/portraits/women/12.jpg",
          name: "Chloe Moreau",
          role: "University Student",
      },
      {
          text: "Finally, a way to learn vocabulary that doesn't feel like homework. Scribe integrates perfectly with my binge-watching habits. The daily quizzes keep the words fresh in my mind.",
          image: "https://randomuser.me/api/portraits/men/25.jpg",
          name: "Raj Patel",
          role: "Software Engineer",
      },
      {
          text: "I love how Scribe captures the context of the word right from the scene. It makes remembering definitions so much easier! The spaced repetition system is really effective.",
          image: "https://randomuser.me/api/portraits/women/36.jpg",
          name: "Sofia Garcia",
          role: "ESL Learner",
      },
      {
          text: "The word cards in the Scribe journal are incredibly detailed – definition, pronunciation, synonyms, examples... everything I need. It's my go-to resource now.",
          image: "https://randomuser.me/api/portraits/men/48.jpg",
          name: "Daniel Evans",
          role: "Language Tutor",
      },
      {
          text: "Keeping up my learning streak in Scribe is surprisingly motivating! The gamification makes vocabulary practice engaging. It turns passive watching into active learning.",
          image: "https://randomuser.me/api/portraits/women/59.jpg",
          name: "Isabelle Dubois",
          role: "Marketing Specialist",
      },
      {
          text: "Scribe's design is so clean and modern. It makes the learning experience feel smooth and encouraging, not overwhelming. Perfect for consistent vocabulary growth.",
          image: "https://randomuser.me/api/portraits/men/61.jpg",
          name: "Liam Chen",
          role: "Graphic Designer",
      },
      {
          text: "The personal vocabulary journal and spaced repetition quizzes are fantastic. Scribe makes reviewing words feel like a game, not a chore. My English is improving daily!",
          image: "https://randomuser.me/api/portraits/men/22.jpg",
          name: "Kenji Tanaka",
          role: "Language Enthusiast",
      },
      {
          text: "I love how intuitive Scribe is. It doesn't interrupt my show, yet I'm constantly learning. The definitions and context provided are super helpful. Highly recommended!",
          image: "https://randomuser.me/api/portraits/women/33.jpg",
          name: "Maria Rodriguez",
          role: "Professional Improving English",
      },
      {
          text: "As a busy professional, Scribe fits perfectly into my routine. Learning new English words while unwinding with my favorite series is incredibly efficient and enjoyable.",
          image: "https://randomuser.me/api/portraits/men/44.jpg",
          name: "David Miller",
          role: "Marketing Executive",
      },
      {
          text: "Scribe's streaks and badge system keeps me engaged daily. It’s turned vocabulary practice into something I genuinely enjoy and look forward to.",
          image: "https://randomuser.me/api/portraits/women/55.jpg",
          name: "Aisha Khan",
          role: "University Student",
      },
      {
          text: "The seamless rollout went beyond expectations. It simplified our workflows and made a noticeable impact on business efficiency.",
          image: "https://randomuser.me/api/portraits/women/6.jpg",
          name: "Aliza Khan",
          role: "Business Analyst",
      },
      {
          text: "With its intuitive design and great user feedback, our operations became more efficient and customer-focused.",
          image: "https://randomuser.me/api/portraits/men/7.jpg",
          name: "Farhan Siddiqui",
          role: "Marketing Director",
      },
      {
          text: "They truly understood our requirements and delivered a solution that improved our operations beyond what we expected.",
          image: "https://randomuser.me/api/portraits/women/8.jpg",
          name: "Sana Sheikh",
          role: "Sales Manager",
      },
      {
          text: "This ERP system significantly boosted our visibility and conversion rates online, resulting in stronger overall performance.",
          image: "https://randomuser.me/api/portraits/men/9.jpg",
          name: "Hassan Ali",
          role: "E-commerce Manager",
      },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  
  return (
    <main>
      <Hero/>
      <Content/>
      <section className="bg-background relative py-16 lg:py-0">
        <div className="container z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto gap-4"
          >
          <h1 className="text-4xl lg:text-6xl font-medium font-['DM Sans'] max-w-xl">
            What our users say
          </h1>
          <h2 className="text-center justify-start text-color-blue-9 opacity-60 text-base lg:text-xl font-normal font-['DM_Sans'] leading-7">
            See what our customers have to say about us.
          </h2>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>
      <section id="faq">
        <FAQSection/>
      </section>
      <section id="footer">
        <Footer/>
      </section>
    </main>
  )
}