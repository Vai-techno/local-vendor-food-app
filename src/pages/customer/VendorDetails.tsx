import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../CartContext';

export default function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/vendors/${id}`)
      .then(res => res.json())
      .then(data => {
        setVendor(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;
  if (!vendor) return <div className="p-8 text-center">Vendor not found.</div>;

  const cartCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Header */}
      <div className="relative h-64 w-full">
        <img src={vendor.image_url} alt={vendor.business_name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-display font-bold mb-2">{vendor.business_name}</h1>
          <p className="opacity-90">{vendor.cuisine}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {vendor.rating}</span>
            <span>•</span>
            <span>{vendor.delivery_time}</span>
            <span>•</span>
            <span>{vendor.distance}</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-headline-md font-bold mb-6">Menu</h2>
        
        <div className="space-y-6">
          {vendor.foods?.map((food: any) => (
            <div key={food.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-surface-variant">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`material-symbols-outlined text-sm ${food.is_veg ? 'text-green-600' : 'text-red-600'}`} style={{ fontVariationSettings: "'FILL' 1" }}>stop_circle</span>
                  <h3 className="font-bold text-lg">{food.name}</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">₹{food.price}</span>
                  {food.original_price > food.price && <span className="text-sm line-through text-gray-400">₹{food.original_price}</span>}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{food.description}</p>
              </div>
              <div className="relative">
                <img src={food.image_url} alt={food.name} className="w-28 h-28 object-cover rounded-xl" />
                <button 
                  onClick={() => addItem({
                    id: Date.now(), // Generate unique cart item id
                    food_id: food.id,
                    vendor_id: vendor.id,
                    name: food.name,
                    price: food.price,
                    quantity: 1,
                    image_url: food.image_url,
                    vendor_name: vendor.business_name
                  })}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-primary border border-primary font-bold px-4 py-1 rounded-lg shadow-sm hover:bg-primary hover:text-white transition-colors uppercase text-sm"
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 md:px-8 max-w-4xl mx-auto z-50">
          <button 
            onClick={() => navigate('/cart')}
            className="w-full bg-primary text-white rounded-xl py-4 px-6 flex justify-between items-center shadow-lg hover:bg-primary-container transition-colors"
          >
            <span className="font-bold bg-white/20 px-2 py-1 rounded">{cartCount} items</span>
            <span className="font-bold flex items-center gap-2">View Cart <span className="material-symbols-outlined">shopping_cart</span></span>
          </button>
        </div>
      )}
    </div>
  );
}
