
// --- CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);

// --- IN-MEMORY SEED DATA (Fallback) ---
const SEED_DATA = {
  flights: [
    { "id": "1", "day": "Monday", "flightNumber": "FR2489", "time": "17:35 BST", "departure": "London Stansted", "arrival": "Asturias", "departureTime": "17:35", "arrivalTime": "18:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" },
    { "id": "2", "day": "Monday", "flightNumber": "FR3871", "time": "20:35 BST", "departure": "Malta", "arrival": "Venice Treviso", "departureTime": "20:35", "arrivalTime": "21:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" },
    { "id": "3", "day": "Tuesday", "flightNumber": "FR7933", "time": "16:35 BST", "departure": "Kraków", "arrival": "Podgorica", "departureTime": "16:35", "arrivalTime": "17:45", "duration": "1hr 10min", "operator": "buzz", "aircraft": "Boeing 737-800" },
    { "id": "4", "day": "Tuesday", "flightNumber": "FR8681", "time": "19:35 BST", "departure": "Bristol", "arrival": "Kaunas", "departureTime": "19:35", "arrivalTime": "20:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" },
    { "id": "5", "day": "Wednesday", "flightNumber": "FR2325", "time": "17:35 BST", "departure": "Leeds Bradford", "arrival": "Barcelona Girona", "departureTime": "17:35", "arrivalTime": "18:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" },
    { "id": "6", "day": "Wednesday", "flightNumber": "FR2489", "time": "20:35 BST", "departure": "London Stansted", "arrival": "Asturias", "departureTime": "20:35", "arrivalTime": "21:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" },
    { "id": "7", "day": "Thursday", "flightNumber": "FR3871", "time": "20:35 BST", "departure": "Malta", "arrival": "Venice Treviso", "departureTime": "20:35", "arrivalTime": "21:45", "duration": "1hr 10min", "operator": "buzz", "aircraft": "Boeing 737-800" },
    { "id": "8", "day": "Friday", "flightNumber": "FR2489", "time": "17:35 BST", "departure": "London Stansted", "arrival": "Asturias", "departureTime": "17:35", "arrivalTime": "18:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" },
    { "id": "9", "day": "Friday", "flightNumber": "FR8681", "time": "20:35 BST", "departure": "Bristol", "arrival": "Kaunas", "departureTime": "20:35", "arrivalTime": "21:45", "duration": "1hr 10min", "operator": "malta", "aircraft": "Boeing 737-800" },
    { "id": "10", "day": "Saturday", "flightNumber": "FR3871", "time": "00:35 BST", "departure": "Malta", "arrival": "Venice Treviso", "departureTime": "00:35", "arrivalTime": "01:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" },
    { "id": "11", "day": "Saturday", "flightNumber": "FR7933", "time": "15:35 BST", "departure": "Kraków", "arrival": "Podgorica", "departureTime": "15:35", "arrivalTime": "16:45", "duration": "1hr 10min", "operator": "malta", "aircraft": "Boeing 737-800" },
    { "id": "12", "day": "Saturday", "flightNumber": "FR8681", "time": "20:35 BST", "departure": "Malta", "arrival": "Venice Treviso", "departureTime": "20:35", "arrivalTime": "21:45", "duration": "1hr 10min", "operator": "buzz", "aircraft": "Boeing 737-800" },
    { "id": "13", "day": "Sunday", "flightNumber": "FR2325", "time": "00:35 BST", "departure": "London Stansted", "arrival": "Asturias", "departureTime": "00:35", "arrivalTime": "01:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" },
    { "id": "14", "day": "Sunday", "flightNumber": "FR8681", "time": "14:35 BST", "departure": "Bristol", "arrival": "Kaunas", "departureTime": "14:35", "arrivalTime": "15:45", "duration": "1hr 10min", "operator": "malta", "aircraft": "Boeing 737-800" },
    { "id": "15", "day": "Sunday", "flightNumber": "FR7933", "time": "19:35 BST", "departure": "Kraków", "arrival": "Podgorica", "departureTime": "19:35", "arrivalTime": "20:45", "duration": "1hr 10min", "operator": "buzz", "aircraft": "Boeing 737-800" },
    { "id": "16", "day": "Sunday", "flightNumber": "FR2489", "time": "23:35 BST", "departure": "Leeds Bradford", "arrival": "Barcelona Girona", "departureTime": "23:35", "arrivalTime": "00:45", "duration": "1hr 10min", "operator": "ryanairdac", "aircraft": "Boeing 737-800" }
  ],
  bookings: [],
  passengers: [],
  fares: [],
  extras: [],
  seats: [],
  staff: []
};

