"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string | React.ReactNode;
};

const faqData: FAQItem[] = [
  {
    question: "How does Scribe help me learn vocabulary from TV shows?",
    answer:
      "Scribe provides a floating toolbar while you watch. When you encounter an unfamiliar word, simply highlight it. Scribe automatically captures the word, fetches its definition, context (like the scene or quote), and pronunciation, adding it to your personal vocabulary journal.",
  },
  {
    question: "Which streaming platforms does Scribe work with?",
    answer:
      "Currently, Scribe focuses on providing a seamless experience within its own interface or potentially through browser extensions for popular platforms in the future. Stay tuned for updates on specific integrations!",
  },
  {
    question: "What is the 'Personal Vocabulary Journal'?",
    answer: (
      <div>
        It&apos;s your dedicated space where all the words you&apos;ve captured are stored. Each word entry includes:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Definition and pronunciation audio</li>
          <li>The original context from the show</li>
          <li>Synonyms and usage examples</li>
        </ul>
        You can review and manage your learned words here.
      </div>
    ),
  },
  {
    question: "How does the spaced repetition feature work?",
    answer:
      "Scribe uses a proven learning technique called spaced repetition. Based on your saved words, it sends you daily reminders and short quizzes at increasing intervals. This helps reinforce your memory and ensures long-term retention of new vocabulary.",
  },
  {
    question: "Is Scribe suitable for all English levels?",
    answer:
      "Yes! Scribe is designed for learners of various levels, from intermediate ESL students to native speakers looking to expand their vocabulary. The focus is on learning words you personally find unfamiliar while enjoying your favorite shows.",
  },
];

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void }> = ({
  item,
  isOpen,
  onClick,
}) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 px-6 text-left text-lg font-medium text-neutral-800 dark:text-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
      >
        <span>{item.question}</span>
        {isOpen ? <Minus className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-neutral-500" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto", marginTop: '0px', marginBottom: '16px' },
              collapsed: { opacity: 0, height: 0, marginTop: '0px', marginBottom: '0px' },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-5xl font-medium font-['DM Sans'] text-center mb-12 text-neutral-900 dark:text-neutral-50">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto bg-neutral-50 dark:bg-neutral-800/30 rounded-lg shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-700/50">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 