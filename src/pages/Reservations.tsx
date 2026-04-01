import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, Flame, Check } from 'lucide-react';
import { io } from 'socket.io-client';
import { format, addDays } from 'date-fns';

const socket = io();

export function Reservations() {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('');
  const [experience, setExperience] = useState('standard');
  const [availability, setAvailability] = useState<{time: string, available: boolean, remaining: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  const fetchAvailability = async () => {
    if (!date || !guests) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/availability?date=${date}&guests=${guests}&type=${experience}`);
      const data = await res.json();
      setAvailability(data);
      // Reset time if selected time is no longer available
      const selectedSlot = data.find((s: any) => s.time === time);
      if (!selectedSlot || !selectedSlot.available) {
        setTime('');
      }
    } catch (err) {
      console.error('Failed to fetch availability', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [date, guests, experience]);

  useEffect(() => {
    socket.on('availability_changed', (data) => {
      if (data.date === date) {
        fetchAvailability();
      }
    });
    return () => {
      socket.off('availability_changed');
    };
  }, [date, guests, experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !customerName || !phone) return;
    
    setBookingStatus('submitting');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          date,
          time_slot: time,
          guests,
          type: experience
        })
      });
      
      if (!res.ok) throw new Error('Booking failed');
      
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
    }
  };

  if (bookingStatus === 'success') {
    return (
      <div className="bg-background min-h-screen pt-32 pb-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md w-full px-6">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} />
          </div>
          <h2 className="text-4xl font-serif text-foreground mb-4">Reservation Confirmed</h2>
          <p className="text-muted-foreground mb-8">We look forward to welcoming you, {customerName}.</p>
          
          <div className="bg-[#050505] border border-border/50 p-6 text-left mb-8 space-y-4">
            <div className="flex justify-between border-b border-border/20 pb-4">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Date</span>
              <span className="text-foreground font-medium">{format(new Date(date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between border-b border-border/20 pb-4">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Time</span>
              <span className="text-foreground font-medium">{time}</span>
            </div>
            <div className="flex justify-between border-b border-border/20 pb-4">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Guests</span>
              <span className="text-foreground font-medium">{guests} People</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Experience</span>
              <span className="text-primary font-medium">{experience === 'omakase' ? 'Omakase Counter' : 'Dining Room'}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              setBookingStatus('idle');
              setCustomerName('');
              setPhone('');
              setTime('');
            }} 
            className="w-full px-8 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
          >
            Book Another Table
          </button>
        </motion.div>
      </div>
    );
  }

  const selectedSlotData = availability.find(a => a.time === time);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
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
              <div className="bg-[#0a0a0a] border border-border/50 p-6 relative overflow-hidden group cursor-pointer" onClick={() => setExperience('standard')}>
                <div className={`absolute inset-0 border-2 transition-colors duration-300 ${experience === 'standard' ? 'border-primary' : 'border-transparent'}`} />
                <h3 className="text-xl font-serif text-foreground mb-2 flex items-center gap-2">
                  The Dining Room
                  {experience === 'standard' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#050505] border border-border/50 p-8 md:p-12 shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <h2 className="text-2xl font-serif text-foreground mb-8 text-center">Secure Your Reservation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
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
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Date</label>
                  <div className="flex items-center border-b border-muted-foreground/30 py-2">
                    <CalendarIcon className="text-primary mr-4" size={20} />
                    <input 
                      type="date" 
                      value={date}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-transparent text-foreground w-full focus:outline-none cursor-pointer [color-scheme:dark]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Time</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-sm">Checking availability...</span>
                    </div>
                  ) : availability.length > 0 ? (
                    availability.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setTime(slot.time)}
                        className={`py-2 text-sm border transition-colors ${
                          time === slot.time 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : slot.available 
                              ? 'border-border/50 text-foreground hover:border-primary/50' 
                              : 'border-border/20 text-muted-foreground/30 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-sm text-muted-foreground py-4">No slots available</div>
                  )}
                </div>
                {selectedSlotData && selectedSlotData.remaining <= 2 && (
                  <p className="text-xs text-red-400 mt-3 flex items-center gap-1 animate-pulse">
                    <Flame size={12} /> Only {selectedSlotData.remaining} {experience === 'omakase' ? 'seats' : 'tables'} left for {time}.
                  </p>
                )}
              </div>

              {time && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-border/50">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Name</label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-transparent border-b border-muted-foreground/30 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Phone (WhatsApp)</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-transparent border-b border-muted-foreground/30 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {bookingStatus === 'error' && (
                <p className="text-red-400 text-sm text-center">Failed to secure reservation. Please try another time.</p>
              )}

              <button
                type="submit"
                disabled={!time || bookingStatus === 'submitting'}
                className="w-full py-4 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingStatus === 'submitting' ? 'Securing Table...' : 'Confirm Reservation'}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