// Global variable for In-Memory Fallback
let memoryDb = SEED_DATA;

// --- UTILS ---
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// --- DB ABSTRACTION ---
const db = {
  async get(table, query = {}) {
    if (USE_SUPABASE) {
      let url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
      Object.entries(query).forEach(([k, v]) => url += `&${k}=eq.${v}`);
      const res = await fetch(url, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
      if (!res.ok) return [];
      return await res.json();
    } else {
      let data = memoryDb[table] || [];
      Object.entries(query).forEach(([k, v]) => data = data.filter(item => item[k] == v));
      return data;
    }
  },

  async insert(table, data) {
    if (USE_SUPABASE) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('DB Insert Failed');
      const json = await res.json();
      return json[0];
    } else {
      if (!memoryDb[table]) memoryDb[table] = [];
      memoryDb[table].push(data);
      return data;
    }
  },

  async update(table, id, data) {
    if (USE_SUPABASE) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } else {
      const idx = memoryDb[table].findIndex(i => i.id === id);
      if (idx === -1) return false;
      memoryDb[table][idx] = { ...memoryDb[table][idx], ...data };
      return true;
    }
  },

  async delete(table, id, extraQuery = {}) {
    if (USE_SUPABASE) {
      let url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
      Object.entries(extraQuery).forEach(([k, v]) => url += `&${k}=eq.${v}`);
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      return res.ok;
    } else {
      if (!memoryDb[table]) return false;
      memoryDb[table] = memoryDb[table].filter(i => {
        if (i.id !== id) return true;
        for (const [k, v] of Object.entries(extraQuery)) {
          if (i[k] != v) return true; // Keep if mismatch
        }
        return false; // Delete if match
      });
      return true;
    }
  },
  
  // Special logic for seat generation
  async ensureSeats(flightId) {
    const existing = await this.get('seats', { flight_id: flightId });
    if (existing.length > 0) return;

    const seats = [];
    for (let r = 1; r <= 10; r++) {
      for (const l of ['A','B','C','D','E','F']) {
        seats.push({ id: generateId(), flight_id: flightId, seat_number: `${r}${l}`, booking_id: null });
      }
    }
    
    if (USE_SUPABASE) {
       await fetch(`${SUPABASE_URL}/rest/v1/seats`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(seats)
      });
    } else {
      memoryDb.seats.push(...seats);
    }
  }
};


// --- HANDLER ---

async function handle(req) {
  // Polyfill Request object if needed (Netlify might provide a different event shape, but we are using standard Request in newer functions)
  // However, classic Netlify functions receive (event, context).
  // We need to map event to our logic or rewrite the logic to use event.
  // For simplicity, let's adapt the URL/Body parsing from the 'event' object.
  
  // NOTE: This function logic below expects 'req' to be a standard Request object (like Vercel Edge).
  // But for Netlify 'event', we need to adapt.
  // We will not use this handle(req) directly for Netlify.
  // We will rewrite the logic inside exports.handler to use 'db' abstraction.
  return null; 
}

