"use client";
import React from "react";
import { motion } from "framer-motion";

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

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full" key={i}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};