'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  cvUrl?: string;
}

export default function Hero({
  headline = "Building Digital Experiences",
  subheadline = "I'm a Full Stack Developer specializing in building exceptional digital experiences.",
  ctaText = "View Projects",
  ctaLink = "#projects",
  cvUrl = "#"
}: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-start px-6 md:px-20 max-w-7xl mx-auto pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 leading-tight">
          {headline.split(' ').map((word, i) => (
            <span key={i} className="inline-block mr-4">
              {word}
            </span>
          ))}
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
      >
        {subheadline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button size="lg" className="text-lg px-8" asChild>
          <a href={ctaLink}>
            {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
        <Button size="lg" variant="outline" className="text-lg px-8" asChild>
          <a href={cvUrl} target="_blank" rel="noopener noreferrer">
            Download CV <Download className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </motion.div>
    </section>
  );
}
