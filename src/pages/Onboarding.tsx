import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Find Local Gems",
      desc: "Discover hidden artisanal food spots and unique flavors right in your neighborhood.",
      img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Fresh & Fast",
      desc: "Get fresh, locally sourced meals and ingredients delivered swiftly to your door.",
      img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Support Community",
      desc: "Every order helps sustain local vendors and keeps the neighborhood vibrant.",
      img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="h-screen bg-surface text-on-surface flex flex-col overflow-hidden">
      <header className="flex justify-between items-center px-4 h-16 w-full shrink-0 z-10">
        <div className="font-display text-2xl font-bold text-primary">LocalBite</div>
        <button onClick={() => navigate('/login')} className="font-label-sm text-sm text-on-surface-variant hover:text-primary transition-colors py-2 px-4">Skip</button>
      </header>

      <main className="flex-grow flex flex-col relative w-full h-full p-4">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-sm mb-8 relative rounded-3xl overflow-hidden shadow-[0px_12px_32px_rgba(39,101,124,0.1)] bg-white h-72">
            <img src={slides[currentSlide].img} alt="" className="w-full h-full object-cover transition-opacity duration-300" />
          </div>
          <h2 className="font-headline-md text-2xl font-bold text-primary mb-4">{slides[currentSlide].title}</h2>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-xs">{slides[currentSlide].desc}</p>
        </div>
      </main>

      <footer className="w-full px-4 pb-8 pt-4 bg-surface flex flex-col items-center gap-6 shrink-0 z-10">
        <div className="flex gap-2 justify-center items-center h-4">
          {slides.map((_, idx) => (
            <div key={idx} className={clsx("h-2 rounded-full transition-all duration-300", idx === currentSlide ? "w-6 bg-primary" : "w-2 bg-surface-dim")}></div>
          ))}
        </div>
        <button onClick={handleNext} className="w-full max-w-sm bg-primary text-on-primary font-headline-sm text-lg font-semibold rounded-xl py-4 shadow-lg hover:bg-primary-container transition-colors active:scale-95 duration-200 flex justify-center items-center gap-2">
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{currentSlide === slides.length - 1 ? 'check' : 'arrow_forward'}</span>
        </button>
      </footer>
    </div>
  );
}
