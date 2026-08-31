import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'vendor') navigate('/vendor');
        else navigate('/home');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Is the server running?');
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-body-md overflow-x-hidden">
      <div className="hidden md:block w-1/2 h-screen relative bg-surface-container">
        <div className="w-full h-full bg-cover bg-center absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1200&auto=format&fit=crop')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white z-10">
          <h1 className="font-display text-5xl font-bold mb-4">Discover Local Taste.</h1>
          <p className="font-body-lg text-lg max-w-md">Connect with artisanal vendors and fresh food right in your neighborhood.</p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 min-h-screen flex flex-col px-4 md:px-12 py-8 justify-between relative bg-surface-container-lowest">
        <div className="flex justify-between items-center mb-12">
          <div className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            LocalBite
          </div>
          <button onClick={() => navigate('/home')} className="text-secondary font-label-bold text-sm font-bold hover:opacity-80 transition-opacity">Explore as Guest</button>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="font-headline-lg text-3xl font-bold text-on-background mb-2">Welcome Back</h2>
            <p className="font-body-sm text-sm text-on-surface-variant">Sign in to order from your favorite local vendors.</p>
          </div>
          
          {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">mail</span>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent border border-outline-variant rounded-lg font-body-sm text-sm text-on-background placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                  placeholder="Email" 
                  required 
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">lock</span>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-transparent border border-outline-variant rounded-lg font-body-sm text-sm text-on-background placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                  placeholder="Password" 
                  required 
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 mb-6">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-transparent" />
                <label htmlFor="remember" className="ml-2 block font-body-sm text-sm text-on-surface-variant">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-label-bold text-xs font-bold text-secondary hover:text-primary transition-colors">Forgot Password?</a>
              </div>
            </div>
            
            <button type="submit" className="w-full bg-primary text-on-primary font-headline-sm text-lg font-semibold rounded-xl py-3 flex items-center justify-center hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 hover:-translate-y-1 transform duration-200">
              Sign In
            </button>
          </form>
          
          <p className="mt-8 text-center font-body-sm text-sm text-on-surface-variant">
            New to LocalBite? <Link to="/register" className="font-label-bold text-xs font-bold text-primary hover:underline ml-1">Sign Up</Link>
          </p>
          
          <div className="mt-8 text-center text-xs text-on-surface-variant bg-surface p-4 rounded-lg">
             <p className="font-bold mb-1">Demo Credentials:</p>
             <p>Customer: customer@example.com / customer123</p>
             <p>Vendor: sharma@example.com / vendor123</p>
             <p>Admin: admin@localbite.com / admin123</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-surface-variant text-center">
          <p className="font-body-sm text-sm text-on-surface-variant mb-2">Own a local business?</p>
          <Link to="/register?type=vendor" className="inline-flex items-center gap-1 font-label-bold text-sm font-bold text-secondary hover:text-primary transition-colors group">
            Become a Vendor 
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
