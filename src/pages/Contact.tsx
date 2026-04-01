import { motion } from 'motion/react';
import { MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react';

export function Contact() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">Visit Us.</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your journey begins here. We look forward to welcoming you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[500px] lg:h-auto w-full bg-[#111] border border-border/50 relative overflow-hidden"
          >
            {/* Placeholder for custom dark mode Google Map */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-[#0a0a0a]">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-4 text-primary opacity-50" />
                <p className="font-serif text-xl">Interactive Map Area</p>
                <p className="text-sm mt-2">123 Neon Avenue, Downtown</p>
              </div>
            </div>
            {/* Simulating map overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-center space-y-12"
          >
            <div>
              <h2 className="text-2xl font-serif text-primary mb-6 border-b border-border/50 pb-4 uppercase tracking-widest">
                Location & Hours
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground font-medium mb-1">Address</p>
                    <p>123 Neon Avenue, Downtown<br />City 90210</p>
                    <p className="text-xs mt-2 italic text-primary/80">Valet parking available at the front door.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground font-medium mb-1">Operating Hours</p>
                    <p>Monday - Sunday: 5:00 PM - Late<br />Omakase Seatings: 6:00 PM & 8:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-primary mb-6 border-b border-border/50 pb-4 uppercase tracking-widest">
                Get in Touch
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <Phone className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground font-medium mb-1">Phone</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground font-medium mb-1">Email</p>
                    <p>reservations@zuttodining.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="pt-8 border-t border-border/50">
              <a
                href="#"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 text-sm uppercase tracking-widest font-medium hover:bg-[#25D366]/20 transition-all duration-300 shadow-[0_0_15px_rgba(37,211,102,0.1)] hover:shadow-[0_0_25px_rgba(37,211,102,0.2)]"
              >
                <MessageCircle size={20} />
                Chat with Host for Walk-ins
              </a>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Fastest response for last-minute availability.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
