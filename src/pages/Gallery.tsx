import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const galleryImages = [
  { src: 'https://picsum.photos/seed/sushi4/800/1000?blur=1', alt: 'The Money Shot', span: 'col-span-1 row-span-2' },
  { src: 'https://picsum.photos/seed/ambience2/800/600?blur=1', alt: 'Aspirational Couple', span: 'col-span-2 row-span-1' },
  { src: 'https://picsum.photos/seed/interior/600/600?blur=1', alt: 'Interior Lighting', span: 'col-span-1 row-span-1' },
  { src: 'https://picsum.photos/seed/sushi5/600/600?blur=1', alt: 'Close-up of Uni', span: 'col-span-1 row-span-1' },
  { src: 'https://picsum.photos/seed/drink/800/1000?blur=1', alt: 'Cocktail Pour', span: 'col-span-1 row-span-2' },
  { src: 'https://picsum.photos/seed/chef2/1200/600?blur=1', alt: 'Chef Action', span: 'col-span-2 row-span-1' },
];

export function Gallery() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">The Experience.</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A visual feast. Every frame tells a story of passion, precision, and pleasure.
          </p>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-4 md:gap-6 mb-32">
          {galleryImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative overflow-hidden group ${img.span}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>

        {/* Social CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center border-t border-border/50 pt-20"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">Tag your obsession.</h2>
          <p className="text-muted-foreground mb-10">
            Follow our journey and share yours using <span className="text-primary font-medium">#ZuttoNights</span>.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-10 py-4 border border-primary text-primary text-sm uppercase tracking-widest font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            @ZuttoDining on Instagram <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
