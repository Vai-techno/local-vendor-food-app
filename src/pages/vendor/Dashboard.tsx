import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-surface-container-low">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-surface-variant flex flex-col hidden md:flex">
        <div className="p-6 border-b border-surface-variant">
          <h1 className="text-2xl font-display font-bold text-primary">LocalBite</h1>
          <p className="text-sm text-gray-500 mt-1">Vendor Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </a>
          <button onClick={() => navigate('/vendor/orders')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
            <span className="material-symbols-outlined">list_alt</span> Orders
          </button>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
            <span className="material-symbols-outlined">restaurant_menu</span> Menu
          </a>
        </nav>
        <div className="p-4 border-t border-surface-variant">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full font-medium">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-surface-variant p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-display font-bold text-primary">LocalBite Vendor</h1>
          <button onClick={() => navigate('/vendor/orders')} className="material-symbols-outlined">menu</button>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.name}</h2>
              <p className="text-gray-500">Here's what's happening with your store today.</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-container">
              + Add Food
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat Cards */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-variant">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><span className="material-symbols-outlined">shopping_bag</span></div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Today's Orders</p>
              <h3 className="text-3xl font-bold">12</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-variant">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><span className="material-symbols-outlined">payments</span></div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Today's Revenue</p>
              <h3 className="text-3xl font-bold">₹4,250</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-variant">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><span className="material-symbols-outlined">pending_actions</span></div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Pending Orders</p>
              <h3 className="text-3xl font-bold">3</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-variant">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><span className="material-symbols-outlined">star</span></div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Average Rating</p>
              <h3 className="text-3xl font-bold">4.8</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-surface-variant p-6">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <p className="text-gray-500">Go to Orders tab to view and manage your orders.</p>
            <button onClick={() => navigate('/vendor/orders')} className="mt-4 text-primary font-bold hover:underline">View Orders &rarr;</button>
          </div>
        </div>
      </main>
    </div>
  );
}
