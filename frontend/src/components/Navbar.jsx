import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Shoply<span className="brand-dot">.</span>
      </Link>
      <nav className="nav-links">
        <Link to="/">Shop</Link>
        {user && <Link to="/orders">Orders</Link>}
        <Link to="/cart" className="cart-link">
          Cart
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn-link" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn-primary-sm">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
