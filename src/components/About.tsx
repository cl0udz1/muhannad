'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Skill {
  $id: string;
  name: string;
  category: string;
}

interface AboutProps {
  bio?: string;
  skills?: Skill[];
}

export default function About({ 
  bio = "I am a passionate developer...", 
  skills = [] 
}: AboutProps) {
  
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="about" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold mb-12">About Me</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">My Journey</h3>
            <div className="prose prose-neutral dark:prose-invert">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {bio}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Skills & Technologies</h3>
            <div className="grid gap-6">
              {Object.entries(skillsByCategory).length > 0 ? (
                Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <Card key={category} className="bg-secondary/20 border-none">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <Badge key={skill.$id} variant="secondary" className="text-sm py-1 px-3">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No skills listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
