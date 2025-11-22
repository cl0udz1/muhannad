'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
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

export default function Home() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Hero Data
        const heroResponse = await databases.listDocuments(
          DB_ID,
          COLLECTIONS.HERO,
          [Query.limit(1)]
        );
        if (heroResponse.documents.length > 0) {
          // @ts-ignore
          setHeroData(heroResponse.documents[0]);
        }

        // Fetch Projects
        const projectsResponse = await databases.listDocuments(
          DB_ID,
          COLLECTIONS.PROJECTS,
          [Query.orderDesc('$createdAt')]
        );
        
        const mappedProjects = projectsResponse.documents.map(doc => ({
          $id: doc.$id,
          title: doc.title,
          description: doc.description,
          coverImageId: doc.coverImageId,
          liveUrl: doc.liveUrl,
          repoUrl: doc.repoUrl,
          tags: doc.tags,
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>
      
      <Navbar />
      
      <Hero
        headline={heroData?.headline}
        subheadline={heroData?.subheadline}
        ctaText={heroData?.ctaText}
        ctaLink={heroData?.ctaLink}
      />
      <BentoGrid projects={projects} />
      
      <footer className="py-10 text-center text-muted-foreground text-sm border-t border-border/40 mt-20">
        <p>© {new Date().getFullYear()} Portfolio. Built with Next.js & Appwrite.</p>
      </footer>
    </main>
  );
}
