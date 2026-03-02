const store = require('../data/store');

/* GET /api/products — list with filters, search, sort, pagination */
exports.getAll = (req, res) => {
  let items = [...store.products];
  const { category, condition, brand, search, minPrice, maxPrice, sort, page = 1, limit = 12, compatibility } = req.query;

  if (category) items = items.filter(p => p.category === category);
  if (condition) items = items.filter(p => p.condition.toLowerCase() === condition.toLowerCase());
  if (brand) items = items.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  if (compatibility) items = items.filter(p => p.compatibility.some(c => c.toLowerCase().includes(compatibility.toLowerCase())));
  if (minPrice) items = items.filter(p => p.price >= Number(minPrice));
  if (maxPrice) items = items.filter(p => p.price <= Number(maxPrice));
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.compatibility.some(c => c.toLowerCase().includes(q))
    );
  }

  // Sort
  switch (sort) {
    case 'price-asc': items.sort((a, b) => a.price - b.price); break;
    case 'price-desc': items.sort((a, b) => b.price - a.price); break;
    case 'rating': items.sort((a, b) => b.rating - a.rating); break;
    case 'newest': items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    default: items.sort((a, b) => b.rating - a.rating); // default: best rated
  }

  const total = items.length;
  const pageNum = Math.max(1, Number(page));
  const perPage = Math.max(1, Math.min(48, Number(limit)));
  const pages = Math.ceil(total / perPage);
  items = items.slice((pageNum - 1) * perPage, pageNum * perPage);

  res.json({ success: true, data: items, total, page: pageNum, pages });
};

/* GET /api/products/brands — list unique brands */
exports.getBrands = (_req, res) => {
  const brands = [...new Set(store.products.map(p => p.brand))].sort();
  res.json({ success: true, data: brands });
};

/* GET /api/products/bikes — list unique compatible bikes */
exports.getBikes = (_req, res) => {
  const bikes = [...new Set(store.products.flatMap(p => p.compatibility))].sort();
  res.json({ success: true, data: bikes });
};

/* GET /api/products/:id — single product */
exports.getOne = (req, res) => {
  const product = store.products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  // Also return related products (same category, different id)
  const related = store.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  res.json({ success: true, data: product, related });
};

/* POST /api/products — create (seller upload) */
exports.create = (req, res) => {
  try {
    const { name, description, price, mrp, category, condition, brand, compatibility, specifications, features, sellerName, sellerContact } = req.body;

    if (!name || !description || !price || !category || !condition) {
      return res.status(400).json({ success: false, message: 'Name, description, price, category and condition are required' });
    }

    const images = req.files && req.files.length > 0
      ? req.files.map(f => `/uploads/${f.filename}`)
      : ['https://images.unsplash.com/photo-1676247122495-97eea5629e64?w=600&h=600&fit=crop&auto=format&q=80'];

    const product = store.addProduct({
      name,
      description,
      price: Number(price),
      mrp: mrp ? Number(mrp) : Math.round(Number(price) * 1.25),
      category,
      condition,
      brand: brand || 'Unbranded',
      compatibility: compatibility ? (typeof compatibility === 'string' ? JSON.parse(compatibility) : compatibility) : [],
      images,
      specifications: specifications ? (typeof specifications === 'string' ? JSON.parse(specifications) : specifications) : {},
      features: features ? (typeof features === 'string' ? JSON.parse(features) : features) : [],
      seller: { name: sellerName || 'Independent Seller', rating: 4.0 },
      inStock: true,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
