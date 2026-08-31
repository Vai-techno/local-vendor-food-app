import { useNavigate } from 'react-router-dom';
import { useCart } from '../../CartContext';
import { useAuth } from '../../AuthContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    // Group by vendor - simple logic assumes single vendor for now based on context add item logic
    const vendor_id = items[0].vendor_id;
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendor_id,
          items: items.map(i => ({ food_id: i.food_id, quantity: i.quantity, price: i.price })),
          total_amount: total
        })
      });
      
      if (res.ok) {
        clearCart();
        navigate('/orders');
      } else {
        alert('Checkout failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-surface sticky top-0 z-40 flex items-center px-4 h-16 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold ml-4">Cart</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_bag</span>
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate('/home')} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Browse Food</button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-surface-variant p-4 mb-6">
              <h2 className="font-bold border-b pb-3 mb-4">{items[0]?.vendor_name}</h2>
              <div className="space-y-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex gap-4 items-center flex-1">
                      {item.image_url && <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="font-bold text-sm">₹{item.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-surface-container rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary"><span className="material-symbols-outlined text-sm">remove</span></button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary"><span className="material-symbols-outlined text-sm">add</span></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-surface-variant p-4 mb-24">
              <h3 className="font-bold mb-4">Bill Details</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4 border-b pb-4">
                <div className="flex justify-between"><span>Item Total</span><span>₹{total}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span>₹40</span></div>
                <div className="flex justify-between"><span>Platform Fee</span><span>₹5</span></div>
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹0</span></div>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>To Pay</span>
                <span>₹{total + 45}</span>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-surface-variant z-50">
              <div className="max-w-2xl mx-auto flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Pay Using</p>
                  <p className="font-bold flex items-center gap-1">UPI <span className="material-symbols-outlined text-sm">expand_more</span></p>
                </div>
                <button onClick={handleCheckout} className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-primary-container">
                  Place Order
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
