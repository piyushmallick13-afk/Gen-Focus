import { Instagram } from 'lucide-react';
import { useNavLinks } from '../hooks/useNavLinks';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import IndependenceDayEasterEgg from './IndependenceDayEasterEgg';
import { motion } from 'motion/react';

export default function Footer() {
  const { links } = useNavLinks();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const exploreLinks = links.filter(link => link.section === 'explore');
  const legalLinks = links.filter(link => link.section === 'legal');

  return (
    <footer className="border-t-4 border-orange-500 bg-slate-50 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-display font-medium tracking-wide text-green-700">
                genfocus
              </span>
              <img src="/src/assets/images/indian_diya_icon_1785629067756.jpg" alt="Diya" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            </div>
            <p className="text-slate-500 text-sm max-w-sm font-light leading-relaxed">
              Curated essentials for intentional living. We partner with selected brands to bring you minimalist, high-quality products that elevate your daily routines.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-green-700 mb-4 text-sm">Explore</h4>
            <ul className="space-y-3">
              {exploreLinks.map(link => (
                <li key={link.id}>
                  <Link to={link.url} className="text-sm text-slate-500 hover:text-orange-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-green-700 mb-4 text-sm">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="text-sm text-slate-500 hover:text-orange-500 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-green-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-light cursor-pointer hover:text-orange-500" onClick={() => setShowEasterEgg(true)}>
            © {new Date().getFullYear()} genfocus. All rights reserved. 
            <motion.span 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block ml-1 text-base"
            >
                🇮🇳
            </motion.span>
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/_gen_focus_/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-orange-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      {showEasterEgg && <IndependenceDayEasterEgg onClose={() => setShowEasterEgg(false)} />}
    </footer>
  );
}
