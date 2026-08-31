import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-display font-bold">LocalBite Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-xl font-bold">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl font-medium">
            <span className="material-symbols-outlined">storefront</span> Vendors
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl font-medium">
            <span className="material-symbols-outlined">group</span> Users
          </a>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg w-full font-medium">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold text-gray-900">Admin</h1>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Platform Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium mb-1">Total Users</p>
              <h3 className="text-3xl font-bold">1,248</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium mb-1">Active Vendors</p>
              <h3 className="text-3xl font-bold">24</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold">8,432</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium mb-1">Platform Revenue</p>
              <h3 className="text-3xl font-bold text-green-600">₹42,500</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
