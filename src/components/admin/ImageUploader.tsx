'use client';

import { useState } from 'react';
import { storage, BUCKET_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (fileId: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = "Cover Image" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    value ? String(storage.getFileView(BUCKET_ID, value)) : null
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const fileId = response.$id;
      onChange(fileId);
      setPreview(String(storage.getFileView(BUCKET_ID, fileId)));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {preview ? (
        <div className="relative w-full h-48 rounded-md overflow-hidden border bg-muted group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="destructive" size="sm" onClick={handleRemove}>
              <X className="mr-2 h-4 w-4" /> Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={uploading}
          />
          {uploading && <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />}
        </div>
      )}
    </div>
  );
}
