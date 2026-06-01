import { Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-border mt-6">
      <div className="max-w-md mx-auto px-3 py-4 space-y-3">
        <div className="bg-dark-900 rounded-lg p-2.5 flex items-start gap-2">
          <Shield className="w-3.5 h-3.5 text-brand-orange mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-white">Play Responsibly</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Gambling can be addictive. 18+ only.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
          {['Terms', 'Privacy', 'Responsible Gaming', 'Support'].map(link => (
            <a key={link} href="#" className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">{link}</a>
          ))}
        </div>
        <p className="text-[10px] text-gray-600 text-center">© 2026 QuickPesa. All rights reserved.</p>
      </div>
    </footer>
  );
};
