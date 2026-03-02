const store = require('../data/store');

/* GET /api/cart */
exports.getCart = (_req, res) => {
  const items = store.cart.map(c => {
    const product = store.products.find(p => p.id === c.productId);
    return { ...c, product: product || null };
  });
  const total = items.reduce((sum, i) => sum + (i.product ? i.product.price * i.quantity : 0), 0);
  res.json({ success: true, data: items, total, count: items.length });
};

/* POST /api/cart — add item */
exports.addItem = (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });
  const product = store.products.find(p => p.id === Number(productId));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const item = store.addToCart(Number(productId), Number(quantity));
  res.status(201).json({ success: true, data: { ...item, product } });
};

/* PUT /api/cart/:id — update quantity */
exports.updateItem = (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ success: false, message: 'Valid quantity required' });
  const item = store.updateCartItem(Number(req.params.id), Number(quantity));
  if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
  const product = store.products.find(p => p.id === item.productId);
  res.json({ success: true, data: { ...item, product } });
};

/* DELETE /api/cart/:id — remove item */
exports.removeItem = (req, res) => {
  const removed = store.removeCartItem(Number(req.params.id));
  if (!removed) return res.status(404).json({ success: false, message: 'Cart item not found' });
  res.json({ success: true, message: 'Item removed from cart' });
};

/* DELETE /api/cart — clear entire cart */
exports.clearCart = (_req, res) => {
  store.clearCart();
  res.json({ success: true, message: 'Cart cleared' });
};
