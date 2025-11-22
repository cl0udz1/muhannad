'use client';

import { useEffect, useState } from 'react';
import { databases, DB_ID, COLLECTIONS, storage, BUCKET_ID } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, X } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  
  const [formData, setFormData] = useState({
    cvFileId: '',
    linkedinUrl: '',
    githubUrl: '',
    twitterUrl: '',
    contactEmail: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(
          DB_ID,
          COLLECTIONS.SETTINGS,
          [Query.limit(1)]
        );
        
        if (response.documents.length > 0) {
          const doc = response.documents[0];
          setDocId(doc.$id);
          setFormData({
            cvFileId: doc.cvFileId || '',
            linkedinUrl: doc.linkedinUrl || '',
            githubUrl: doc.githubUrl || '',
            twitterUrl: doc.twitterUrl || '',
            contactEmail: doc.contactEmail || '',
          });
        }
      } catch (error) {
        console.error('Error fetching settings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCv(true);
    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      setFormData(prev => ({ ...prev, cvFileId: response.$id }));
    } catch (error) {
      console.error('CV Upload failed', error);
      alert('CV Upload failed');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (docId) {
        await databases.updateDocument(DB_ID, COLLECTIONS.SETTINGS, docId, formData);
      } else {
        await databases.createDocument(DB_ID, COLLECTIONS.SETTINGS, 'unique()', formData);
      }
      alert('Settings updated!');
    } catch (error) {
      console.error('Error saving settings', error);
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
          <CardTitle>Site Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label>CV / Resume (PDF)</Label>
              <div className="flex items-center gap-4">
                {formData.cvFileId ? (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">CV Uploaded</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => setFormData(prev => ({ ...prev, cvFileId: '' }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleCvUpload} 
                      disabled={uploadingCv}
                    />
                    {uploadingCv && <Loader2 className="animate-spin h-4 w-4" />}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X URL</Label>
                  <Input
                    id="twitter"
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
