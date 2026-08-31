import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SiteSettings {
  videoUrl?: string;
  showVideo?: boolean;
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>({ showVideo: false, videoUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'home');
    
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      } else {
        setSettings({ showVideo: false, videoUrl: '' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      await setDoc(doc(db, 'settings', 'home'), newSettings, { merge: true });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return { settings, loading, updateSettings };
}
