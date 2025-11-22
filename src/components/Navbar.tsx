'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4"
    >
      <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-6 py-3 flex items-center gap-6 shadow-lg">
        <Link href="/" className="font-bold text-lg tracking-tight hover:text-primary transition-colors">
          Portfolio.
        </Link>
        
        <div className="h-4 w-px bg-border/50 hidden sm:block" />
        
        <div className="hidden sm:flex items-center gap-4">
          <Link href="#projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Work
          </Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>

        <div className="h-4 w-px bg-border/50 hidden sm:block" />

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github size={16} />
                </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={16} />
                </a>
            </Button>
        </div>
      </div>
    </motion.nav>
  );
}
