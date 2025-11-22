'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/admin/ImageUploader';

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImageId: '',
    liveUrl: '',
    repoUrl: '',
    tags: '', // Comma separated string for input
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        coverImageId: initialData.coverImageId || '',
        liveUrl: initialData.liveUrl || '',
        repoUrl: initialData.repoUrl || '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const dataToSave = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
    };

    try {
      if (isEditing && initialData) {
        await databases.updateDocument(DB_ID, COLLECTIONS.PROJECTS, initialData.$id, dataToSave);
      } else {
        await databases.createDocument(DB_ID, COLLECTIONS.PROJECTS, ID.unique(), dataToSave);
      }
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error saving project', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Project' : 'New Project'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="h-32"
            />
          </div>

          <ImageUploader 
            value={formData.coverImageId} 
            onChange={(id) => setFormData({ ...formData, coverImageId: id })} 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repoUrl">Repo URL</Label>
              <Input
                id="repoUrl"
                value={formData.repoUrl}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="React, Next.js, Tailwind"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
