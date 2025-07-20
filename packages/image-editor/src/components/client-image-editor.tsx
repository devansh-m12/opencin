'use client';

import React, { useEffect, useState } from 'react';
import { ImageEditor } from './image-editor';

interface ClientImageEditorWithNavbarProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onSave?: (dataUrl: string) => void;
}

export const ClientImageEditor: React.FC<ClientImageEditorWithNavbarProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading image editor...</p>
        </div>
      </div>
    );
  }

  return <ImageEditor {...props} />;
}; 