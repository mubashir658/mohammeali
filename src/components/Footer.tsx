const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mohammed Mubashir Ali. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;