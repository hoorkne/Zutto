import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Menu as MenuIcon } from 'lucide-react';

export function MobileBottomBar() {
  const location = useLocation();
  const isReservationsPage = location.pathname === '/reservations';

  return (
    <AnimatePresence>
      {!isReservationsPage && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/80 backdrop-blur-xl border-t border-border/50 px-4 py-3 pb-safe flex items-center justify-between gap-2"
        >
          <div className="flex gap-4 flex-1 justify-around">
            <Link to="/menu" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <MenuIcon size={20} />
              <span className="text-[10px] uppercase tracking-widest font-medium">Menu</span>
            </Link>
            <Link to="/visit" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <MapPin size={20} />
              <span className="text-[10px] uppercase tracking-widest font-medium">Location</span>
            </Link>
          </div>
          
          <Link
            to="/reservations"
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-sm font-medium uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:shadow-[0_0_25px_rgba(197,160,89,0.5)] transition-shadow"
          >
            <Calendar size={16} />
            Reserve Now
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
