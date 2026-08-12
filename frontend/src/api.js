const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export const api = {
  // auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  // products
  getProducts: (params = '') => request(`/products${params}`),
  getProduct: (id) => request(`/products/${id}`),

  // cart
  getCart: () => request('/cart'),
  addToCart: (product_id, quantity = 1) =>
    request('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  updateCartItem: (id, quantity) =>
    request(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (id) => request(`/cart/${id}`, { method: 'DELETE' }),

  // orders
  checkout: (shipping_address) =>
    request('/orders', { method: 'POST', body: JSON.stringify({ shipping_address }) }),
  getOrders: () => request('/orders'),
};

export { getToken };
