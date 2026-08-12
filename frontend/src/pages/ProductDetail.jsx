import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAdd = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="status-text error-text">{error}</p>;
  if (!product) return <p className="status-text">Loading…</p>;

  return (
    <div className="product-detail">
      <div className="product-detail-image">
        <img src={product.image_url} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <span className="product-category">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>
        <p className="product-detail-desc">{product.description}</p>
        <p className={`stock-text ${product.stock <= 0 ? 'error-text' : ''}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <div className="qty-row">
          <label htmlFor="qty">Qty</label>
          <input
            id="qty"
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          />
        </div>

        <button className="btn-primary" onClick={handleAdd} disabled={product.stock <= 0}>
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
