'use client';

import { useEffect, useState } from 'react';
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Query } from 'appwrite';

export default function HeroEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    ctaText: '',
    ctaLink: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(
          DB_ID,
          COLLECTIONS.HERO,
          [Query.limit(1)]
        );
        
        if (response.documents.length > 0) {
          const doc = response.documents[0];
          setDocId(doc.$id);
          setFormData({
            headline: doc.headline,
            subheadline: doc.subheadline,
            ctaText: doc.ctaText || '',
            ctaLink: doc.ctaLink || '',
          });
        }
      } catch (error) {
        console.error('Error fetching hero data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (docId) {
        await databases.updateDocument(DB_ID, COLLECTIONS.HERO, docId, formData);
      } else {
        // Should not happen if seeded, but handle anyway
        await databases.createDocument(DB_ID, COLLECTIONS.HERO, 'unique()', formData);
      }
      alert('Hero section updated!');
    } catch (error) {
      console.error('Error saving hero data', error);
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subheadline">Subheadline</Label>
              <Textarea
                id="subheadline"
                value={formData.subheadline}
                onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                required
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaLink">CTA Link</Label>
                <Input
                  id="ctaLink"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
