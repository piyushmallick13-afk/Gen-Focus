import { Instagram } from 'lucide-react';
import { useNavLinks } from '../hooks/useNavLinks';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { links } = useNavLinks();
  const exploreLinks = links.filter(link => link.section === 'explore');
  const legalLinks = links.filter(link => link.section === 'legal');

  return (
    <footer className="border-t border-stone-200/50 bg-[#FAFAFA] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-display font-medium tracking-wide text-stone-800">
                genfocus
              </span>
            </div>
            <p className="text-stone-500 text-sm max-w-sm font-light leading-relaxed">
              Curated essentials for intentional living. We partner with selected brands to bring you minimalist, high-quality products that elevate your daily routines.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-stone-900 mb-4 text-sm">Explore</h4>
            <ul className="space-y-3">
              {exploreLinks.map(link => (
                <li key={link.id}>
                  <Link to={link.url} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-stone-900 mb-4 text-sm">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-stone-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400 font-light">
            © {new Date().getFullYear()} genfocus. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/_gen_focus_/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-stone-400 hover:text-stone-800 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
