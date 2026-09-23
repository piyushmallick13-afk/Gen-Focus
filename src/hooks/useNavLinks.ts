import { useState, useEffect } from 'react';
import { NavLink } from '../types';
import { collection, onSnapshot, setDoc, deleteDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const defaultLinks: NavLink[] = [
  { id: '1', label: 'Workspace', url: '/', section: 'explore' },
  { id: '2', label: 'Living', url: '/', section: 'explore' },
  { id: '3', label: 'Accessories', url: '/', section: 'explore' },
  { id: '4', label: 'Journal', url: '/', section: 'explore' },
  { id: '5', label: 'Privacy Policy', url: '#', section: 'legal' },
  { id: '6', label: 'Terms of Service', url: '#', section: 'legal' },
];

let hasCheckedNavSeed = false;

export function useNavLinks() {
  const [links, setLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    const linksRef = collection(db, 'nav_links');
    const systemNavDocRef = doc(db, 'system', 'nav_state');

    const checkAndSeedNav = async () => {
      if (hasCheckedNavSeed) return;
      hasCheckedNavSeed = true;

      try {
        const systemSnap = await getDoc(systemNavDocRef);
        if (!systemSnap.exists()) {
          const batch = writeBatch(db);
          defaultLinks.forEach(link => {
            const docRef = doc(linksRef, link.id);
            batch.set(docRef, link);
          });
          batch.set(systemNavDocRef, { seeded: true, initializedAt: new Date().toISOString() });
          await batch.commit();
        }
      } catch (err) {
        console.error("Initial nav links seeding check error:", err);
      }
    };

    checkAndSeedNav();

    const unsubscribe = onSnapshot(linksRef, (snapshot) => {
      const fetchedLinks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as NavLink));

      fetchedLinks.sort((a, b) => {
        const numA = Number(a.id);
        const numB = Number(b.id);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.id.localeCompare(b.id);
      });

      setLinks(fetchedLinks);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'nav_links');
    });

    return () => unsubscribe();
  }, []);

  const addLink = async (link: NavLink) => {
    try {
      await setDoc(doc(db, 'nav_links', link.id), link);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `nav_links/${link.id}`);
    }
  };

  const removeLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'nav_links', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `nav_links/${id}`);
    }
  };

  const editLink = async (updatedLink: NavLink) => {
    try {
      await setDoc(doc(db, 'nav_links', updatedLink.id), updatedLink);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `nav_links/${updatedLink.id}`);
    }
  };

  return { links, addLink, removeLink, editLink };
}
