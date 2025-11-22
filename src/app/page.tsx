'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Navbar from '@/components/Navbar';
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface Project {
  $id: string;
  title: string;
  description: string;
  coverImageId: string;
  liveUrl: string;
  repoUrl: string;
  tags: string[];
}

interface HeroData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
}

interface Skill {
  $id: string;
  name: string;
  category: string;
}

interface Settings {
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  cvFileId: string;
}

export default function Home() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [bio, setBio] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, projectsRes, aboutRes, skillsRes, settingsRes] = await Promise.all([
          databases.listDocuments(DB_ID, COLLECTIONS.HERO, [Query.limit(1)]),
          databases.listDocuments(DB_ID, COLLECTIONS.PROJECTS, [Query.orderDesc('$createdAt')]),
          databases.listDocuments(DB_ID, COLLECTIONS.ABOUT, [Query.limit(1)]),
          databases.listDocuments(DB_ID, COLLECTIONS.SKILLS, [Query.limit(100)]),
          databases.listDocuments(DB_ID, COLLECTIONS.SETTINGS, [Query.limit(1)])
        ]);

        if (heroRes.documents.length > 0) setHeroData(heroRes.documents[0] as any);
        
        setProjects(projectsRes.documents.map(doc => ({
          $id: doc.$id,
          title: doc.title,
          description: doc.description,
          coverImageId: doc.coverImageId,
          liveUrl: doc.liveUrl,
          repoUrl: doc.repoUrl,
          tags: doc.tags,
        })));

        if (aboutRes.documents.length > 0) setBio(aboutRes.documents[0].bio);
        
        setSkills(skillsRes.documents.map(doc => ({
          $id: doc.$id,
          name: doc.name,
          category: doc.category,
        })));

        if (settingsRes.documents.length > 0) setSettings(settingsRes.documents[0] as any);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // Add a small delay to show the loading animation
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                }}
                className="h-16 w-16 rounded-xl border-4 border-primary border-t-transparent"
              />
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground font-medium tracking-widest uppercase text-sm"
              >
                Loading Portfolio
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
        <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
          <motion.div 
            className="absolute -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none"
            animate={{
              x: mousePosition.x - 250,
              y: mousePosition.y - 250,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200,
              mass: 0.5
            }}
          />
        </div>
        
        <Navbar />
        
        <Hero
          headline={heroData?.headline}
          subheadline={heroData?.subheadline}
          ctaText={heroData?.ctaText}
          ctaLink={heroData?.ctaLink}
          cvUrl={settings?.cvFileId ? `/api/files/${settings.cvFileId}` : '#'}
        />
        
        <BentoGrid projects={projects} />
        
        <About bio={bio} skills={skills} />
        
        <Contact 
          email={settings?.contactEmail}
          githubUrl={settings?.githubUrl}
          linkedinUrl={settings?.linkedinUrl}
          twitterUrl={settings?.twitterUrl}
        />
        
        <footer className="py-10 text-center text-muted-foreground text-sm border-t border-border/40 mt-20">
          <p>© {new Date().getFullYear()} Portfolio. Built with Next.js & Appwrite.</p>
          <div className="mt-2">
              <a href="/login" className="text-xs opacity-50 hover:opacity-100 transition-opacity">Admin Login</a>
          </div>
        </footer>
      </main>
    </>
  );
}
