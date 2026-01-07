import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Built with <Heart className="w-4 h-4 inline text-red-500" /> using React, Tailwind CSS & Lovable Cloud
          </p>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mohammed Mubashir Ali. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;