import React, { createContext, useContext, useState, useEffect } from 'react';

interface ImageContextType {
  images: Record<string, string>;
  setImage: (slotId: string, urlOrBase64: string) => void;
  removeImage: (slotId: string) => void;
  resetAllImages: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

const STORAGE_KEY = 'ansh_mehndi_real_photos_v1';

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch {
      // storage quota or private browsing safeguard
    }
  }, [images]);

  const setImage = (slotId: string, urlOrBase64: string) => {
    setImages(prev => ({ ...prev, [slotId]: urlOrBase64 }));
  };

  const removeImage = (slotId: string) => {
    setImages(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  const resetAllImages = () => {
    setImages({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <ImageContext.Provider value={{ images, setImage, removeImage, resetAllImages }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const ctx = useContext(ImageContext);
  if (!ctx) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return ctx;
};
