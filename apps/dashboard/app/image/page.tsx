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
    <div className="container mx-auto p-6">

      <Card className="h-[calc(100vh-200px)]">
        <CardHeader>
          <CardTitle>Image Editor</CardTitle>
          <CardDescription>
            Upload an image to get started. Add text, shapes, and other elements to enhance your image.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-full">
          <ClientImageEditor
            width={800}
            height={600}
            backgroundColor="#ffffff"
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  );
}
