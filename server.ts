import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Database from 'better-sqlite3';
import path from 'path';

const PORT = 3000;

// Initialize SQLite Database
const db = new Database('zutto.db');

// Setup Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    guests INTEGER NOT NULL,
    table_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(table_id) REFERENCES tables(id)
  );
`);

// Seed tables if empty
const tableCount = db.prepare('SELECT COUNT(*) as count FROM tables').get() as { count: number };
if (tableCount.count === 0) {
  const insertTable = db.prepare('INSERT INTO tables (name, capacity, type) VALUES (?, ?, ?)');
  const insertMany = db.transaction(() => {
    // 4 tables of 2 pax
    for (let i = 1; i <= 4; i++) insertTable.run(`T2-${i}`, 2, 'standard');
    // 4 tables of 4 pax
    for (let i = 1; i <= 4; i++) insertTable.run(`T4-${i}`, 4, 'standard');
    // 2 tables of 6 pax
    for (let i = 1; i <= 2; i++) insertTable.run(`T6-${i}`, 6, 'standard');
    // 8 omakase seats (treated as individual 1-pax "tables" for booking simplicity, or a single counter)
    for (let i = 1; i <= 8; i++) insertTable.run(`OMA-${i}`, 1, 'omakase');
  });
  insertMany();
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  app.use(express.json());

  // API Routes
  
  // Get availability for a specific date
  app.get('/api/availability', (req, res) => {
    const { date, guests, type } = req.query;
    if (!date || !guests) return res.status(400).json({ error: 'Missing date or guests' });
    
    const requestedGuests = parseInt(guests as string, 10);
    const tableType = type === 'omakase' ? 'omakase' : 'standard';

    // Operating hours: 17:00 to 22:00 (last seating)
    const timeSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
    
    const availability = timeSlots.map(slot => {
      // Find tables that can fit the guests and are of the requested type
      // For omakase, we need N seats available at the same time
      
      let availableTablesCount = 0;
      
      if (tableType === 'omakase') {
        // Count available omakase seats
        const bookedOmakase = db.prepare(`
          SELECT COUNT(*) as count FROM reservations 
          JOIN tables ON reservations.table_id = tables.id
          WHERE date = ? AND time_slot = ? AND status != 'cancelled' AND tables.type = 'omakase'
        `).get(date, slot) as { count: number };
        
        const totalOmakase = 8; // Hardcoded from seed
        const remaining = totalOmakase - bookedOmakase.count;
        availableTablesCount = remaining >= requestedGuests ? remaining : 0;
      } else {
        // Standard tables: Find tables with capacity >= requestedGuests
        // that are NOT booked for this date and time slot
        const availableTables = db.prepare(`
          SELECT COUNT(*) as count FROM tables 
          WHERE capacity >= ? AND type = 'standard' AND id NOT IN (
            SELECT table_id FROM reservations 
            WHERE date = ? AND time_slot = ? AND status != 'cancelled'
          )
        `).get(requestedGuests, date, slot) as { count: number };
        
        availableTablesCount = availableTables.count;
      }

      return {
        time: slot,
        available: availableTablesCount > 0,
        remaining: availableTablesCount
      };
    });

    res.json(availability);
  });

  // Create a reservation
  app.post('/api/reservations', (req, res) => {
    const { customer_name, phone, date, time_slot, guests, type, notes } = req.body;
    
    if (!customer_name || !phone || !date || !time_slot || !guests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tableType = type === 'omakase' ? 'omakase' : 'standard';

    try {
      // Use a transaction to prevent race conditions
      const createBooking = db.transaction(() => {
        let assignedTableIds: number[] = [];

        if (tableType === 'omakase') {
          // Find N available omakase seats
          const availableSeats = db.prepare(`
            SELECT id FROM tables 
            WHERE type = 'omakase' AND id NOT IN (
              SELECT table_id FROM reservations 
              WHERE date = ? AND time_slot = ? AND status != 'cancelled'
            ) LIMIT ?
          `).all(date, time_slot, guests) as { id: number }[];

          if (availableSeats.length < guests) {
            throw new Error('Not enough omakase seats available');
          }
          assignedTableIds = availableSeats.map(s => s.id);
        } else {
          // Find 1 standard table that fits the guests
          const availableTable = db.prepare(`
            SELECT id FROM tables 
            WHERE capacity >= ? AND type = 'standard' AND id NOT IN (
              SELECT table_id FROM reservations 
              WHERE date = ? AND time_slot = ? AND status != 'cancelled'
            ) ORDER BY capacity ASC LIMIT 1
          `).get(guests, date, time_slot) as { id: number } | undefined;

          if (!availableTable) {
            throw new Error('No tables available for this time slot');
          }
          assignedTableIds = [availableTable.id];
        }

        // Insert reservations
        const insertStmt = db.prepare(`
          INSERT INTO reservations (customer_name, phone, date, time_slot, guests, table_id, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        // If omakase, we create a reservation record for each seat, or one record linked to multiple?
        // For simplicity, if omakase, we create multiple records or just assign the first seat ID and note the guests.
        // Actually, better schema: reservations table has table_id. If 2 omakase seats, we need 2 records or a join table.
        // Let's just create 1 reservation per seat for omakase to block them.
        const reservationIds = [];
        for (const tid of assignedTableIds) {
          const result = insertStmt.run(customer_name, phone, date, time_slot, tableType === 'omakase' ? 1 : guests, tid, notes || '');
          reservationIds.push(result.lastInsertRowid);
        }
        
        return reservationIds;
      });

      const ids = createBooking();
      
      // Emit real-time update
      io.emit('availability_changed', { date, time_slot });
      
      res.json({ success: true, reservationIds: ids });
    } catch (error: any) {
      res.status(409).json({ error: error.message });
    }
  });

  // Admin: Get all reservations
  app.get('/api/admin/reservations', (req, res) => {
    const { date } = req.query;
    let query = `
      SELECT r.*, t.name as table_name, t.type as table_type 
      FROM reservations r
      JOIN tables t ON r.table_id = t.id
    `;
    const params: any[] = [];
    
    if (date) {
      query += ' WHERE r.date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY r.date DESC, r.time_slot ASC';
    
    const reservations = db.prepare(query).all(...params);
    res.json(reservations);
  });

  // Admin: Update reservation status
  app.put('/api/admin/reservations/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed', 'cancelled', 'seated', 'completed'
    
    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
    
    // Get the reservation to emit the right date/time
    const resRecord = db.prepare('SELECT date, time_slot FROM reservations WHERE id = ?').get(id) as any;
    if (resRecord) {
      io.emit('availability_changed', { date: resRecord.date, time_slot: resRecord.time_slot });
      io.emit('admin_reservations_changed');
    }
    
    res.json({ success: true });
  });

  // Admin: Get all tables
  app.get('/api/admin/tables', (req, res) => {
    const tables = db.prepare('SELECT * FROM tables ORDER BY type, capacity, name').all();
    res.json(tables);
  });

  // Admin: Get occupancy for a specific date and time slot
  app.get('/api/admin/occupancy', (req, res) => {
    const { date, time_slot } = req.query;
    if (!date || !time_slot) return res.status(400).json({ error: 'Missing date or time_slot' });
    
    const reservations = db.prepare(`
      SELECT r.*, t.name as table_name, t.type as table_type 
      FROM reservations r
      JOIN tables t ON r.table_id = t.id
      WHERE r.date = ? AND r.time_slot = ? AND r.status != 'cancelled'
    `).all(date, time_slot);
    res.json(reservations);
  });

  // Admin: Block a table
  app.post('/api/admin/block', (req, res) => {
    const { date, time_slot, table_id, notes } = req.body;
    if (!date || !time_slot || !table_id) return res.status(400).json({ error: 'Missing required fields' });
    
    try {
      const stmt = db.prepare(`
        INSERT INTO reservations (customer_name, phone, date, time_slot, guests, table_id, status, notes)
        VALUES ('BLOCKED', 'N/A', ?, ?, 0, ?, 'blocked', ?)
      `);
      stmt.run(date, time_slot, table_id, notes || 'Manually blocked');
      io.emit('admin_reservations_changed');
      io.emit('availability_changed', { date });
      res.json({ success: true });
    } catch (error) {
      console.error('Error blocking table:', error);
      res.status(500).json({ error: 'Failed to block table' });
    }
  });

  // Admin: Get table stats
  app.get('/api/admin/stats', (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Missing date' });

    const totalTables = db.prepare("SELECT COUNT(*) as count FROM tables WHERE type = 'standard'").get() as any;
    const totalOmakase = db.prepare("SELECT COUNT(*) as count FROM tables WHERE type = 'omakase'").get() as any;
    
    const bookedToday = db.prepare("SELECT COUNT(DISTINCT id) as count FROM reservations WHERE date = ? AND status != 'cancelled'").get(date) as any;
    const cancelledToday = db.prepare("SELECT COUNT(DISTINCT id) as count FROM reservations WHERE date = ? AND status = 'cancelled'").get(date) as any;
    const noShowToday = db.prepare("SELECT COUNT(DISTINCT id) as count FROM reservations WHERE date = ? AND status = 'no-show'").get(date) as any;

    res.json({
      totalStandardTables: totalTables.count,
      totalOmakaseSeats: totalOmakase.count,
      bookedToday: bookedToday.count,
      cancelledToday: cancelledToday.count,
      noShowToday: noShowToday.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
