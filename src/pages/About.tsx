import { motion } from 'motion/react';

export function About() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000"
          >
            <img
              src="https://picsum.photos/seed/chef/800/1200?blur=1"
              alt="Executive Chef"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-primary font-serif italic text-xl">"Perfection is a moving target. We chase it every night."</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-8 leading-tight">
              Respect the Tradition.<br />Break the Rules.
            </h1>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Zutto was born from a singular obsession: to create a dining experience that stops time. We don't just serve sushi; we curate moments.
              </p>
              <p>
                From fish flown in fresh from Toyosu Market to our custom-charred binchotan grills, every detail is engineered for your pleasure. We honor the centuries-old techniques of Edomae sushi while embracing the bold, global flavors of modern gastronomy.
              </p>
              <p>
                It's not fusion. It's evolution.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#050505] border border-border/50 p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6 relative z-10">The Vibe.</h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed relative z-10 font-light">
            Leave your stress at the door. Let the low bass of the music and the warmth of the sake take over. This is your sanctuary in the city.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
