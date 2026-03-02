const store = require('../data/store');

/* GET /api/categories — list all categories with counts */
exports.getAll = (_req, res) => {
  const cats = store.categories.map(c => ({
    ...c,
    count: store.products.filter(p => p.category === c.slug).length,
  }));
  res.json({ success: true, data: cats });
};

/* GET /api/categories/:slug — single category meta */
exports.getOne = (req, res) => {
  const cat = store.categories.find(c => c.slug === req.params.slug);
  if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, data: { ...cat, count: store.products.filter(p => p.category === cat.slug).length } });
};

/* GET /api/categories/:slug/products — products in a category */
exports.getProducts = (req, res) => {
  const cat = store.categories.find(c => c.slug === req.params.slug);
  if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

  let items = store.products.filter(p => p.category === cat.slug);
  const { sort, condition, brand, minPrice, maxPrice } = req.query;

  if (condition) items = items.filter(p => p.condition.toLowerCase() === condition.toLowerCase());
  if (brand) items = items.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  if (minPrice) items = items.filter(p => p.price >= Number(minPrice));
  if (maxPrice) items = items.filter(p => p.price <= Number(maxPrice));

  switch (sort) {
    case 'price-asc': items.sort((a, b) => a.price - b.price); break;
    case 'price-desc': items.sort((a, b) => b.price - a.price); break;
    case 'rating': items.sort((a, b) => b.rating - a.rating); break;
    case 'newest': items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    default: break;
  }

  res.json({ success: true, data: items, category: cat });
};
