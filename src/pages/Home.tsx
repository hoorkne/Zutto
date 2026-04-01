import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ArrowRight, MapPin, Clock, Phone } from 'lucide-react';

const signatureDishes = [
  {
    name: 'A5 Wagyu Truffle Maki',
    description: 'Melt-in-your-mouth perfection, smoked tableside.',
    image: 'https://picsum.photos/seed/sushi1/800/600?blur=1',
  },
  {
    name: 'Yuzu Miso Black Cod',
    description: 'A 48-hour marinade for a fleeting moment of bliss.',
    image: 'https://picsum.photos/seed/sushi2/800/600?blur=1',
  },
  {
    name: 'Imperial Caviar & Toro',
    description: 'The pinnacle of oceanic indulgence, served on a crisp nori tempura.',
    image: 'https://picsum.photos/seed/sushi3/800/600?blur=1',
  },
];

export function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Promo Bar */}
      <div className="bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest py-2 text-center z-50 relative">
        Unlock 50% off our Signature Omakase for early-evening bookings.{' '}
        <Link to="/reservations" className="underline underline-offset-4 hover:text-background/80 transition-colors">
          Claim Offer
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Video Background Placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src="https://picsum.photos/seed/restaurant/1920/1080"
            alt="Zutto Dining Experience"
            className="w-full h-full object-cover scale-105 animate-slow-pan"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container relative z-20 px-6 md:px-12 text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground mb-6 leading-tight"
          >
            Familiar Flavors.<br />Uncharted Territory.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-foreground/80 font-light max-w-2xl mb-12"
          >
            Modern Japanese dining, designed for the obsessed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <Link
              to="/reservations"
              className="px-10 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]"
            >
              Secure Your Table
            </Link>
            <p className="text-xs text-primary/80 uppercase tracking-widest font-medium animate-pulse">
              Walk-ins highly limited tonight.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="flex justify-center gap-1 mb-6 text-primary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
            "Redefining the modern dinner date."
          </h2>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
            — The City Chronicle | 1,200+ Happy Guests
          </p>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">The Signatures.</h2>
            <p className="text-muted-foreground max-w-md">A glimpse into our culinary obsession. Prepared with reverence, served with flair.</p>
          </div>
          <Link to="/menu" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest font-medium text-primary hover:text-primary/80 transition-colors">
            Explore the Menu <ArrowRight size={16} />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto pb-12 px-6 md:px-12 gap-8 snap-x snap-mandatory hide-scrollbar">
          {signatureDishes.map((dish, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="min-w-[85vw] md:min-w-[400px] snap-center group cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-[4/5] mb-6">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">{dish.name}</h3>
              <p className="text-sm text-muted-foreground">{dish.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-6 mt-4 md:hidden">
          <Link to="/menu" className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-medium text-primary hover:text-primary/80 transition-colors">
            Explore the Menu <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* The Experience (Why Zutto) */}
      <section className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden"
            >
              <img
                src="https://picsum.photos/seed/ambience/1000/1000?blur=2"
                alt="Zutto Dining Room"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-8 leading-tight">
                Zutto means<br />'Forever'.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We believe a great meal is ephemeral, but the memory should last forever. Step into a space where Tokyo minimalism meets unrelenting culinary passion.
              </p>
              <Link
                to="/story"
                className="inline-block border-b border-primary text-primary pb-1 uppercase tracking-widest text-sm font-medium hover:text-primary-foreground hover:bg-primary transition-all duration-300 px-2"
              >
                Discover Our Story
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Info & Email Capture */}
      <section className="py-24 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          {/* Quick Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif text-foreground mb-8">Visit Us</h2>
              <div className="space-y-6 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground font-medium mb-1">Location</p>
                    <p>123 Neon Avenue, Downtown<br />City 90210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground font-medium mb-1">Hours</p>
                    <p>Mon-Sun: 5:00 PM - Late<br />Omakase Seatings: 6:00 PM & 8:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground font-medium mb-1">Contact</p>
                    <p>+1 (555) 123-4567<br />reservations@zuttodining.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Capture */}
          <div className="bg-[#0a0a0a] border border-border/50 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-serif text-foreground mb-4">Join the Secret Menu List.</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Drop your email to receive our off-menu seasonal specials and priority booking links before they go public.
            </p>
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent border-b border-muted-foreground/30 px-0 py-4 text-foreground focus:outline-none focus:border-primary transition-colors w-full"
                required
              />
              <button
                type="submit"
                className="mt-4 px-8 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-all duration-300 w-full md:w-auto self-start"
              >
                Join the Inner Circle
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
