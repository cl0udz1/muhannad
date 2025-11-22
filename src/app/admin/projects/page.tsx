'use client';

import { useEffect, useState } from 'react';
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
  $id: string;
  title: string;
  description: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.PROJECTS,
        [Query.orderDesc('$createdAt')]
      );
      setProjects(response.documents.map(doc => ({
        $id: doc.$id,
        title: doc.title,
        description: doc.description,
      })));
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await databases.deleteDocument(DB_ID, COLLECTIONS.PROJECTS, id);
      setProjects(projects.filter(p => p.$id !== id));
    } catch (error) {
      console.error('Error deleting project', error);
      alert('Failed to delete project');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects found.</p>
        ) : (
          projects.map((project) => (
            <Card key={project.$id}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-muted-foreground line-clamp-1">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/projects/edit?id=${project.$id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(project.$id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
