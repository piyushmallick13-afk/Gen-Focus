import { useState, useEffect } from 'react';
import { NavLink } from '../types';

const defaultLinks: NavLink[] = [
  { id: '1', label: 'Workspace', url: '/', section: 'explore' },
  { id: '2', label: 'Living', url: '/', section: 'explore' },
  { id: '3', label: 'Accessories', url: '/', section: 'explore' },
  { id: '4', label: 'Journal', url: '/', section: 'explore' },
  { id: '5', label: 'Privacy Policy', url: '#', section: 'legal' },
  { id: '6', label: 'Terms of Service', url: '#', section: 'legal' },
];

export function useNavLinks() {
  const [links, setLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    const savedLinks = localStorage.getItem('genfocus_nav_links');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    } else {
      setLinks(defaultLinks);
      localStorage.setItem('genfocus_nav_links', JSON.stringify(defaultLinks));
    }
  }, []);

  const addLink = (link: NavLink) => {
    const newLinks = [...links, link];
    setLinks(newLinks);
    localStorage.setItem('genfocus_nav_links', JSON.stringify(newLinks));
  };

  const removeLink = (id: string) => {
    const newLinks = links.filter(l => l.id !== id);
    setLinks(newLinks);
    localStorage.setItem('genfocus_nav_links', JSON.stringify(newLinks));
  };

  const editLink = (updatedLink: NavLink) => {
    const newLinks = links.map(l => l.id === updatedLink.id ? updatedLink : l);
    setLinks(newLinks);
    localStorage.setItem('genfocus_nav_links', JSON.stringify(newLinks));
  };

  return { links, addLink, removeLink, editLink };
}
