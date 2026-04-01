import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, Flame } from 'lucide-react';

export function Reservations() {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [experience, setExperience] = useState('dining');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate booking process
    alert('Reservation requested! (This is a demo)');
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Context & Urgency */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6 leading-tight">
              Your Seat<br />Awaits.
            </h1>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Reservations open 30 days in advance. Due to high demand, prime evening slots book up quickly.
            </p>

            <div className="space-y-8 mb-12">
              <div className="bg-[#0a0a0a] border border-border/50 p-6 relative overflow-hidden group cursor-pointer" onClick={() => setExperience('dining')}>
                <div className={`absolute inset-0 border-2 transition-colors duration-300 ${experience === 'dining' ? 'border-primary' : 'border-transparent'}`} />
                <h3 className="text-xl font-serif text-foreground mb-2 flex items-center gap-2">
                  The Dining Room
                  {experience === 'dining' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                </h3>
                <p className="text-sm text-muted-foreground">Intimate, ambient, perfect for connection. A la carte or tasting menu.</p>
              </div>

              <div className="bg-[#0a0a0a] border border-border/50 p-6 relative overflow-hidden group cursor-pointer" onClick={() => setExperience('omakase')}>
                <div className={`absolute inset-0 border-2 transition-colors duration-300 ${experience === 'omakase' ? 'border-primary' : 'border-transparent'}`} />
                <h3 className="text-xl font-serif text-primary mb-2 flex items-center gap-2">
                  The Omakase Counter
                  {experience === 'omakase' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">Only 8 seats per night. A front-row culinary performance.</p>
                <p className="text-xs uppercase tracking-widest text-primary/80 font-medium flex items-center gap-1">
                  <Flame size={14} /> Highly Limited Availability
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-primary/5 border border-primary/20 p-4 rounded-sm">
              <Clock className="text-primary shrink-0" size={20} />
              <p>
                <span className="text-foreground font-medium">4 people</span> are looking at tables for this Friday.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#050505] border border-border/50 p-8 md:p-12 shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <h2 className="text-2xl font-serif text-foreground mb-8 text-center">Secure Your Reservation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Guests */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Party Size</label>
                <div className="flex items-center border-b border-muted-foreground/30 py-2">
                  <Users className="text-primary mr-4" size={20} />
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="bg-transparent text-foreground w-full focus:outline-none appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num} className="bg-background text-foreground">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                    <option value="7" className="bg-background text-foreground">7+ Guests (Contact Us)</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Date</label>
                <div className="flex items-center border-b border-muted-foreground/30 py-2">
                  <CalendarIcon className="text-primary mr-4" size={20} />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-foreground w-full focus:outline-none cursor-pointer [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Time</label>
                <div className="flex items-center border-b border-muted-foreground/30 py-2">
                  <Clock className="text-primary mr-4" size={20} />
                  <select 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-transparent text-foreground w-full focus:outline-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled className="bg-background text-muted-foreground">Select a time</option>
                    <option value="17:00" className="bg-background text-foreground">5:00 PM</option>
                    <option value="17:30" className="bg-background text-foreground">5:30 PM</option>
                    <option value="18:00" className="bg-background text-foreground">6:00 PM</option>
                    <option value="18:30" className="bg-background text-foreground">6:30 PM</option>
                    <option value="19:00" className="bg-background text-foreground">7:00 PM</option>
                    <option value="19:30" className="bg-background text-foreground">7:30 PM</option>
                    <option value="20:00" className="bg-background text-foreground">8:00 PM</option>
                    <option value="20:30" className="bg-background text-foreground">8:30 PM</option>
                    <option value="21:00" className="bg-background text-foreground">9:00 PM</option>
                  </select>
                </div>
                {time && (time === '19:00' || time === '19:30' || time === '20:00') && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1 animate-pulse">
                    <Flame size={12} /> Only 2 tables left between 7 PM - 9 PM tonight.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-all duration-300 mt-8 shadow-[0_0_15px_rgba(197,160,89,0.2)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)]"
              >
                Find a Table
              </button>
            </form>
            
            <p className="text-center text-xs text-muted-foreground mt-6">
              Powered by a secure reservation system.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
