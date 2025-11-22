'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, ExternalLink } from 'lucide-react';

interface Project {
  $id: string;
  title: string;
  description: string;
  coverImageId?: string;
  liveUrl?: string;
  repoUrl?: string;
  tags?: string[];
}

interface BentoGridProps {
  projects: Project[];
}

export default function BentoGrid({ projects = [] }: BentoGridProps) {
  return (
    <section id="projects" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-12"
      >
        Selected Works
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
        {projects.map((project, index) => (
          <motion.div
            key={project.$id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group ${
              index === 0 || index === 3 ? 'md:col-span-2' : ''
            }`}
          >
            <Card className="h-full flex flex-col overflow-hidden border-none bg-secondary/30 hover:bg-secondary/50 transition-colors duration-300">
              <div className="relative h-48 md:h-64 w-full overflow-hidden">
                 {/* Placeholder for image if no ID, or fetch from Appwrite Storage */}
                 <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
                    {project.coverImageId ? (
                        // In a real app, use a helper to get the view URL
                        <span className="text-sm">Image: {project.coverImageId}</span>
                    ) : (
                        <span className="text-sm">No Image</span>
                    )}
                 </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <div className="flex gap-2">
                        {project.repoUrl && (
                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github size={20} />
                            </a>
                        )}
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                </div>
              </CardHeader>
              <CardContent className="grow">
                <p className="text-muted-foreground line-clamp-3">
                  {project.description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {project.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-background/50 rounded-md text-xs font-medium border border-border/50">
                    {tag}
                  </span>
                ))}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
