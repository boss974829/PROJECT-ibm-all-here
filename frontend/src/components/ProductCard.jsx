import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image">
        <img src={product.image_url} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-card-footer">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
          <button
            className="btn-primary-sm"
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
