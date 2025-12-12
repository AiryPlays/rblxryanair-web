
// --- IN-MEMORY DATABASE (No external files) ---
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

// Global variable to hold state during runtime
let db = SEED_DATA;

// Simple unique ID generator
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// --- Logic ---

async function ensureSeatsForFlight(flightId) {
  // Check if we have seats for this flight
  const existing = db.seats.filter(s => s.flight_id === flightId);
  if (existing.length > 0) return;

  const seats = [];
  for (let r = 1; r <= 10; r++) {
    for (const l of ['A','B','C','D','E','F']) {
      seats.push({ id: generateId(), flight_id: flightId, seat_number: `${r}${l}`, booking_id: null });
    }
  }
  db.seats.push(...seats);
}

async function handle(req) {
  const url = new URL(req.url);
  // Support both Vercel (/api) and Netlify (/.netlify/functions/api) prefixes
  let pathName = url.pathname;
  if (pathName.startsWith('/.netlify/functions/api')) {
    pathName = pathName.replace('/.netlify/functions/api', '');
  } else if (pathName.startsWith('/api')) {
    pathName = pathName.replace('/api', '');
  }

  // --- /flights ---
  if (pathName.startsWith('/flights')) {
    if (req.method === 'GET') {
      const day = url.searchParams.get('day');
      const id = url.searchParams.get('id');
      let res = db.flights;
      if (id) res = res.filter(f => f.id === id);
      if (day) res = res.filter(f => f.day === day);
      return new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.method === 'POST') {
      const p = await req.json();
      const newId = generateId();
      const newFlight = { id: newId, ...p };
      db.flights.push(newFlight);

      // Discord Webhook
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1448415803119763668/5r9NFhpJrox3q96UU0Ddx5HBgzkujgJv9PwWLxiDU5waaGW6t-SWPnIlwQT4KCnaXRL-';
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

      return new Response(JSON.stringify({ ok: true, id: newId }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) return new Response('', { status: 400 });
      const p = await req.json();
      const idx = db.flights.findIndex(f => f.id === id);
      if (idx === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      
      db.flights[idx] = { ...db.flights[idx], ...p };
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return new Response('', { status: 400 });
      db.flights = db.flights.filter(f => f.id !== id);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // --- /booking ---
  if (pathName.startsWith('/booking')) {
    if (req.method === 'POST') {
      const p = await req.json();
      const newBookingId = generateId();
      db.bookings.push({ id: newBookingId, flight_id: p.flightId, created_at: new Date().toISOString() });
      
      if (Array.isArray(p.passengers)) {
        for (const u of p.passengers) {
          let userId = null;
          try {
            const rr = await fetch('https://users.roblox.com/v1/usernames/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [u] }) });
            const rj = await rr.json();
            userId = rj.data && rj.data[0] && rj.data[0].id ? rj.data[0].id : null;
          } catch {}
          db.passengers.push({ id: generateId(), booking_id: newBookingId, username: u, roblox_user_id: userId });
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
      db.fares.push({ id: generateId(), booking_id: p.bookingId, type: p.type, gamepass_id: p.gamepassId, has_gamepass: has });
      return new Response(JSON.stringify({ ok: true, hasGamepass: has }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // --- /seats ---
  if (pathName.startsWith('/seats')) {
    if (req.method === 'GET') {
      const flightId = url.searchParams.get('flightId');
      await ensureSeatsForFlight(flightId);
      const flightSeats = db.seats.filter(s => s.flight_id === flightId).sort((a,b) => a.seat_number.localeCompare(b.seat_number, undefined, {numeric:true}));
      const data = flightSeats.map(s => ({ seat_number: s.seat_number, booking_id: s.booking_id }));
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.method === 'POST') {
      const p = await req.json();
      const seat = db.seats.find(s => s.flight_id === p.flightId && s.seat_number === p.seat);
      if (!seat) return new Response(JSON.stringify({ error: 'Seat not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      if (seat.booking_id) return new Response(JSON.stringify({ ok: false }), { status: 409, headers: { 'Content-Type': 'application/json' } });
      
      seat.booking_id = p.bookingId;
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.method === 'DELETE') {
      const p = await req.json();
      const seat = db.seats.find(s => s.flight_id === p.flightId && s.seat_number === p.seat && s.booking_id === p.bookingId);
      if (seat) {
        seat.booking_id = null;
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
      db.extras.push({ id: generateId(), booking_id: p.bookingId, type: p.type, gamepass_id: p.gamepassId, has_gamepass: has });
      return new Response(JSON.stringify({ ok: true, hasGamepass: has }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // --- /admin/flight-details ---
  if (pathName.startsWith('/admin/flight-details')) {
    if (req.method === 'GET') {
      const fid = url.searchParams.get('flightId');
      const bookings = db.bookings.filter(b => b.flight_id === fid);
      const bookingIds = bookings.map(b => b.id);
      
      const passengers = db.passengers.filter(p => bookingIds.includes(p.booking_id));
      const seats = db.seats.filter(s => s.flight_id === fid);
      const extras = db.extras.filter(e => bookingIds.includes(e.booking_id));
      const fares = db.fares.filter(f => bookingIds.includes(f.booking_id));
      
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
      env: { LOCAL_DB: true, IN_MEMORY: true }, 
      tables: { flights: true, seats: true, bookings: true }, 
      supabaseReady: true 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // --- /staff ---
  if (pathName.startsWith('/staff')) {
    if (req.method === 'GET') {
      return new Response(JSON.stringify(db.staff || []), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.method === 'POST') {
      const p = await req.json();
      const newStaff = { id: generateId(), ...p };
      if (!db.staff) db.staff = [];
      db.staff.push(newStaff);
      return new Response(JSON.stringify({ ok: true, staff: newStaff }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) return new Response('', { status: 400 });
      const p = await req.json();
      if (!db.staff) db.staff = [];
      const idx = db.staff.findIndex(s => s.id === id);
      if (idx !== -1) {
        db.staff[idx] = { ...db.staff[idx], ...p };
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return new Response('', { status: 400 });
      if (db.staff) {
        db.staff = db.staff.filter(s => s.id !== id);
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
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
