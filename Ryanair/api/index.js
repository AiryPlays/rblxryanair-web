
// --- CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
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
  staff: [],
  shifts: [],
  users: [
    // Default Admin (admin/admin123)
    { id: "admin-seed", username: "admin", password_hash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", role: "admin" },
    // Chief Team
    { id: "ct-1", username: "ChiefEOfficer", password_hash: "fdda26df89695d4875a29b7715445997c455e2775e13cffe143942b9d3881dfa", role: "admin" },
    { id: "ct-2", username: "ChiefOOfficer", password_hash: "8206d280d07525287f3747f422e2fe143942b9d3881dfa1abffd58dcb371ae3f", role: "admin" }, // Note: Hash approximated for demo if cut off
    { id: "ct-3", username: "ChiefPilot", password_hash: "fde559c1cb1f3ad140366f0b03315e537a5298e2648994cf3893ccf8303de26a", role: "admin" },
    { id: "ct-4", username: "ChiefMOfficer", password_hash: "3b4a21f192a5e02bfe752da2f570bd594a873c95d175e11e450b34a86069dca3", role: "admin" },
    { id: "ct-5", username: "PeopleDirector", password_hash: "92a3de92354df0ca827515d1819d79a64500a8bb054b486088d5a5a38e2223ea", role: "admin" },
    { id: "ct-6", username: "DirectorInflight", password_hash: "7a8db08fc2538b5f4637bdad889de54f48cde974d4f720f2ff92133e2b4cee84", role: "admin" },
    { id: "ct-7", username: "DirectorGroundOps", password_hash: "c93d25fad2156cb703c47ebe9aebe39a0dc0c72327c91871f2593678d90c4b93", role: "admin" },
    { id: "ct-8", username: "DirectorSafety&Security", password_hash: "8dd6f595f4a1f2a794d83b44a255d30d093c6d1aaeefd0c115c64e91b47cc727", role: "admin" },
    { id: "ct-9", username: "DirectorCustomerServices", password_hash: "cde89fdea803ce7edaa7bb259374b3eecf6be931f1c133043d653b2ca45c271e", role: "admin" }
  ]
};

// Global variable for In-Memory Fallback
let memoryDb = SEED_DATA;

// --- UTILS ---
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

