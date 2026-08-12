import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        if (search) params.set('search', search);
        const query = params.toString() ? `?${params.toString()}` : '';
        const data = await api.getProducts(query);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
  }, [category, search]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(productId, 1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Everyday goods, thoughtfully picked.</h1>
        <p>Browse electronics, fashion, home &amp; sports essentials — built on a real Dockerized stack.</p>
      </section>

      <div className="filters">
        <div className="category-pills">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`pill ${category === c ? 'pill-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="status-text">Loading products…</p>}
      {error && <p className="status-text error-text">{error}</p>}

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
        ))}
      </div>

      {!loading && products.length === 0 && !error && (
        <p className="status-text">No products found.</p>
      )}
    </div>
  );
}
