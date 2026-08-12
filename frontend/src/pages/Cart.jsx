import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="empty-state">
        <h2>Log in to view your cart</h2>
        <Link to="/login" className="btn-primary">
          Log in
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn-primary">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="cart-row">
            <img src={item.image_url} alt={item.name} />
            <div className="cart-row-info">
              <span className="product-name">{item.name}</span>
              <span className="product-price">${Number(item.price).toFixed(2)}</span>
            </div>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
            />
            <span className="line-total">${(item.price * item.quantity).toFixed(2)}</span>
            <button className="btn-link" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <span>Total: <strong>${total.toFixed(2)}</strong></span>
        <button className="btn-primary" onClick={() => navigate('/checkout')}>
          Checkout
        </button>
      </div>
    </div>
  );
}
