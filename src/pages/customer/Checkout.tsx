import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-center">
       <h2>Checkout</h2>
       <button onClick={() => navigate('/home')}>Home</button>
    </div>
  );
}
