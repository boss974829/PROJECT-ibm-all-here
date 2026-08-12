import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-text">Loading orders…</p>;
  if (error) return <p className="status-text error-text">{error}</p>;
  if (orders.length === 0) return <p className="status-text">You haven't placed any orders yet.</p>;

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-card-header">
            <span>Order #{order.id}</span>
            <span className="order-status">{order.status}</span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.id} className="checkout-line">
                <span>{item.product_name} × {item.quantity}</span>
                <span>${Number(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-card-footer">
            <span>Shipping to: {order.shipping_address}</span>
            <strong>Total: ${Number(order.total).toFixed(2)}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
