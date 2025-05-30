"use client";

import Link from 'next/link';
import { Hammer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Construction() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 text-center">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center rounded-full bg-yellow-500/20 p-6 shadow-lg"
      >
        <Hammer className="h-20 w-20 text-yellow-600 dark:text-yellow-400" />
      </motion.div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Work in Progress</h1>
      <p className="mt-3 text-xl text-muted-foreground">Cooking something!</p>
      <p className="mt-4 text-sm text-muted-foreground max-w-md">This page is under construction at the moment. Will be available soon!</p>
      <Link href="/dashboard" className="mt-10 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        Go to Dashboard
      </Link>
    </div>
  );
}
