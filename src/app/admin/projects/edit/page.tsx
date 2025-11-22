'use client';

import { useEffect, useState, Suspense } from 'react';
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import ProjectForm from '@/components/admin/ProjectForm';
import { useSearchParams } from 'next/navigation';

function EditProjectContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const doc = await databases.getDocument(DB_ID, COLLECTIONS.PROJECTS, id);
        setProject(doc as any);
      } catch (error) {
        console.error('Error fetching project', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <ProjectForm initialData={project} isEditing />
    </div>
  );
}

export default function EditProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProjectContent />
    </Suspense>
  );
}
