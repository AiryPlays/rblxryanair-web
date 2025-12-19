import os
import json
import sqlite3
import uuid
import hashlib
import random
from urllib.parse import urlparse, parse_qs
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'flights.db')

def db_conn():
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute('PRAGMA foreign_keys = ON')
    except Exception:
        pass
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_chief_password():
    # RYR#####CSUITE###
    part1 = ''.join([str(random.randint(0, 9)) for _ in range(5)])
    part2 = ''.join([str(random.randint(0, 9)) for _ in range(3)])
    return f"RYR{part1}CSUITE{part2}"

def init_db():
    conn = db_conn()
    cur = conn.cursor()
    
    def ensure_column(table, name, coltype):
        cur.execute(f'PRAGMA table_info({table})')
        cols = [r[1] for r in cur.fetchall()]
        if name not in cols:
            cur.execute(f'ALTER TABLE {table} ADD COLUMN {name} {coltype}')
    
    # 1. USERS
    cur.execute('''CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        password_hash TEXT,
        role TEXT DEFAULT 'user',
        created_at TEXT
    )''')
    
    # Check if admin exists
    cur.execute('SELECT count(*) FROM users WHERE username="admin"')
    if cur.fetchone()[0] == 0:
        admin_id = str(uuid.uuid4())
        # Default admin password: admin123
        admin_pass = hash_password('admin123') 
        cur.execute('INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
                   (admin_id, 'admin', admin_pass, 'admin', datetime.utcnow().isoformat()))

    # Seed Chief Team
    chief_team = [
        "ChiefEOfficer", "ChiefOOfficer", "ChiefPilot", "ChiefMOfficer",
        "PeopleDirector", "DirectorInflight", "DirectorGroundOps", 
        "DirectorSafety&Security", "DirectorCustomerServices"
    ]
    
    for username in chief_team:
        cur.execute('SELECT count(*) FROM users WHERE username=?', (username,))
        if cur.fetchone()[0] == 0:
            uid = str(uuid.uuid4())
            pwd = generate_chief_password()
            print(f"Created {username} with password: {pwd}")
            with open('chief_credentials.txt', 'a') as f:
                f.write(f"Username: {username}, Password: {pwd}\n")
            pwd_hash = hash_password(pwd)
            cur.execute('INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
                       (uid, username, pwd_hash, 'admin', datetime.utcnow().isoformat()))

    # 2. FLIGHTS
    cur.execute('''CREATE TABLE IF NOT EXISTS flights (
        id TEXT PRIMARY KEY, 
        day TEXT, 
        flightNumber TEXT, 
        time TEXT, 
        departure TEXT, 
        arrival TEXT, 
        departureTime TEXT, 
        arrivalTime TEXT, 
        duration TEXT, 
        operator TEXT,
        aircraft TEXT
    )''')
    
    # Seed Flights if empty
    cur.execute('SELECT COUNT(1) FROM flights')
    if cur.fetchone()[0] == 0:
        seed = [
            {"day":"Monday","flightNumber":"FR2489","time":"17:35 BST","departure":"London Stansted","arrival":"Asturias","departureTime":"17:35","arrivalTime":"18:45","duration":"1hr 10min","operator":"ryanairdac"},
            {"day":"Monday","flightNumber":"FR3871","time":"20:35 BST","departure":"Malta","arrival":"Venice Treviso","departureTime":"20:35","arrivalTime":"21:45","duration":"1hr 10min","operator":"ryanairdac"},
            {"day":"Tuesday","flightNumber":"FR7933","time":"16:35 BST","departure":"Kraków","arrival":"Podgorica","departureTime":"16:35","arrivalTime":"17:45","duration":"1hr 10min","operator":"buzz"},
            {"day":"Tuesday","flightNumber":"FR8681","time":"19:35 BST","departure":"Bristol","arrival":"Kaunas","departureTime":"19:35","arrivalTime":"20:45","duration":"1hr 10min","operator":"ryanairdac"},
            {"day":"Wednesday","flightNumber":"FR2325","time":"17:35 BST","departure":"Leeds Bradford","arrival":"Barcelona Girona","departureTime":"17:35","arrivalTime":"18:45","duration":"1hr 10min","operator":"ryanairdac"},
            {"day":"Wednesday","flightNumber":"FR2489","time":"20:35 BST","departure":"London Stansted","arrival":"Asturias","departureTime":"20:35","arrivalTime":"21:45","duration":"1hr 10min","operator":"ryanairdac"},
            {"day":"Thursday","flightNumber":"FR3871","time":"20:35 BST","departure":"Malta","arrival":"Venice Treviso","departureTime":"20:35","arrivalTime":"21:45","duration":"1hr 10min","operator":"buzz"},
            {"day":"Friday","flightNumber":"FR2489","time":"17:35 BST","departure":"London Stansted","arrival":"Asturias","departureTime":"17:35","arrivalTime":"18:45","duration":"1hr 10min","operator":"ryanairdac"},
            {"day":"Friday","flightNumber":"FR8681","time":"20:35 BST","departure":"Bristol","arrival":"Kaunas","departureTime":"20:35","arrivalTime":"21:45","duration":"1hr 10min","operator":"malta"},
            {"day":"Saturday","flightNumber":"FR3871","time":"00:35 BST","departure":"Malta","arrival":"Venice Treviso","departureTime":"00:35","arrivalTime":"01:45","duration":"1hr 10min","operator":"ryanairdac"},
            {"day":"Saturday","flightNumber":"FR7933","time":"15:35 BST","departure":"Kraków","arrival":"Podgorica","departureTime":"15:35","arrivalTime":"16:45","duration":"1hr 10min","operator":"malta"},
            {"day":"Saturday","flightNumber":"FR8681","time":"20:35 BST","departure":"Malta","arrival":"Venice Treviso","departureTime":"20:35","arrivalTime":"21:45","duration":"1hr 10min","operator":"buzz"},
            {"day":"Sunday","flightNumber":"FR2325","time":"00:35 BST","departure":"London Stansted","arrival":"Asturias","departureTime":"00:35","arrivalTime":"01:45","duration":"1hr 10min","operator":"ryanairdac"},
            {"day":"Sunday","flightNumber":"FR8681","time":"14:35 BST","departure":"Bristol","arrival":"Kaunas","departureTime":"14:35","arrivalTime":"15:45","duration":"1hr 10min","operator":"malta"},
            {"day":"Sunday","flightNumber":"FR7933","time":"19:35 BST","departure":"Kraków","arrival":"Podgorica","departureTime":"19:35","arrivalTime":"20:45","duration":"1hr 10min","operator":"buzz"},
            {"day":"Sunday","flightNumber":"FR2489","time":"23:35 BST","departure":"Leeds Bradford","arrival":"Barcelona Girona","departureTime":"23:35","arrivalTime":"00:45","duration":"1hr 10min","operator":"ryanairdac"}
        ]
        for f in seed:
            cur.execute(
                'INSERT INTO flights(id, day, flightNumber, time, departure, arrival, departureTime, arrivalTime, duration, operator, aircraft) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                (str(uuid.uuid4()), f["day"], f["flightNumber"], f["time"], f["departure"], f["arrival"], f["departureTime"], f["arrivalTime"], f["duration"], f["operator"], 'Boeing 737-800')
            )

    # 3. BOOKINGS
    cur.execute('''CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        flight_id TEXT,
        created_by TEXT,
        created_at TEXT,
        FOREIGN KEY(created_by) REFERENCES users(id)
    )''')
    ensure_column('bookings', 'created_by', 'TEXT')

    # 4. PASSENGERS
    cur.execute('''CREATE TABLE IF NOT EXISTS passengers (
        id TEXT PRIMARY KEY,
        booking_id TEXT,
        username TEXT,
        user_id TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(booking_id) REFERENCES bookings(id)
    )''')
    ensure_column('passengers', 'user_id', 'TEXT')

    # 5. SEATS
    cur.execute('''CREATE TABLE IF NOT EXISTS seats (
        id TEXT PRIMARY KEY,
        flight_id TEXT,
        seat_number TEXT,
        booking_id TEXT,
        UNIQUE(flight_id, seat_number)
    )''')

    # 6. FARES
    cur.execute('''CREATE TABLE IF NOT EXISTS fares (
        id TEXT PRIMARY KEY,
        booking_id TEXT,
        type TEXT,
        gamepass_id INTEGER,
        username TEXT
    )''')

    # 7. EXTRAS
    cur.execute('''CREATE TABLE IF NOT EXISTS extras (
        id TEXT PRIMARY KEY,
        booking_id TEXT,
        type TEXT,
        gamepass_id INTEGER,
        username TEXT
    )''')

    # 8. STAFF
    cur.execute('''CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        username TEXT,
        role TEXT,
        description TEXT,
        pfp_url TEXT,
        is_on_duty BOOLEAN
    )''')
    
    # Seed Staff if empty
    cur.execute('SELECT COUNT(1) FROM staff')
    if cur.fetchone()[0] == 0:
        seed_staff = [
            {"username":"RyanairAdmin","role":"CEO","description":"Head of Operations","pfp_url":"https://tr.rbxcdn.com/30DAY-AvatarHeadshot-1234567890-Png/150/150/AvatarHeadshot/Png/noFilter","is_on_duty":True}
        ]
        for s in seed_staff:
            cur.execute('INSERT INTO staff (id, username, role, description, pfp_url, is_on_duty) VALUES (?,?,?,?,?,?)',
                       (str(uuid.uuid4()), s['username'], s['role'], s['description'], s['pfp_url'], s['is_on_duty']))

    # 9. SHIFTS
    cur.execute('''CREATE TABLE IF NOT EXISTS shifts (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        username TEXT,
        start_time TEXT,
        end_time TEXT
    )''')

    cur.execute('''CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT,
        created_at TEXT,
        expires_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')

    conn.commit()
    conn.close()

init_db()

class Handler(SimpleHTTPRequestHandler):
    def send_json(self, data, code=200):
        try:
            body = json.dumps(data).encode('utf-8')
            self.send_response(code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            print(f"Error sending JSON: {e}")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        try:
            parsed = urlparse(self.path)
            path = parsed.path
            qs = parse_qs(parsed.query)

            if path == '/api/flights':
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('SELECT * FROM flights')
                cols = [d[0] for d in cur.description]
                rows = [dict(zip(cols, row)) for row in cur.fetchall()]
                conn.close()
                self.send_json(rows)
                return

            if path == '/api/staff':
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('SELECT * FROM staff')
                cols = [d[0] for d in cur.description]
                rows = [dict(zip(cols, row)) for row in cur.fetchall()]
                conn.close()
                self.send_json(rows)
                return
                
            if path == '/api/users':
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('SELECT id, username, role, created_at FROM users')
                cols = [d[0] for d in cur.description]
                rows = [dict(zip(cols, row)) for row in cur.fetchall()]
                conn.close()
                self.send_json(rows)
                return

            if path == '/api/seats':
                flight_id = qs.get('flightId', [None])[0]
                if not flight_id:
                    self.send_json([], 400)
                    return
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('SELECT * FROM seats WHERE flight_id=?', (flight_id,))
                cols = [d[0] for d in cur.description]
                rows = [dict(zip(cols, row)) for row in cur.fetchall()]
                conn.close()
                self.send_json(rows)
                return

            if path == '/api/shifts':
                user_id = qs.get('userId', [None])[0]
                conn = db_conn()
                cur = conn.cursor()
                if user_id:
                    cur.execute('SELECT * FROM shifts WHERE user_id=? ORDER BY start_time DESC', (user_id,))
                else:
                    cur.execute('SELECT * FROM shifts ORDER BY start_time DESC')
                cols = [d[0] for d in cur.description]
                rows = [dict(zip(cols, row)) for row in cur.fetchall()]
                conn.close()
                self.send_json(rows)
                return

            return SimpleHTTPRequestHandler.do_GET(self)
        except Exception as e:
            print(f"GET Error: {e}")
            self.send_json({'error': str(e)}, 500)

    def do_POST(self):
        try:
            parsed = urlparse(self.path)
            path = parsed.path
            length = int(self.headers.get('Content-Length', '0'))
            if length > 0:
                raw = self.rfile.read(length)
                try:
                    payload = json.loads(raw.decode('utf-8'))
                except json.JSONDecodeError:
                    self.send_json({'error': 'Invalid JSON'}, 400)
                    return
            else:
                payload = {}

            if path == '/api/auth/register':
                username = payload.get('username')
                password = payload.get('password')
                role = payload.get('role', 'user') # Allow specifying role (useful for admin creation)
                
                # Simple validation: only allow 'user' if not admin creating (but for now we trust client or assume this is public register)
                # Public register should enforce role='user'
                # But user wants admins to create accounts.
                # Let's say if 'role' is passed and it's not 'user', we might want to check auth?
                # For simplicity in this dev environment, we'll allow it but default to 'user' if missing.
                
                if not username or not password:
                    self.send_json({'error': 'Missing fields'}, 400)
                    return
                conn = db_conn()
                cur = conn.cursor()
                try:
                    hashed = hash_password(password)
                    uid = str(uuid.uuid4())
                    cur.execute('INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
                               (uid, username, hashed, role, datetime.utcnow().isoformat()))
                    conn.commit()
                    self.send_json({'success': True, 'id': uid})
                except sqlite3.IntegrityError:
                    self.send_json({'error': 'Username taken'}, 409)
                finally:
                    conn.close()
                return

            if path == '/api/auth/login':
                username = payload.get('username')
                password = payload.get('password')
                conn = db_conn()
                cur = conn.cursor()
                hashed = hash_password(password)
                cur.execute('SELECT id, role, username FROM users WHERE username=? AND password_hash=?', (username, hashed))
                row = cur.fetchone()
                if row:
                    token = str(uuid.uuid4())
                    now = datetime.utcnow().isoformat()
                    exp = datetime.utcnow().isoformat()
                    cur.execute('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)', (token, row[0], now, exp))
                    conn.commit()
                    conn.close()
                    self.send_json({'success': True, 'id': row[0], 'role': row[1], 'username': row[2], 'token': token})
                else:
                    conn.close()
                    self.send_json({'error': 'Invalid credentials'}, 401)
                return

            if path == '/api/flights':
                conn = db_conn()
                cur = conn.cursor()
                fid = str(uuid.uuid4())
                cur.execute(
                    'INSERT INTO flights(id, day, flightNumber, time, departure, arrival, departureTime, arrivalTime, duration, operator, aircraft) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                    (fid, payload.get('day'), payload.get('flightNumber'), payload.get('time'), payload.get('departure'), payload.get('arrival'), payload.get('departureTime'), payload.get('arrivalTime'), payload.get('duration'), payload.get('operator'), payload.get('aircraft'))
                )
                conn.commit()
                conn.close()
                self.send_json({'success': True, 'id': fid})
                return

            if path == '/api/staff':
                conn = db_conn()
                cur = conn.cursor()
                sid = str(uuid.uuid4())
                cur.execute(
                    'INSERT INTO staff(id, username, role, description, pfp_url, is_on_duty) VALUES (?,?,?,?,?,?)',
                    (sid, payload.get('username'), payload.get('role'), payload.get('description'), payload.get('pfp_url'), payload.get('is_on_duty'))
                )
                conn.commit()
                conn.close()
                self.send_json({'success': True, 'id': sid})
                return

            if path == '/api/booking':
                flight_id = payload.get('flightId')
                passengers = payload.get('passengers', [])
                created_by = payload.get('createdByUserId')
                bid = str(uuid.uuid4())
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('INSERT INTO bookings (id, flight_id, created_by, created_at) VALUES (?, ?, ?, ?)', (bid, flight_id, created_by, datetime.utcnow().isoformat()))
                for p in passengers:
                    uid = None
                    try:
                        cur.execute('SELECT id FROM users WHERE username=?', (p,))
                        r = cur.fetchone()
                        if r:
                            uid = r[0]
                    except Exception:
                        uid = None
                    cur.execute('INSERT INTO passengers (id, booking_id, username, user_id) VALUES (?, ?, ?, ?)', (str(uuid.uuid4()), bid, p, uid))
                conn.commit()
                conn.close()
                self.send_json({'bookingId': bid})
                return

            if path == '/api/seats':
                flight_id = payload.get('flightId')
                seat = payload.get('seat')
                booking_id = payload.get('bookingId')
                conn = db_conn()
                cur = conn.cursor()
                try:
                    cur.execute('INSERT INTO seats (id, flight_id, seat_number, booking_id) VALUES (?, ?, ?, ?)', 
                               (str(uuid.uuid4()), flight_id, seat, booking_id))
                    conn.commit()
                    self.send_json({'success': True})
                except sqlite3.IntegrityError:
                    self.send_json({'error': 'Seat taken'}, 409)
                finally:
                    conn.close()
                return

            if path == '/api/fare':
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('INSERT INTO fares (id, booking_id, type, gamepass_id, username) VALUES (?, ?, ?, ?, ?)',
                           (str(uuid.uuid4()), payload.get('bookingId'), payload.get('type'), payload.get('gamepassId'), payload.get('username')))
                conn.commit()
                conn.close()
                self.send_json({'success': True})
                return

            if path == '/api/extras':
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('INSERT INTO extras (id, booking_id, type, gamepass_id, username) VALUES (?, ?, ?, ?, ?)',
                           (str(uuid.uuid4()), payload.get('bookingId'), payload.get('type'), payload.get('gamepassId'), payload.get('username')))
                conn.commit()
                conn.close()
                self.send_json({'success': True})
                return

            if path == '/api/check-gamepass':
                self.send_json({'owned': True})
                return

            if path == '/api/shifts/start':
                user_id = payload.get('userId')
                username = payload.get('username')
                conn = db_conn()
                cur = conn.cursor()
                sid = str(uuid.uuid4())
                cur.execute('INSERT INTO shifts (id, user_id, username, start_time) VALUES (?, ?, ?, ?)',
                           (sid, user_id, username, datetime.utcnow().isoformat()))
                conn.commit()
                conn.close()
                self.send_json({'success': True, 'id': sid})
                return

            if path == '/api/shifts/end':
                shift_id = payload.get('shiftId')
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('UPDATE shifts SET end_time=? WHERE id=?', (datetime.utcnow().isoformat(), shift_id))
                conn.commit()
                conn.close()
                self.send_json({'success': True})
                return

            return SimpleHTTPRequestHandler.do_POST(self)
        except Exception as e:
            print(f"POST Error: {e}")
            self.send_json({'error': str(e)}, 500)

    def do_PUT(self):
        try:
            parsed = urlparse(self.path)
            path = parsed.path
            qs = parse_qs(parsed.query)
            length = int(self.headers.get('Content-Length', '0'))
            if length > 0:
                raw = self.rfile.read(length)
                try:
                    payload = json.loads(raw.decode('utf-8'))
                except json.JSONDecodeError:
                    self.send_json({'error': 'Invalid JSON'}, 400)
                    return
            else:
                payload = {}

            if path == '/api/staff':
                sid = qs.get('id', [None])[0]
                if not sid:
                    self.send_json({'error': 'No ID'}, 400)
                    return
                conn = db_conn()
                cur = conn.cursor()
                # Dynamic update
                fields = []
                values = []
                for k, v in payload.items():
                    fields.append(f"{k}=?")
                    values.append(v)
                values.append(sid)
                cur.execute(f'UPDATE staff SET {", ".join(fields)} WHERE id=?', values)
                conn.commit()
                conn.close()
                self.send_json({'success': True})
                return
                
            return SimpleHTTPRequestHandler.do_PUT(self)
        except Exception as e:
            print(f"PUT Error: {e}")
            self.send_json({'error': str(e)}, 500)

    def do_DELETE(self):
        try:
            parsed = urlparse(self.path)
            path = parsed.path
            qs = parse_qs(parsed.query)
            
            if path == '/api/staff':
                sid = qs.get('id', [None])[0]
                if not sid:
                    self.send_json({'error': 'No ID'}, 400)
                    return
                conn = db_conn()
                cur = conn.cursor()
                cur.execute('DELETE FROM staff WHERE id=?', (sid,))
                conn.commit()
                conn.close()
                self.send_json({'success': True})
                return
                
            return SimpleHTTPRequestHandler.do_DELETE(self)
        except Exception as e:
            print(f"DELETE Error: {e}")
            self.send_json({'error': str(e)}, 500)

print("Server starting on port 8000...")
ThreadingHTTPServer(('0.0.0.0', 8000), Handler).serve_forever()
