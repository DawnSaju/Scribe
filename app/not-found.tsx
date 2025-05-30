"use client";

import Link from 'next/link';
import { Frown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex items-center justify-center rounded-full bg-primary/10 p-4">
        <motion.div
          initial={{ rotate: 0, scale: 1 }}
          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        >
          <Frown className="h-16 w-16 text-primary" />
        </motion.div>
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">404</h1>
      <p className="mt-2 text-xl text-muted-foreground">Page Not Found</p>
      <p className="mt-4 text-sm text-muted-foreground max-w-md">Sorry, the page you&apos;re looking for doesn't exist or been changed. Please check the URL or return to the dashboard.</p>
      <Link href="/dashboard" className="mt-8 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        Go to Dashboard
      </Link>
    </div>
  );
} 
