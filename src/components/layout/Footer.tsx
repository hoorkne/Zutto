import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-border/50 pt-20 pb-24 md:pb-12 text-muted-foreground">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        {/* Brand & Newsletter */}
        <div className="md:col-span-2 space-y-6">
          <Link to="/" className="text-3xl font-serif tracking-widest uppercase text-foreground">
            Zutto
          </Link>
          <p className="max-w-md text-sm leading-relaxed">
            Modern Japanese dining, designed for the obsessed. Step into a space where Tokyo minimalism meets unrelenting culinary passion.
          </p>
          
          <div className="pt-4">
            <h4 className="text-foreground font-medium uppercase tracking-widest text-xs mb-4">Join the Secret Menu List</h4>
            <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-b border-muted-foreground/30 px-0 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors flex-1"
                required
              />
              <button type="submit" className="text-xs uppercase tracking-widest font-medium text-primary hover:text-primary/80 transition-colors">
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-6">
          <h4 className="text-foreground font-medium uppercase tracking-widest text-xs">Explore</h4>
          <nav className="flex flex-col gap-4 text-sm">
            <Link to="/menu" className="hover:text-primary transition-colors">The Menu</Link>
            <Link to="/reservations" className="hover:text-primary transition-colors">Reservations</Link>
            <Link to="/story" className="hover:text-primary transition-colors">Our Story</Link>
            <Link to="/experience" className="hover:text-primary transition-colors">The Experience</Link>
          </nav>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <h4 className="text-foreground font-medium uppercase tracking-widest text-xs">Visit Us</h4>
          <div className="flex flex-col gap-4 text-sm">
            <p className="flex items-start gap-3">
              <MapPin size={16} className="mt-1 shrink-0 text-primary" />
              <span>123 Neon Avenue,<br />Downtown, City 90210</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-primary" />
              <span>+1 (555) 123-4567</span>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-primary" />
              <span>reservations@zuttodining.com</span>
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} Zutto Dining. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