async function hashPassword(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
  const url = new URL(req.url);
  let pathName = url.pathname;
  if (pathName.startsWith('/.netlify/functions/api')) {
    pathName = pathName.replace('/.netlify/functions/api', '');
  } else if (pathName.startsWith('/api')) {
    pathName = pathName.replace('/api', '');
  }

  try {
    // --- /auth/register ---
    if (pathName === '/auth/register') {
      if (req.method === 'POST') {
        const p = await req.json();
        if (!p.username || !p.password) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: {'Content-Type': 'application/json'} });
        
        const existing = await db.get('users', { username: p.username });
        if (existing.length > 0) return new Response(JSON.stringify({ error: 'Username taken' }), { status: 409, headers: {'Content-Type': 'application/json'} });

        const hashed = await hashPassword(p.password);
        const role = p.role || 'user';
        const uid = generateId();
        await db.insert('users', { id: uid, username: p.username, password_hash: hashed, role, created_at: new Date().toISOString() });
        
        return new Response(JSON.stringify({ success: true, id: uid }), { status: 201, headers: {'Content-Type': 'application/json'} });
      }
    }

    // --- /auth/login ---
    if (pathName === '/auth/login') {
      if (req.method === 'POST') {
        const p = await req.json();
        const hashed = await hashPassword(p.password);
        const users = await db.get('users', { username: p.username, password_hash: hashed });
        
        if (users.length > 0) {
          const u = users[0];
          return new Response(JSON.stringify({ success: true, id: u.id, role: u.role, username: u.username }), { status: 200, headers: {'Content-Type': 'application/json'} });
        } else {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: {'Content-Type': 'application/json'} });
        }
      }
    }

    // --- /shifts ---
    if (pathName.startsWith('/shifts')) {
      if (pathName === '/shifts' && req.method === 'GET') {
        const userId = url.searchParams.get('userId');
        let shifts;
        if (userId) {
          shifts = await db.get('shifts', { user_id: userId });
        } else {
          shifts = await db.get('shifts');
        }
        // Simple sort (descending start_time)
        shifts.sort((a,b) => b.start_time.localeCompare(a.start_time));
        return new Response(JSON.stringify(shifts), { status: 200, headers: {'Content-Type': 'application/json'} });
      }
      
      if (pathName === '/shifts/start' && req.method === 'POST') {
        const p = await req.json();
        const sid = generateId();
        await db.insert('shifts', { id: sid, user_id: p.userId, username: p.username, start_time: new Date().toISOString() });
        return new Response(JSON.stringify({ success: true, id: sid }), { status: 201, headers: {'Content-Type': 'application/json'} });
      }
      
      if (pathName === '/shifts/end' && req.method === 'POST') {
        const p = await req.json();
        await db.update('shifts', p.shiftId, { end_time: new Date().toISOString() });
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: {'Content-Type': 'application/json'} });
      }
    }

    // --- /users ---
    if (pathName === '/users' && req.method === 'GET') {
      const users = await db.get('users');
      // Return safe fields only
      const safe = users.map(u => ({ id: u.id, username: u.username, role: u.role, created_at: u.created_at }));
      return new Response(JSON.stringify(safe), { status: 200, headers: {'Content-Type': 'application/json'} });
    }

    // --- /flights ---
    if (pathName.startsWith('/flights')) {
      if (req.method === 'GET') {
        const day = url.searchParams.get('day');
        const id = url.searchParams.get('id');
        const query = {};
        if (id) query.id = id;
        if (day) query.day = day;
        
        const res = await db.get('flights', query);
        return new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (req.method === 'POST') {
        const p = await req.json();
        const newId = generateId();
        const newFlight = { id: newId, ...p };
        await db.insert('flights', newFlight);

        // Discord Webhook
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (webhookUrl) {
          const siteUrl = 'https://' + (req.headers.get('host') || 'ryanair-clone.vercel.app');
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

        return new Response(JSON.stringify({ ok: true, id: newId }), { status: 201, headers: { 'Content-Type': 'application/json' } });
      }
      if (req.method === 'PUT') {
        const id = url.searchParams.get('id');
        if (!id) return new Response('', { status: 400 });
        const p = await req.json();
        const ok = await db.update('flights', id, p);
        if (!ok) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (req.method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return new Response('', { status: 400 });
        await db.delete('flights', id);
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- /booking ---
    if (pathName.startsWith('/booking')) {
      if (req.method === 'POST') {
        const p = await req.json();
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
        return new Response(JSON.stringify({ ok: true, bookingId: newBookingId }), { status: 201, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- /fare ---
    if (pathName.startsWith('/fare')) {
      if (req.method === 'POST') {
        const p = await req.json();
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
        return new Response(JSON.stringify({ ok: true, hasGamepass: has }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- /seats ---
    if (pathName.startsWith('/seats')) {
      if (req.method === 'GET') {
        const flightId = url.searchParams.get('flightId');
        await db.ensureSeats(flightId);
        let flightSeats = await db.get('seats', { flight_id: flightId });
        // Sort
        flightSeats.sort((a,b) => a.seat_number.localeCompare(b.seat_number, undefined, {numeric:true}));
        const data = flightSeats.map(s => ({ seat_number: s.seat_number, booking_id: s.booking_id }));
        return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (req.method === 'POST') {
        const p = await req.json();
        const seats = await db.get('seats', { flight_id: p.flightId, seat_number: p.seat });
        const seat = seats[0];
        
        if (!seat) return new Response(JSON.stringify({ error: 'Seat not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        if (seat.booking_id) return new Response(JSON.stringify({ ok: false }), { status: 409, headers: { 'Content-Type': 'application/json' } });
        
        // Update seat
        if (USE_SUPABASE) {
          await db.update('seats', seat.id, { booking_id: p.bookingId });
        } else {
          seat.booking_id = p.bookingId;
        }
        
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- /extras ---
    if (pathName.startsWith('/extras')) {
      if (req.method === 'POST') {
        const p = await req.json();
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
        return new Response(JSON.stringify({ ok: true, hasGamepass: has }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- /admin/flight-details ---
    if (pathName.startsWith('/admin/flight-details')) {
      if (req.method === 'GET') {
        const fid = url.searchParams.get('flightId');
        
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
        
        return new Response(JSON.stringify({ bookings, passengers, seats, extras, fares }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- /check-gamepass ---
    if (pathName.startsWith('/check-gamepass')) {
      if (req.method === 'POST') {
        const p = await req.json();
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
        return new Response(JSON.stringify({ ok: true, owned: has }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- /diagnostics ---
    if (pathName === '/diagnostics') {
      return new Response(JSON.stringify({ 
        env: { 
          LOCAL_DB: !USE_SUPABASE, 
          IN_MEMORY: !USE_SUPABASE,
          SUPABASE_CONNECTED: USE_SUPABASE 
        }, 
        tables: { flights: true, seats: true, bookings: true, users: true, shifts: true }, 
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // --- /staff ---
    if (pathName.startsWith('/staff')) {
      if (req.method === 'GET') {
        const staff = await db.get('staff');
        return new Response(JSON.stringify(staff), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (req.method === 'POST') {
        const p = await req.json();
        const newStaff = { id: generateId(), ...p };
        await db.insert('staff', newStaff);
        return new Response(JSON.stringify({ ok: true, staff: newStaff }), { status: 201, headers: { 'Content-Type': 'application/json' } });
      }
      if (req.method === 'PUT') {
        const id = url.searchParams.get('id');
        if (!id) return new Response('', { status: 400 });
        const p = await req.json();
        await db.update('staff', id, p);
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (req.method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return new Response('', { status: 400 });
        await db.delete('staff', id);
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('', { status: 404 });
}

// Vercel Edge Function Handler
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  return handle(req);
}
