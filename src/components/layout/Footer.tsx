import { Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-qp-card border-t border-qp-border mt-8">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Responsible gambling */}
        <div className="bg-qp-bg rounded-lg p-3 flex items-start gap-3">
          <Shield className="w-4 h-4 text-qp-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-qp-text">Play Responsibly</p>
            <p className="text-xs text-qp-muted mt-0.5">
              Gambling can be addictive. Please play responsibly. 18+ only.
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <a href="#" className="text-xs text-qp-muted hover:text-qp-text transition-colors">Terms</a>
          <a href="#" className="text-xs text-qp-muted hover:text-qp-text transition-colors">Privacy</a>
          <a href="#" className="text-xs text-qp-muted hover:text-qp-text transition-colors">Responsible Gaming</a>
          <a href="#" className="text-xs text-qp-muted hover:text-qp-text transition-colors">Support</a>
        </div>

        {/* Copyright */}
        <div className="text-center space-y-1">
          <p className="text-xs text-qp-muted">
            © 2026 QuickPesa. All rights reserved.
          </p>
          <p className="text-[10px] text-qp-muted/50 flex items-center justify-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400" /> in Kenya
          </p>
        </div>
      </div>
    </footer>
  );
};
