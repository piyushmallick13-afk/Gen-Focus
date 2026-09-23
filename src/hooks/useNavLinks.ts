import { useState, useEffect } from 'react';
import { NavLink } from '../types';

const STORAGE_KEY = 'genfocus_nav_links';

const defaultLinks: NavLink[] = [
  { id: '1', label: 'Workspace', url: '/', section: 'explore' },
  { id: '2', label: 'Living', url: '/', section: 'explore' },
  { id: '3', label: 'Accessories', url: '/', section: 'explore' },
  { id: '4', label: 'Journal', url: '/', section: 'explore' },
  { id: '5', label: 'Privacy Policy', url: '#', section: 'legal' },
  { id: '6', label: 'Terms of Service', url: '#', section: 'legal' },
];

function loadInitialLinks(): NavLink[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load nav links from localStorage:', err);
  }
  return defaultLinks;
}

export function useNavLinks() {
  const [links, setLinks] = useState<NavLink[]>(loadInitialLinks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    } catch (err) {
      console.error('Failed to save nav links to localStorage:', err);
    }
  }, [links]);

  const addLink = (link: NavLink) => {
    setLinks(prev => [...prev, link]);
  };

  const removeLink = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const editLink = (updatedLink: NavLink) => {
    setLinks(prev => prev.map(l => l.id === updatedLink.id ? updatedLink : l));
  };

  const resetToDefaults = () => {
    setLinks(defaultLinks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLinks));
    } catch (err) {
      console.error('Failed to reset nav links in localStorage:', err);
    }
  };

  return { links, addLink, removeLink, editLink, resetToDefaults };
}
