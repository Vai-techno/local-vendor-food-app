import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import AIChat from '../../components/AIChat';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vendors, setVendors] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetch('/api/vendors')
      .then(res => res.json())
      .then(data => setVendors(data))
      .catch(console.error);
  }, []);

  const categories = [
    { name: 'All', icon: 'apps' },
    { name: 'North Indian', icon: 'restaurant' },
    { name: 'Pizza', icon: 'local_pizza' },
    { name: 'South Indian', icon: 'rice_bowl' },
    { name: 'Fast Food', icon: 'lunch_dining' },
    { name: 'Healthy', icon: 'eco' },
    { name: 'Chinese', icon: 'ramen_dining' },
    { name: 'Desserts', icon: 'cake' },
  ];

  const processedVendors = useMemo(() => {
    let result = [...vendors];
    
    if (selectedCategory !== 'All') {
      result = result.filter(v => v.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    
    // Sort by location (distance)
    result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    
    return result;
  }, [vendors, selectedCategory]);

  return (
    <div className="bg-background text-on-background pb-24 md:pb-0 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-surface z-40 flex justify-between items-center px-4 h-16 w-full shadow-[0px_4px_20px_rgba(39,101,124,0.05)]">
        <div className="flex items-center gap-2 text-primary cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
          <span className="font-headline-sm text-sm md:text-base font-bold truncate">Deliver to: Kanpur</span>
        </div>
        <div className="hidden md:block font-display text-2xl font-bold text-primary">LocalBite</div>
        <div className="flex gap-4 items-center">
          <span className="font-label-bold text-sm hidden md:block">Hi, {user?.name}</span>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Search */}
        <div className="mb-8">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
            </div>
            <input 
              type="text" 
              className="block w-full pl-12 pr-4 py-4 bg-surface border border-surface-dim rounded-full font-body-md text-base placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-shadow hover:shadow-md" 
              placeholder="Search for food, dishes or restaurants" 
            />
          </div>
        </div>

        {/* Hero */}
        <section className="mb-12 rounded-3xl overflow-hidden relative min-h-[300px] flex items-center shadow-md">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
          <div className="relative z-10 p-6 md:p-12 max-w-lg text-white">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Support Local.<br/>Eat Delicious.</h1>
            <p className="font-body-lg text-lg mb-6 text-gray-200">Discover the best artisanal food from verified local vendors.</p>
            <button className="bg-primary text-white font-headline-sm font-semibold py-3 px-8 rounded-full hover:bg-primary-container transition-colors shadow-lg">Order Now</button>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="font-headline-md text-2xl font-bold mb-6">Quick Categories</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 text-center">
            {categories.map(cat => (
              <div key={cat.name} onClick={() => setSelectedCategory(cat.name)} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-sm ${selectedCategory === cat.name ? 'bg-primary text-white' : 'bg-surface-container-high group-hover:bg-primary-container group-hover:text-on-primary-container'}`}>
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <span className={`font-label-sm font-medium text-sm ${selectedCategory === cat.name ? 'text-primary font-bold' : ''}`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Vendors */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline-md text-2xl font-bold">Nearby Vendors</h2>
            <span className="font-label-sm text-sm font-medium text-primary cursor-pointer hover:underline">See All</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedVendors.length > 0 ? (
              processedVendors.map(vendor => (
                <div key={vendor.id} onClick={() => navigate(`/vendor/${vendor.id}`)} className="bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group border border-surface-variant">
                  <div className="relative h-48 w-full">
                    <img src={vendor.image_url} alt={vendor.business_name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm text-on-surface">
                      <span className="material-symbols-outlined text-base text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-label-bold text-sm font-bold">{vendor.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-sm text-lg font-bold">{vendor.business_name}</h3>
                      <span className="bg-secondary/15 text-secondary font-label-bold text-xs font-bold px-2 py-1 rounded">{vendor.distance}</span>
                    </div>
                    <p className="font-body-sm text-sm text-on-surface-variant mb-4">{vendor.cuisine}</p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-secondary">verified</span>
                      <span className="font-label-sm text-sm text-secondary">Local Verified • {vendor.delivery_time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                <h3 className="text-lg font-medium">No vendors found for this category</h3>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl border-t border-surface-variant">
        <button className="flex flex-col items-center justify-center text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-sm text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-xs mt-1">Search</span>
        </button>
        <button onClick={() => navigate('/cart')} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="font-label-sm text-xs mt-1">Cart</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-xs mt-1">Profile</span>
        </button>
      </nav>
      
      {/* AI Assistant FAB */}
      {!showChat && (
        <button onClick={() => setShowChat(true)} className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-secondary text-white rounded-full px-4 py-3 flex items-center gap-2 shadow-lg hover:-translate-y-1 transition-transform z-40">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="font-headline-sm font-semibold hidden sm:inline">LocalBite AI</span>
        </button>
      )}

      {showChat && <AIChat onClose={() => setShowChat(false)} />}
    </div>
  );
}
