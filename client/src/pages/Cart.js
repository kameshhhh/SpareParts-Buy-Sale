import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, cartTotal, cartCount, fetchCart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const formatPrice = (p) => '₹' + p.toLocaleString('en-IN');
  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + shipping + tax;

  if (cartCount === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
          <h2>Your Cart is Empty</h2>
          <p>Start browsing to find amazing motorcycle parts!</p>
          <Link to="/browse" className="btn btn--primary">Browse Parts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h1>Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
        <button className="cart-page__clear" onClick={clearCart}>Clear Cart</button>
      </div>

      <div className="cart-page__body">
        {/* Cart Items */}
        <div className="cart-page__items">
          {cart.map(item => item.product && (
            <div className="cart-item" key={item.id}>
              <Link to={`/product/${item.product.id}`} className="cart-item__img">
                <img src={item.product.images[0]} alt={item.product.name} />
              </Link>
              <div className="cart-item__info">
                <Link to={`/product/${item.product.id}`} className="cart-item__name">{item.product.name}</Link>
                <div className="cart-item__meta">
                  <span className="cart-item__brand">{item.product.brand}</span>
                  <span className={`cart-item__condition cart-item__condition--${item.product.condition.toLowerCase()}`}>{item.product.condition}</span>
                </div>
                <div className="cart-item__compat">{item.product.compatibility[0]}</div>
              </div>
              <div className="cart-item__qty">
                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item__price">
                <span className="cart-item__total">{formatPrice(item.product.price * item.quantity)}</span>
                {item.quantity > 1 && <span className="cart-item__unit">{formatPrice(item.product.price)} each</span>}
              </div>
              <button className="cart-item__remove" onClick={() => removeItem(item.id)} aria-label="Remove">✕</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-page__summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal ({cartCount} items)</span><span>{formatPrice(cartTotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free-shipping">FREE</span> : formatPrice(shipping)}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
          <div className="summary-divider" />
          <div className="summary-row summary-row--total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          {shipping === 0 && <p className="summary-note">You qualify for free delivery!</p>}
          <button className="btn btn--primary btn--large btn--full" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          <Link to="/browse" className="summary-continue">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
