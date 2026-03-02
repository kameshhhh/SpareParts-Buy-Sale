import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/orders/${id}`)
      .then(res => {
        if (res.data.success) {
          setOrder(res.data.data);
        }
      })
      .catch(err => console.error('Failed to load order:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (p) => '₹' + p.toLocaleString('en-IN');

  if (loading) return <div className="order-success"><div className="browse-page__loading">Loading order…</div></div>;
  if (!order) return <div className="order-success"><div className="browse-page__empty"><h2>Order Not Found</h2><Link to="/" className="btn btn--primary">Go Home</Link></div></div>;

  return (
    <div className="order-success">
      <div className="order-success__card">
        <div className="order-success__icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p className="order-success__id">Order #{order.id}</p>
        <p className="order-success__msg">Thank you for your purchase! Your order has been placed successfully.</p>

        <div className="order-success__details">
          <div className="order-success__row"><span>Payment Method</span><span>{order.paymentMethod === 'card' ? '💳 Card' : order.paymentMethod === 'upi' ? '📱 UPI' : '💰 Cash on Delivery'}</span></div>
          <div className="order-success__row"><span>Status</span><span className="order-success__status">✓ {order.status}</span></div>
          <div className="order-success__row"><span>Total Amount</span><span className="order-success__total">{formatPrice(order.total + Math.round(order.total * 0.18) + (order.total >= 999 ? 0 : 99))}</span></div>
          <div className="order-success__row"><span>Delivery To</span><span>{order.customer.name}, {order.customer.address}</span></div>
        </div>

        <div className="order-success__items">
          <h3>Items Ordered ({order.items.length})</h3>
          {order.items.map((item, i) => (
            <div className="order-success__item" key={i}>
              {item.product && <img src={item.product.images[0]} alt={item.product.name} />}
              <div>
                <div>{item.product?.name || 'Product'}</div>
                <div>Qty: {item.quantity} × {item.product ? formatPrice(item.product.price) : '—'}</div>
              </div>
              <span>{item.product ? formatPrice(item.product.price * item.quantity) : '—'}</span>
            </div>
          ))}
        </div>

        <div className="order-success__actions">
          <Link to="/browse" className="btn btn--primary">Continue Shopping</Link>
          <Link to="/" className="btn btn--secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