exports.handler = async (event, context) => {
  const qs = event.rawQuery ? `?${event.rawQuery}` : '';
  const urlObj = new URL(`https://x${event.path}${qs}`);
  const pathName = urlObj.pathname.replace('/.netlify/functions/api','');
  
  const getBody = () => {
    if (!event.body) return {};
    return JSON.parse(event.body);
  };

  // --- /flights ---
  if (pathName.startsWith('/flights')) {
    if (event.httpMethod === 'GET') {
      const day = urlObj.searchParams.get('day');
      const id = urlObj.searchParams.get('id');
      const query = {};
      if (id) query.id = id;
      if (day) query.day = day;
      
      const res = await db.get('flights', query);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res) };
    }
    if (event.httpMethod === 'POST') {
      const p = getBody();
      const newId = generateId();
      const newFlight = { id: newId, ...p };
      await db.insert('flights', newFlight);

      // Discord Webhook
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        const siteUrl = process.env.URL || 'https://ryanair-clone.netlify.app';
        const embed = {
          embeds: [{
            color: 472464,
            fields: [
              { name: '**FLIGHT**', value: p.flightNumber || 'N/A', inline: true },
              { name: '**TIME**', value: p.departureTime || 'N/A', inline: true },
              { name: '**AIRCRAFT**', value: p.aircraft || 'Boeing 737-800', inline: true },
              { name: '**AIRPORT**', value: `${p.departure || '?'} -> ${p.arrival || '?'}`, inline: true },
              { name: '**LINK:**', value: `[Book Now](${siteUrl}/flights.html)` }
            ]
          }]
        };
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
          });
        } catch (e) { console.error('Webhook error:', e); }
      }

      return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, id: newId }) };
    }
    if (event.httpMethod === 'PUT') {
      const id = urlObj.searchParams.get('id');
      if (!id) return { statusCode: 400, body: '' };
      const p = getBody();
      const ok = await db.update('flights', id, p);
      if (!ok) return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Not found' }) };
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }
    if (event.httpMethod === 'DELETE') {
      const id = urlObj.searchParams.get('id');
      if (!id) return { statusCode: 400, body: '' };
      await db.delete('flights', id);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }
  }

  // --- /booking ---
  if (pathName.startsWith('/booking')) {
    if (event.httpMethod === 'POST') {
      const p = getBody();
      const newBookingId = generateId();
      await db.insert('bookings', { id: newBookingId, flight_id: p.flightId });
      
      if (Array.isArray(p.passengers)) {
        for (const u of p.passengers) {
          let userId = null;
          try {
            const rr = await fetch('https://users.roblox.com/v1/usernames/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [u] }) });
            const rj = await rr.json();
            userId = rj.data && rj.data[0] && rj.data[0].id ? rj.data[0].id : null;
          } catch {}
          await db.insert('passengers', { id: generateId(), booking_id: newBookingId, username: u, roblox_user_id: userId });
        }
      }
      return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, bookingId: newBookingId }) };
    }
  }

  // --- /fare ---
  if (pathName.startsWith('/fare')) {
    if (event.httpMethod === 'POST') {
      const p = getBody();
      let has = false;
      if (p.username && p.gamepassId) {
        try {
          const rr = await fetch('https://users.roblox.com/v1/usernames/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [p.username] }) });
          const rj = await rr.json();
          const uid = rj.data && rj.data[0] && rj.data[0].id;
          if (uid) {
            const inv = await fetch(`https://inventory.roblox.com/v1/users/${uid}/items/GamePass/${p.gamepassId}`);
            const ij = await inv.json();
            has = Array.isArray(ij.data) && ij.data.length > 0;
          }
        } catch {}
      }
      await db.insert('fares', { id: generateId(), booking_id: p.bookingId, type: p.type, gamepass_id: p.gamepassId, has_gamepass: has });
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, hasGamepass: has }) };
    }
  }

  // --- /seats ---
  if (pathName.startsWith('/seats')) {
    if (event.httpMethod === 'GET') {
      const flightId = urlObj.searchParams.get('flightId');
      await db.ensureSeats(flightId);
      let flightSeats = await db.get('seats', { flight_id: flightId });
      flightSeats.sort((a,b) => a.seat_number.localeCompare(b.seat_number, undefined, {numeric:true}));
      const data = flightSeats.map(s => ({ seat_number: s.seat_number, booking_id: s.booking_id }));
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }
    if (event.httpMethod === 'POST') {
      const p = getBody();
      const seats = await db.get('seats', { flight_id: p.flightId, seat_number: p.seat });
      const seat = seats[0];
      
      if (!seat) return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Seat not found' }) };
      if (seat.booking_id) return { statusCode: 409, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false }) };
      
      if (USE_SUPABASE) {
        await db.update('seats', seat.id, { booking_id: p.bookingId });
      } else {
        seat.booking_id = p.bookingId;
      }
      
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }
  }

  // --- /extras ---
  if (pathName.startsWith('/extras')) {
    if (event.httpMethod === 'POST') {
      const p = getBody();
      let has = false;
      if (p.username && p.gamepassId) {
        try {
          const rr = await fetch('https://users.roblox.com/v1/usernames/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [p.username] }) });
          const rj = await rr.json();
          const uid = rj.data && rj.data[0] && rj.data[0].id;
          if (uid) {
            const inv = await fetch(`https://inventory.roblox.com/v1/users/${uid}/items/GamePass/${p.gamepassId}`);
            const ij = await inv.json();
            has = Array.isArray(ij.data) && ij.data.length > 0;
          }
        } catch {}
      }
      await db.insert('extras', { id: generateId(), booking_id: p.bookingId, type: p.type, gamepass_id: p.gamepassId, has_gamepass: has });
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, hasGamepass: has }) };
    }
  }

  // --- /admin/flight-details ---
  if (pathName.startsWith('/admin/flight-details')) {
    if (event.httpMethod === 'GET') {
      const fid = urlObj.searchParams.get('flightId');
      const bookings = await db.get('bookings', { flight_id: fid });
      const bookingIds = bookings.map(b => b.id);
      
      let passengers = [];
      let extras = [];
      let fares = [];

      if (bookingIds.length > 0) {
         for (const bid of bookingIds) {
            const p = await db.get('passengers', { booking_id: bid });
            passengers.push(...p);
            const e = await db.get('extras', { booking_id: bid });
            extras.push(...e);
            const f = await db.get('fares', { booking_id: bid });
            fares.push(...f);
         }
      }

      const seats = await db.get('seats', { flight_id: fid });
      
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookings, passengers, seats, extras, fares }) };
    }
  }

  // --- /check-gamepass ---
  if (pathName.startsWith('/check-gamepass')) {
    if (event.httpMethod === 'POST') {
      const p = getBody();
      let has = false;
      if (p.username && p.gamepassId) {
        try {
          const rr = await fetch('https://users.roblox.com/v1/usernames/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [p.username] }) });
          const rj = await rr.json();
          const uid = rj.data && rj.data[0] && rj.data[0].id;
          if (uid) {
            const inv = await fetch(`https://inventory.roblox.com/v1/users/${uid}/items/GamePass/${p.gamepassId}`);
            const ij = await inv.json();
            has = Array.isArray(ij.data) && ij.data.length > 0;
          }
        } catch {}
      }
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, owned: has }) };
    }
  }

  // --- /diagnostics ---
  if (pathName === '/diagnostics') {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ 
      env: { 
        LOCAL_DB: !USE_SUPABASE, 
        IN_MEMORY: !USE_SUPABASE,
        SUPABASE_CONNECTED: USE_SUPABASE 
      }, 
      tables: { flights: true, seats: true, bookings: true }, 
    })};
  }

  // --- /staff ---
  if (pathName.startsWith('/staff')) {
    if (event.httpMethod === 'GET') {
      const staff = await db.get('staff');
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(staff) };
    }
    if (event.httpMethod === 'POST') {
      const p = getBody();
      const newStaff = { id: generateId(), ...p };
      await db.insert('staff', newStaff);
      return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, staff: newStaff }) };
    }
    if (event.httpMethod === 'PUT') {
      const id = urlObj.searchParams.get('id');
      if (!id) return { statusCode: 400, body: '' };
      const p = getBody();
      await db.update('staff', id, p);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }
    if (event.httpMethod === 'DELETE') {
      const id = urlObj.searchParams.get('id');
      if (!id) return { statusCode: 400, body: '' };
      await db.delete('staff', id);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }
  }

  return { statusCode: 404, body: '' };
};
