import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-container to-primary">
      <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in-up w-full px-4 text-center">
        <div className="flex flex-col items-center justify-center gap-4 relative">
          <div className="bg-surface-container-lowest/20 p-6 rounded-full shadow-[0px_12px_32px_rgba(39,101,124,0.1)] backdrop-blur-sm animate-pulse-slow">
            <span className="material-symbols-outlined text-surface-container-lowest text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <h1 className="font-display text-5xl text-surface-container-lowest tracking-tight drop-shadow-md font-bold">
            LocalBite
          </h1>
        </div>
        <div className="mt-8">
          <p className="font-headline-sm text-xl text-surface-container-lowest/90 tracking-wide font-medium">
            Discover Local. Eat Fresh. Support Local.
          </p>
        </div>
      </div>
    </div>
  );
}
