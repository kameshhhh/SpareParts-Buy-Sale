const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');

const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

/* ── Middleware ──────────────────────────────────────────────────── */
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Serve uploaded images
app.use('/uploads', express.static(config.uploadsDir));

/* ── Routes ─────────────────────────────────────────────────────── */
app.get('/', (_req, res) => res.json({ status: 'MotoParts 2060 API running', version: '1.0.0' }));
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

/* ── Error handler ──────────────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

/* ── Start ──────────────────────────────────────────────────────── */
app.listen(config.port, () => {
  console.log(`✓ MotoParts 2060 API running on http://localhost:${config.port}`);
});
