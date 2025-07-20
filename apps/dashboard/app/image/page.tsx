'use client';

import React from 'react';
import { ClientImageEditor } from '@workspace/image-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { toast } from 'sonner';

export default function ImageEditorPage() {
  const handleSave = (dataUrl: string) => {
    // Create a download link
    const link = document.createElement('a');
    link.download = `edited-image-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    
    toast.success('Image saved successfully!');
  };

  return (
    <div className="h-screen">
      <ClientImageEditor
        width={1200}
        height={800}
        backgroundColor="#ffffff"
        onSave={handleSave}
      />
    </div>
  );
}
