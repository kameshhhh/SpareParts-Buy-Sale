import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI Payment', icon: '📱' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💰' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, fetchCart } = useCart();
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=processing
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' });
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', upiId: '' });

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const formatPrice = (p) => '₹' + p.toLocaleString('en-IN');
  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + shipping + tax;

  const handleCustomerChange = (e) => setCustomer(c => ({ ...c, [e.target.name]: e.target.value }));
  const handleCardChange = (e) => setCardDetails(c => ({ ...c, [e.target.name]: e.target.value }));

  const handleAddressSubmit = (e) => { e.preventDefault(); setStep(2); };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setStep(3);

    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 2500));

    try {
      const fullAddress = `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`;
      const res = await axios.post('/api/orders', {
        customer: { name: customer.name, phone: customer.phone, email: customer.email, address: fullAddress },
        paymentMethod,
      });
      await fetchCart();
      navigate(`/order-success/${res.data.data.id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
      setStep(2);
      setProcessing(false);
    }
  };

  if (cartCount === 0 && step < 3) {
    return (
      <div className="checkout-page">
        <div className="cart-page__empty">
          <h2>Your Cart is Empty</h2>
          <p>Add some products before checkout.</p>
          <Link to="/browse" className="btn btn--primary">Browse Parts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Step Indicators */}
      <div className="checkout-steps">
        <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}><span>1</span> Shipping</div>
        <div className="checkout-step-line" />
        <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}><span>2</span> Payment</div>
        <div className="checkout-step-line" />
        <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}><span>3</span> Confirm</div>
      </div>

      <div className="checkout-page__body">
        <div className="checkout-page__main">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <form className="checkout-form" onSubmit={handleAddressSubmit}>
              <h2>Shipping Address</h2>
              <div className="form-row">
                <div className="form-group"><label>Full Name *</label><input type="text" name="name" value={customer.name} onChange={handleCustomerChange} required placeholder="Enter your full name" /></div>
                <div className="form-group"><label>Phone Number *</label><input type="tel" name="phone" value={customer.phone} onChange={handleCustomerChange} required placeholder="+91 98765 43210" /></div>
              </div>
              <div className="form-group"><label>Email</label><input type="email" name="email" value={customer.email} onChange={handleCustomerChange} placeholder="your@email.com" /></div>
              <div className="form-group"><label>Address *</label><textarea name="address" value={customer.address} onChange={handleCustomerChange} required placeholder="House no., Street, Locality" rows={3} /></div>
              <div className="form-row">
                <div className="form-group"><label>City *</label><input type="text" name="city" value={customer.city} onChange={handleCustomerChange} required placeholder="City" /></div>
                <div className="form-group"><label>State *</label><input type="text" name="state" value={customer.state} onChange={handleCustomerChange} required placeholder="State" /></div>
                <div className="form-group"><label>Pincode *</label><input type="text" name="pincode" value={customer.pincode} onChange={handleCustomerChange} required placeholder="6-digit pincode" pattern="[0-9]{6}" /></div>
              </div>
              <button type="submit" className="btn btn--primary btn--large">Continue to Payment</button>
            </form>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <h2>Payment Method</h2>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(pm => (
                  <label key={pm.id} className={`payment-method ${paymentMethod === pm.id ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} />
                    <span className="payment-method__icon">{pm.icon}</span>
                    <span>{pm.label}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" name="number" value={cardDetails.number} onChange={handleCardChange} placeholder="1234 5678 9012 3456" maxLength={19} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Expiry</label><input type="text" name="expiry" value={cardDetails.expiry} onChange={handleCardChange} placeholder="MM/YY" maxLength={5} required /></div>
                    <div className="form-group"><label>CVV</label><input type="password" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} placeholder="•••" maxLength={4} required /></div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input type="text" name="upiId" value={cardDetails.upiId} onChange={handleCardChange} placeholder="yourname@upi" required />
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="cod-info">
                  <p>💰 Pay with cash when your order is delivered. No additional charges.</p>
                </div>
              )}

              <div className="checkout-form__actions">
                <button type="button" className="btn btn--secondary" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn--primary btn--large" disabled={processing}>Place Order — {formatPrice(grandTotal)}</button>
              </div>
              <p className="checkout-demo-note">🔒 This is a demo payment. No real charges will be made.</p>
            </form>
          )}

          {/* Step 3: Processing */}
          {step === 3 && (
            <div className="checkout-processing">
              <div className="checkout-processing__spinner" />
              <h2>Processing Your Order…</h2>
              <p>Please wait while we confirm your payment.</p>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-page__sidebar">
          <h3>Order Summary</h3>
          <div className="checkout-items">
            {cart.map(item => item.product && (
              <div className="checkout-item" key={item.id}>
                <img src={item.product.images[0]} alt={item.product.name} />
                <div>
                  <div className="checkout-item__name">{item.product.name}</div>
                  <div className="checkout-item__qty">Qty: {item.quantity}</div>
                </div>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
          <div className="summary-divider" />
          <div className="summary-row summary-row--total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
        </div>
      </div>
    </div>
  );
}
