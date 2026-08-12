import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { items, total, refreshCart } = useCart();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter a shipping address');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      await api.checkout(address);
      await refreshCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <p className="status-text">Your cart is empty. Add items before checking out.</p>;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-summary">
        {items.map((item) => (
          <div key={item.id} className="checkout-line">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-line checkout-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-form">
        <label htmlFor="address">Shipping address</label>
        <textarea
          id="address"
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St, Springfield, USA"
        />
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary" type="submit" disabled={placing}>
          {placing ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
