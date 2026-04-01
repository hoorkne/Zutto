import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const menuCategories = [
  {
    title: 'The Raw',
    items: [
      { name: 'Imperial Caviar & Toro Set', description: 'Osetra caviar, bluefin toro, gold leaf, house-cured soy.', price: '120', highlight: true },
      { name: 'Volcano Toro', description: 'Bluefin tuna, crispy shallot, house-fermented chili aioli.', price: '18' },
      { name: 'Hamachi Truffle', description: 'Yellowtail, white truffle ponzu, jalapeño, micro cilantro.', price: '22' },
      { name: 'A5 Wagyu Tartare', description: 'Quail egg, smoked soy, crispy nori chips.', price: '28' },
    ],
  },
  {
    title: 'The Hot',
    items: [
      { name: 'Charred Edamame', description: 'Wok-tossed in smoked sea salt and toasted sesame oil.', price: '9' },
      { name: 'Crispy Rice Spicy Tuna', description: 'Pan-seared sushi rice, spicy tuna tartare, serrano.', price: '16' },
      { name: 'Miso Eggplant', description: 'Sweet red miso glaze, sesame, scallion.', price: '12' },
      { name: 'Rock Shrimp Tempura', description: 'Gochujang aioli, yuzu zest.', price: '19' },
    ],
  },
  {
    title: 'The Coals',
    items: [
      { name: 'Yuzu Miso Black Cod', description: 'A 48-hour marinade for a fleeting moment of bliss.', price: '42', highlight: true },
      { name: 'A5 Wagyu Ishiyaki', description: 'Hot stone tableside cooking, garlic chips, ponzu.', price: '85' },
      { name: 'Robata Jidori Chicken', description: 'Tare glaze, yuzu kosho, charred leeks.', price: '24' },
      { name: 'Maitake Mushroom', description: 'Truffle butter, soy glaze, chives.', price: '15' },
    ],
  },
  {
    title: 'Liquid Art',
    items: [
      { name: 'Tokyo Drift', description: 'Japanese whisky, plum wine, smoked cinnamon, bitters.', price: '22' },
      { name: 'Yuzu Margarita', description: 'Blanco tequila, yuzu juice, agave, matcha salt rim.', price: '18' },
      { name: 'Kyoto Sour', description: 'Gin, midori, lemon, egg white, shiso leaf.', price: '19' },
      { name: 'Sake Flight', description: 'Chef\'s selection of 3 premium junmai daiginjo.', price: '35' },
    ],
  },
];

export function Menu() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">A Symphony of Smoke, Salt, and Sea.</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our menu is a living document, changing with the seasons and the catch. We invite you to explore the familiar and the uncharted.
          </p>
        </motion.div>

        <div className="space-y-24">
          {menuCategories.map((category, catIndex) => (
            <motion.section
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-serif text-primary mb-8 border-b border-border/50 pb-4 uppercase tracking-widest">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className={`text-lg font-medium ${item.highlight ? 'text-primary' : 'text-foreground'} uppercase tracking-wider`}>
                        {item.name}
                      </h3>
                      <div className="flex-1 border-b border-dotted border-muted-foreground/30 mx-4 relative top-[-6px]" />
                      <span className="text-foreground font-mono">{item.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 text-center border-t border-border/50 pt-16"
        >
          <h2 className="text-3xl font-serif text-foreground mb-8">Craving it yet?</h2>
          <Link
            to="/reservations"
            className="inline-block px-12 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]"
          >
            Book Your Table Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
