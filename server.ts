// ... existing imports ...
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'localbite-secret-key-123';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

const sqliteDb = new Database(':memory:');
const db = {
  async exec(sql: string) {
    sqliteDb.exec(sql);
  },
  async get(sql: string, params: any[] = []) {
    return sqliteDb.prepare(sql).get(...params);
  },
  async all(sql: string, params: any[] = []) {
    return sqliteDb.prepare(sql).all(...params);
  },
  async run(sql: string, params: any[] = []) {
    const info = sqliteDb.prepare(sql).run(...params);
    return { lastID: info.lastInsertRowid };
  }
};

// Initialize Database
async function initDB() {

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT, -- 'customer', 'vendor', 'admin'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      business_name TEXT,
      cuisine TEXT,
      rating REAL DEFAULT 0,
      delivery_time TEXT,
      distance TEXT,
      image_url TEXT,
      status TEXT DEFAULT 'approved',
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER,
      name TEXT,
      description TEXT,
      price REAL,
      original_price REAL,
      category TEXT,
      is_veg BOOLEAN,
      image_url TEXT,
      FOREIGN KEY(vendor_id) REFERENCES vendors(id)
    );
    
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      vendor_id INTEGER,
      total_amount REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES users(id),
      FOREIGN KEY(vendor_id) REFERENCES vendors(id)
    );
    
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      food_id INTEGER,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(food_id) REFERENCES foods(id)
    );
  `);

  // Seed Data
  const vendorCount = await db.get('SELECT COUNT(*) as count FROM vendors');
  if ((vendorCount as any).count === 0) {
    // Insert Admin
    const adminHash = await bcrypt.hash('admin123', 10);
    await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Admin', 'admin@localbite.com', adminHash, 'admin']);
    
    // Insert Users (Vendors)
    const vendorHash = await bcrypt.hash('vendor123', 10);
    const result1 = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Rahul Sharma', 'sharma@example.com', vendorHash, 'vendor']);
    const result2 = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Amit Singh', 'amit@example.com', vendorHash, 'vendor']);
    const result3 = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Priya Rao', 'priya@example.com', vendorHash, 'vendor']);
    const result4 = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Chen Wei', 'chen@example.com', vendorHash, 'vendor']);
    const result5 = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Sarah Baker', 'sarah@example.com', vendorHash, 'vendor']);
    const result6 = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Mike Jones', 'mike@example.com', vendorHash, 'vendor']);
    const result7 = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Emma Green', 'emma@example.com', vendorHash, 'vendor']);

    // Insert Vendors
    await db.run(`INSERT INTO vendors (user_id, business_name, cuisine, rating, delivery_time, distance, image_url) VALUES 
      (?, 'Sharma Home Kitchen', 'North Indian • Home Food', 4.8, '25-30 min', '1.2 km', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'),
      (?, 'The Pizza Craft', 'Artisanal Wood-fired Pizza', 4.7, '35-40 min', '2.5 km', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop'),
      (?, 'South Indian Delights', 'South Indian • Authentic', 4.9, '20-25 min', '1.5 km', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800&auto=format&fit=crop'),
      (?, 'Wok This Way', 'Chinese • Asian', 4.5, '30-40 min', '3.0 km', 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop'),
      (?, 'Sweet Treats Bakery', 'Desserts • Bakery', 4.9, '15-20 min', '0.8 km', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop'),
      (?, 'Burger Hub', 'American • Fast Food', 4.6, '20-35 min', '2.1 km', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'),
      (?, 'Healthy Bites', 'Salads • Healthy', 4.8, '15-25 min', '1.0 km', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop')
    `, [result1.lastID, result2.lastID, result3.lastID, result4.lastID, result5.lastID, result6.lastID, result7.lastID]);

    // Insert Foods
    await db.run(`INSERT INTO foods (vendor_id, name, description, price, original_price, category, is_veg, image_url) VALUES 
      (1, 'Paneer Butter Masala', 'Creamy and rich paneer curry', 180, 220, 'Curry', true, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=800&auto=format&fit=crop'),
      (1, 'Dal Makhani', 'Slow-cooked black lentils', 150, 180, 'Curry', true, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop'),
      (1, 'Garlic Naan', 'Soft bread infused with garlic', 40, 50, 'Breads', true, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=800&auto=format&fit=crop'),
      (2, 'Margherita Pizza', 'Classic cheese and tomato', 250, 300, 'Pizza', true, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop'),
      (2, 'Pepperoni Pizza', 'Spicy pepperoni with mozzarella', 320, 380, 'Pizza', false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop'),
      (2, 'Garlic Breadsticks', 'Cheesy baked breadsticks', 120, 150, 'Sides', true, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=800&auto=format&fit=crop'),
      (3, 'Masala Dosa', 'Crispy crepe with potato filling', 110, 140, 'South Indian', true, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop'),
      (3, 'Idli Sambar', 'Steamed rice cakes with lentil soup', 80, 100, 'South Indian', true, 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=800&auto=format&fit=crop'),
      (4, 'Hakka Noodles', 'Stir-fried noodles with veggies', 150, 180, 'Chinese', true, 'https://images.unsplash.com/photo-1605333555541-6927aebcd9be?q=80&w=800&auto=format&fit=crop'),
      (4, 'Chilli Chicken', 'Spicy glazed chicken bites', 220, 260, 'Chinese', false, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800&auto=format&fit=crop'),
      (4, 'Veg Manchurian', 'Fried veggie balls in spicy sauce', 180, 220, 'Chinese', true, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop'),
      (5, 'Chocolate Truffle Cake', 'Rich layered chocolate cake', 450, 550, 'Desserts', true, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'),
      (5, 'Strawberry Cheesecake', 'Classic NY style with berries', 180, 220, 'Desserts', false, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop'),
      (6, 'Classic Cheeseburger', 'Juicy beef patty with cheese', 180, 200, 'Burger', false, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'),
      (6, 'Veggie Burger', 'Crispy plant-based patty', 150, 180, 'Burger', true, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=800&auto=format&fit=crop'),
      (6, 'French Fries', 'Crispy golden potato fries', 90, 110, 'Sides', true, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800&auto=format&fit=crop'),
      (7, 'Avocado Salad', 'Fresh greens with sliced avocado', 220, 250, 'Salads', true, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'),
      (7, 'Quinoa Bowl', 'Healthy quinoa with roasted veggies', 240, 280, 'Healthy', true, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop')
    `);
    
    // Insert Customer
    const custHash = await bcrypt.hash('customer123', 10);
    await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['John Customer', 'customer@example.com', custHash, 'customer']);
  }
}

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API ROUTES

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'customer']
    );
    
    if (role === 'vendor') {
       await db.run('INSERT INTO vendors (user_id, business_name) VALUES (?, ?)', [result.lastID, name + " Business"]);
    }
    
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]) as any;
  
  if (user && await bcrypt.compare(password, user.password)) {
    let extraData = {};
    if (user.role === 'vendor') {
      const vendor = await db.get('SELECT id FROM vendors WHERE user_id = ?', [user.id]) as any;
      extraData = { vendor_id: vendor?.id };
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, ...extraData }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, ...extraData } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/vendors', async (req, res) => {
  const vendors = await db.all("SELECT * FROM vendors WHERE status = 'approved'");
  res.json(vendors);
});

app.get('/api/vendors/:id', async (req, res) => {
  const vendor = await db.get('SELECT * FROM vendors WHERE id = ?', [req.params.id]) as any;
  const foods = await db.all('SELECT * FROM foods WHERE vendor_id = ?', [req.params.id]);
  res.json({ ...vendor, foods });
});

app.get('/api/foods', async (req, res) => {
  const foods = await db.all('SELECT f.*, v.business_name FROM foods f JOIN vendors v ON f.vendor_id = v.id');
  res.json(foods);
});

app.post('/api/orders', authenticateToken, async (req: any, res: any) => {
  const { vendor_id, items, total_amount } = req.body;
  const customer_id = req.user.id;
  
  try {
    await db.run('BEGIN TRANSACTION');
    const result = await db.run(
      'INSERT INTO orders (customer_id, vendor_id, total_amount) VALUES (?, ?, ?)',
      [customer_id, vendor_id, total_amount]
    );
    
    for (const item of items) {
      await db.run(
        'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)',
        [result.lastID, item.food_id, item.quantity, item.price]
      );
    }
    await db.run('COMMIT');
    res.status(201).json({ message: 'Order placed', order_id: result.lastID });
  } catch (err) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Vendor Dashboard APIs
app.get('/api/vendor/orders', authenticateToken, async (req: any, res: any) => {
  if (req.user.role !== 'vendor') return res.status(403).json({error: 'Not a vendor'});
  const orders = await db.all('SELECT o.*, u.name as customer_name FROM orders o JOIN users u ON o.customer_id = u.id WHERE vendor_id = ? ORDER BY o.created_at DESC', [req.user.vendor_id]) as any[];
  // Fetch items for each order
  for (let order of orders) {
    order.items = await db.all('SELECT oi.*, f.name FROM order_items oi JOIN foods f ON oi.food_id = f.id WHERE order_id = ?', [order.id]);
  }
  res.json(orders);
});

app.put('/api/vendor/orders/:id/status', authenticateToken, async (req: any, res: any) => {
  if (req.user.role !== 'vendor') return res.status(403).json({error: 'Not a vendor'});
  const { status } = req.body;
  await db.run('UPDATE orders SET status = ? WHERE id = ? AND vendor_id = ?', [status, req.params.id, req.user.vendor_id]);
  res.json({ success: true });
});


// Chat API
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Fetch some context from DB to ground the AI
    const vendors = await db.all('SELECT business_name, cuisine, rating FROM vendors');
    const foods = await db.all('SELECT f.name, f.price, v.business_name FROM foods f JOIN vendors v ON f.vendor_id = v.id');
    
    const systemInstruction = `You are LocalBite AI, a helpful food assistant for a local food marketplace.
Keep answers concise and friendly.
Here is the current database context:
Vendors available: ${JSON.stringify(vendors)}
Foods available: ${JSON.stringify(foods)}
If a user asks for something we don't have, politely suggest what we do have. Use ₹ for currency.`;

    const formattedHistory = history ? history.filter((m: any) => m.role !== 'model' || m.text).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })) : [];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ response: response.text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Start Server
async function startServer() {
  await initDB();
  
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
