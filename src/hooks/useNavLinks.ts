import { useState, useEffect } from 'react';
import { NavLink } from '../types';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultLinks: NavLink[] = [
  { id: '1', label: 'Workspace', url: '/', section: 'explore' },
  { id: '2', label: 'Living', url: '/', section: 'explore' },
  { id: '3', label: 'Accessories', url: '/', section: 'explore' },
  { id: '4', label: 'Journal', url: '/', section: 'explore' },
  { id: '5', label: 'Privacy Policy', url: '#', section: 'legal' },
  { id: '6', label: 'Terms of Service', url: '#', section: 'legal' },
];

const cleanLink = (link: NavLink): Record<string, any> => {
  return {
    id: String(link.id || ''),
    label: String(link.label || ''),
    url: String(link.url || '/'),
    section: link.section === 'legal' ? 'legal' : 'explore'
  };
};

export function useNavLinks() {
  const [links, setLinks] = useState<NavLink[]>(defaultLinks);

  useEffect(() => {
    const linksRef = collection(db, 'nav_links');
    
    const unsubscribe = onSnapshot(linksRef, async (snapshot) => {
      if (snapshot.empty) {
        // Seed default links
        try {
          const batch = writeBatch(db);
          defaultLinks.forEach(link => {
            const docRef = doc(linksRef, link.id);
            batch.set(docRef, cleanLink(link));
          });
          await batch.commit();
        } catch (e) {
          console.warn("Could not seed default links to Firestore:", e);
        }
        setLinks(defaultLinks);
      } else {
        const fetchedLinks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as NavLink));
        
        // Sort by ID assuming they are added chronologically or ordered
        fetchedLinks.sort((a, b) => Number(a.id) - Number(b.id));
        setLinks(fetchedLinks);
      }
    }, (error) => {
      console.warn("Firestore nav_links error, using default links:", error);
      setLinks(defaultLinks);
    });

    return () => unsubscribe();
  }, []);

  const addLink = async (link: NavLink) => {
    try {
      await setDoc(doc(db, 'nav_links', link.id), cleanLink(link));
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const removeLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'nav_links', id));
    } catch (error) {
      console.error("Error removing link:", error);
    }
  };

  const editLink = async (updatedLink: NavLink) => {
    try {
      await setDoc(doc(db, 'nav_links', updatedLink.id), cleanLink(updatedLink));
    } catch (error) {
      console.error("Error editing link:", error);
    }
  };

  const resetToDefaults = async () => {
    try {
      const batch = writeBatch(db);
      links.forEach(l => {
        batch.delete(doc(db, 'nav_links', l.id));
      });
      defaultLinks.forEach(link => {
        const docRef = doc(db, 'nav_links', link.id);
        batch.set(docRef, cleanLink(link));
      });
      await batch.commit();
      setLinks(defaultLinks);
    } catch (error) {
      console.error("Error resetting links:", error);
      setLinks(defaultLinks);
    }
  };

  return { links, addLink, removeLink, editLink, resetToDefaults };
}
