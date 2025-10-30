'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: number;
  name: string;
  weight: number;
  unit: string;
  pricePerUnit: number;
}

interface Order {
  orderId: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  // Simple password protection (replace with your own password)
  const ADMIN_PASSWORD = 'admin123'; // CHANGE THIS!

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchAllOrders();
    }
  }, []);

  useEffect(() => {
    // Filter orders based on search and status
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      fetchAllOrders();
    } else {
      alert('Incorrect password!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
    setOrders([]);
    setFilteredOrders([]);
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://844b95xljc.execute-api.us-east-1.amazonaws.com/prod/admin/orders'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error fetching orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    setError('');

    try {
      const response = await fetch(
        'https://844b95xljc.execute-api.us-east-1.amazonaws.com/prod/admin/orders/status',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            status: newStatus
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setOrders(orders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      alert(`Order ${orderId} status updated to ${newStatus}!`);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Error updating status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter password to access admin dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage all orders</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-semibold mb-1">Total Orders</div>
            <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow">
            <div className="text-yellow-800 text-sm font-semibold mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-900">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <div className="text-blue-800 text-sm font-semibold mb-1">Processing</div>
            <div className="text-3xl font-bold text-blue-900">
              {orders.filter(o => o.status === 'processing').length}
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow">
            <div className="text-green-800 text-sm font-semibold mb-1">Delivered</div>
            <div className="text-3xl font-bold text-green-900">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Search Orders</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order ID or Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading orders...</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
            <p className="text-gray-600">No orders match your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Customer: <span className="font-semibold">{order.customerEmail}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-xl font-bold text-primary-600 mt-2">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-600 mb-1">
                        • {item.name} - {item.weight} {item.unit} × ${item.pricePerUnit.toFixed(2)}/{item.unit}
                      </div>
                    ))}
                  </div>

                  {order.shippingAddress && (
                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-semibold mb-2">Shipping Address:</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}, {order.shippingAddress.country}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Update Status:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.orderId, status)}
                          disabled={updating || order.status === status}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                            order.status === status
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-primary-600 text-white hover:bg-primary-700'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}