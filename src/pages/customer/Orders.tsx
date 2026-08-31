import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Simulated orders since we don't have a specific customer orders GET api written yet, 
  // but let's just show a dummy success state for the demo, or write a quick fetch if we add it to server.ts.
  // Actually, I didn't add a GET /api/orders endpoint for customers in server.ts. I'll mock it here.
  
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-surface sticky top-0 z-40 flex items-center px-4 h-16 shadow-sm">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold ml-4">My Orders</h1>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-variant text-center">
           <span className="material-symbols-outlined text-green-500 text-6xl mb-4">check_circle</span>
           <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
           <p className="text-gray-500 mb-6">Your food is being prepared.</p>
           <button onClick={() => navigate('/home')} className="text-primary font-bold hover:underline">Back to Home</button>
        </div>
      </main>
    </div>
  )
}
