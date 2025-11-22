'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

interface ContactProps {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export default function Contact({
  email = "hello@example.com",
  githubUrl,
  linkedinUrl,
  twitterUrl
}: ContactProps) {
  return (
    <section id="contact" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary/5 rounded-3xl p-10 md:p-20 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Let&apos;s Work Together</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          I&apos;m currently available for freelance work and open to new opportunities. 
          If you have a project in mind or just want to say hi, feel free to reach out!
        </p>
        
        <div className="flex flex-col items-center gap-6">
          <Button size="lg" className="text-lg px-8 h-14 rounded-full" asChild>
            <a href={`mailto:${email}`}>
              <Mail className="mr-2 h-5 w-5" /> Say Hello
            </a>
          </Button>

          <div className="flex gap-4 mt-4">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
