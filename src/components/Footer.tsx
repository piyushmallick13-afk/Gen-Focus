import { Instagram, Download, FileText } from 'lucide-react';
import { useNavLinks } from '../hooks/useNavLinks';
import { Link } from 'react-router-dom';
import durgaEmblem from '../assets/images/durga_emblem_logo_1789895244534.jpg';
import { DurgaTrinayani } from './FestiveDurgaMotifs';

export default function Footer() {
  const { links } = useNavLinks();
  const exploreLinks = links.filter(link => link.section === 'explore');
  const legalLinks = links.filter(link => link.section === 'legal');

  const handleDownloadBackupPrompt = () => {
    const text = `# GENFOCUS ORIGINAL MINIMALIST THEME BACKUP PROMPT
# Save this prompt and paste it to the AI assistant whenever you want to revert to the original theme.

Revert the store to its original minimalist, modern lifestyle design:

1. Visual Theme & Colors:
   - Remove all festive Durga Puja / Bengali cultural elements, Bengali text, red/gold festive colors, alpona motifs, and pujo tags.
   - Restore the original aesthetic: clean warm off-white canvas (bg-[#FAFAFA] / bg-white), neutral stone palette (text-stone-900, text-stone-500, border-stone-200), and minimalist typography.
   - Restore the original brand tagline: "Curated essentials for intentional living."

2. Header & Navigation:
   - Use the original simple circular genfocus logo.
   - Keep standard category links: All, Work & Focus, Sound & Audio, Writing & Carry, Lighting & Ambience, Apparel & Comfort.
   - Clean stone-style search bar, cart toggle, and admin link without festive pills or audio players.

3. Hero Section:
   - Minimalist headline: "Curated essentials for intentional living."
   - Subtext: "Discover a selection of premium, minimalist products designed to bring focus, calm, and elegance to your everyday environment."
   - Clean product showcase carousel with soft drop shadows and stone-toned pill buttons ("Explore Collection").
   - Continuous text marquee featuring lifestyle and desk product categories.

4. Product Grid & Cards:
   - Clean rounded card borders (rounded-2xl border-stone-100), smooth hover shadows, neutral stone price displays, and standard "Best Deal" or "Sale" badges.
   - Remove the 5 Pujo days lookbook and festive tabs.

5. Cart, Checkout & Footer:
   - Minimalist dark stone buttons (bg-stone-900 text-white hover:bg-stone-800).
   - Keep full Razorpay checkout functionality and cart operations intact, styled with clean monochromatic lines and subtle borders.
   - Clean footer with simple copyright: "© genfocus. All rights reserved." and social links.
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'genfocus-theme-backup-prompt.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="border-t border-amber-900/10 bg-[#FAF6F0] mt-16 text-stone-700">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={durgaEmblem} 
                alt="Durga Puja Emblem" 
                className="w-10 h-10 rounded-full border border-amber-400 shadow-sm object-cover" 
              />
              <div>
                <span className="text-xl font-display font-bold tracking-wide text-rose-950 block">
                  genfocus
                </span>
                <span className="text-[11px] font-medium text-amber-800 tracking-wider uppercase block">
                  শারদোৎসব ২০২৬ • Sharadotsav Edition
                </span>
              </div>
            </div>
            <p className="text-stone-600 text-xs sm:text-sm max-w-sm font-light leading-relaxed mb-4">
              Celebrating the warmth, devotion, and festive spirit of Durga Puja. Curated artisanal brassware, Gorod silks, and thoughtful living essentials for your home.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-rose-900 text-xs font-medium">
              <DurgaTrinayani className="w-3.5 h-3.5 text-rose-800" />
              <span>মা আসছেন • Subho Sharadiya to you and your family</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-rose-950 mb-4 text-xs tracking-wider uppercase">Pujo & Living</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/?category=Durga+Puja+Specials" className="text-xs sm:text-sm text-stone-600 hover:text-rose-800 transition-colors font-medium">
                  🌸 Durga Puja Specials
                </Link>
              </li>
              <li>
                <Link to="/?category=Pujor+Shaj+%26+Apparel" className="text-xs sm:text-sm text-stone-600 hover:text-rose-800 transition-colors">
                  🥻 Pujor Shaj & Apparel
                </Link>
              </li>
              <li>
                <Link to="/?category=Aarti+%26+Dhunuchi+Fragrance" className="text-xs sm:text-sm text-stone-600 hover:text-rose-800 transition-colors">
                  🪔 Aarti & Dhunuchi Brassware
                </Link>
              </li>
              {exploreLinks.map(link => (
                <li key={link.id}>
                  <Link to={link.url} className="text-xs sm:text-sm text-stone-500 hover:text-rose-800 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-rose-950 mb-4 text-xs tracking-wider uppercase">Information</h4>
            <ul className="space-y-2.5">
              {legalLinks.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="text-xs sm:text-sm text-stone-500 hover:text-rose-800 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <span className="text-xs text-stone-400">Pujo Delivery Helpdesk: Active 24/7</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-amber-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 font-light text-center md:text-left">
            © {new Date().getFullYear()} genfocus • শারদীয় শুভেচ্ছা ও আন্তরিক অভিনন্দন। All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadBackupPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-rose-900 bg-white hover:bg-amber-50/80 border border-amber-200/80 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Download Theme Backup Prompt (.txt)"
            >
              <FileText className="w-3.5 h-3.5 text-rose-700" />
              <span>Theme Backup (.txt)</span>
              <Download className="w-3 h-3 text-stone-400 ml-0.5" />
            </button>
            <a 
              href="https://www.instagram.com/_gen_focus_/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-stone-500 hover:text-rose-800 transition-colors p-1.5 rounded-full hover:bg-rose-50"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

