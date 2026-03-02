const store = require('../data/store');

/* POST /api/orders — place an order (demo payment) */
exports.create = (req, res) => {
  const { customer, paymentMethod } = req.body;

  if (!customer || !customer.name || !customer.address || !customer.phone) {
    return res.status(400).json({ success: false, message: 'Customer name, address and phone are required' });
  }
  if (!paymentMethod) {
    return res.status(400).json({ success: false, message: 'Payment method is required' });
  }
  if (store.cart.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const order = store.createOrder(customer, paymentMethod);
  res.status(201).json({ success: true, data: order });
};

/* GET /api/orders — list all orders */
exports.getAll = (_req, res) => {
  res.json({ success: true, data: store.orders });
};

/* GET /api/orders/:id — single order */
exports.getOne = (req, res) => {
  const order = store.orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
};
