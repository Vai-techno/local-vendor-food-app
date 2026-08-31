import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

export default function VendorOrders() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch('/api/vendor/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    await fetch(`/api/vendor/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-surface-container-low">
      <aside className="w-64 bg-white border-r border-surface-variant flex flex-col hidden md:flex">
        <div className="p-6 border-b border-surface-variant">
          <h1 className="text-2xl font-display font-bold text-primary">LocalBite</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate('/vendor')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </button>
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold">
            <span className="material-symbols-outlined">list_alt</span> Orders
          </a>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-surface-variant p-4 flex items-center gap-4 md:hidden">
          <button onClick={() => navigate('/vendor')} className="material-symbols-outlined">arrow_back</button>
          <h1 className="text-xl font-display font-bold text-primary">Orders</h1>
        </header>

        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 bg-white p-8 rounded-2xl text-center">No orders yet.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-surface-variant p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                      <p className="text-sm font-medium mt-1">Customer: {order.customer_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="border-t border-b border-surface-variant py-4 mb-4">
                    <ul className="space-y-2">
                      {order.items?.map((item: any) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total: ₹{order.total_amount}</span>
                    
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button onClick={() => updateStatus(order.id, 'preparing')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Accept & Prepare</button>
                      )}
                      {order.status === 'preparing' && (
                        <button onClick={() => updateStatus(order.id, 'ready')} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700">Mark Ready</button>
                      )}
                      {order.status === 'ready' && (
                        <button onClick={() => updateStatus(order.id, 'delivered')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700">Mark Delivered</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
