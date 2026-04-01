import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, Clock, Check, X, RefreshCw, UserMinus } from 'lucide-react';

const socket = io();

type Reservation = {
  id: number;
  customer_name: string;
  phone: string;
  date: string;
  time_slot: string;
  guests: number;
  table_name: string;
  table_type: string;
  status: string;
  notes: string;
};

type Stats = {
  totalStandardTables: number;
  totalOmakaseSeats: number;
  bookedToday: number;
  cancelledToday: number;
  noShowToday: number;
};

export function Admin() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'inventory'>('list');
  const [tables, setTables] = useState<any[]>([]);
  const [occupancy, setOccupancy] = useState<Reservation[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('19:00');

  const timeSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resData, statsData, tablesData, occupancyData] = await Promise.all([
        fetch(`/api/admin/reservations?date=${date}`).then(r => r.json()),
        fetch(`/api/admin/stats?date=${date}`).then(r => r.json()),
        fetch(`/api/admin/tables`).then(r => r.json()),
        fetch(`/api/admin/occupancy?date=${date}&time_slot=${selectedTimeSlot}`).then(r => r.json())
      ]);
      setReservations(resData);
      setStats(statsData);
      setTables(tablesData);
      setOccupancy(occupancyData);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date, selectedTimeSlot]);

  useEffect(() => {
    socket.on('admin_reservations_changed', () => {
      fetchData();
    });
    socket.on('availability_changed', (data) => {
      if (data.date === date) {
        fetchData();
      }
    });
    return () => {
      socket.off('admin_reservations_changed');
      socket.off('availability_changed');
    };
  }, [date]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      // Optimistic update
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const blockTable = async (tableId: number) => {
    try {
      await fetch('/api/admin/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time_slot: selectedTimeSlot, table_id: tableId })
      });
      fetchData();
    } catch (err) {
      console.error('Failed to block table', err);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif text-foreground mb-2">Reservation Control</h1>
            <p className="text-muted-foreground">Live table inventory and booking management.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0a0a0a] border border-border/50 p-2 rounded-sm">
            <CalendarIcon className="text-primary ml-2" size={20} />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer [color-scheme:dark] px-2"
            />
            <button onClick={fetchData} className="p-2 hover:bg-muted rounded-sm transition-colors" title="Refresh">
              <RefreshCw size={18} className={loading ? 'animate-spin text-primary' : 'text-muted-foreground'} />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <div className="bg-[#050505] border border-border/50 p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Total Standard Tables</p>
              <p className="text-3xl font-serif text-foreground">{stats.totalStandardTables}</p>
            </div>
            <div className="bg-[#050505] border border-border/50 p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Total Omakase Seats</p>
              <p className="text-3xl font-serif text-foreground">{stats.totalOmakaseSeats}</p>
            </div>
            <div className="bg-[#050505] border border-primary/30 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />
              <p className="text-xs uppercase tracking-widest text-primary mb-2">Booked Today</p>
              <p className="text-3xl font-serif text-foreground">{stats.bookedToday}</p>
            </div>
            <div className="bg-[#050505] border border-border/50 p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Cancellations</p>
              <p className="text-3xl font-serif text-red-400">{stats.cancelledToday}</p>
            </div>
            <div className="bg-[#050505] border border-border/50 p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">No-Shows</p>
              <p className="text-3xl font-serif text-orange-500">{stats.noShowToday}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border/50 mb-8">
          <button
            className={`px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === 'list' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('list')}
          >
            Reservations List
          </button>
          <button
            className={`px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === 'inventory' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Floor Plan & Inventory
          </button>
        </div>

        {activeTab === 'list' ? (
          <div className="bg-[#050505] border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-[#0a0a0a]">
                  <th className="p-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">Time</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">Guest</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">Party</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">Table</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">Status</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-muted-foreground font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No reservations found for this date.
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res.id} className="border-b border-border/20 hover:bg-[#0a0a0a] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <Clock size={16} className="text-primary" />
                          {res.time_slot}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-foreground font-medium">{res.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{res.phone}</p>
                        {res.notes && <p className="text-xs text-primary/80 mt-1 italic">Note: {res.notes}</p>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-foreground">
                          <Users size={16} className="text-muted-foreground" />
                          {res.guests}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-foreground">{res.table_name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{res.table_type}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs uppercase tracking-widest font-medium rounded-sm ${
                          res.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          res.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          res.status === 'seated' ? 'bg-primary/10 text-primary border border-primary/20' :
                          res.status === 'no-show' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                          'bg-muted text-muted-foreground border border-border/50'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {res.status !== 'cancelled' && res.status !== 'seated' && res.status !== 'no-show' && (
                            <>
                              <button 
                                onClick={() => updateStatus(res.id, 'seated')}
                                className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm"
                                title="Mark as Seated"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={() => updateStatus(res.id, 'no-show')}
                                className="p-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors rounded-sm"
                                title="Mark as No-Show"
                              >
                                <UserMinus size={16} />
                              </button>
                              <button 
                                onClick={() => updateStatus(res.id, 'cancelled')}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
                                title="Cancel Reservation"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        ) : (
          <div className="space-y-8">
            <div className="flex gap-2 overflow-x-auto pb-4">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`px-4 py-2 text-sm border transition-colors whitespace-nowrap ${
                    selectedTimeSlot === slot
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map(table => {
                const isOccupied = occupancy.find(r => r.table_id === table.id);
                return (
                  <div key={table.id} className={`p-6 border ${isOccupied ? 'bg-primary/5 border-primary/30' : 'bg-[#050505] border-border/50'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-serif text-foreground">{table.name}</h3>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{table.type} • {table.capacity} Seats</p>
                      </div>
                      <div className={`px-2 py-1 text-xs uppercase tracking-widest font-medium rounded-sm ${isOccupied ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'}`}>
                        {isOccupied ? isOccupied.status : 'Available'}
                      </div>
                    </div>
                    
                    {isOccupied ? (
                      <div className="space-y-2 text-sm">
                        <p className="text-foreground"><span className="text-muted-foreground">Guest:</span> {isOccupied.customer_name}</p>
                        <p className="text-foreground"><span className="text-muted-foreground">Party:</span> {isOccupied.guests}</p>
                        {isOccupied.notes && <p className="text-primary/80 italic text-xs">Note: {isOccupied.notes}</p>}
                        {isOccupied.status !== 'cancelled' && (
                          <button 
                            onClick={() => updateStatus(isOccupied.id, 'cancelled')}
                            className="mt-4 w-full py-2 text-xs uppercase tracking-widest text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                          >
                            Cancel Reservation
                          </button>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => blockTable(table.id)}
                        className="mt-4 w-full py-2 text-xs uppercase tracking-widest text-muted-foreground border border-border/50 hover:bg-white/5 hover:text-foreground transition-colors"
                      >
                        Block Table
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
