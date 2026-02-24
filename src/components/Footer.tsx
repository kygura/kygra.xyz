import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { QUOTES_ARRAY } from '../lib/consts';
import { useState, useEffect, useCallback } from 'react';

function initQuote(list: string[]) {
  const r = Math.floor(Math.random() * list.length);
  return { index: r, content: list[r] };
}

const Footer = () => {
  const [currentQuote, setCurrentQuote] = useState(() => initQuote(QUOTES_ARRAY));
  const [direction, setDirection] = useState<'left' | 'right' | 'none'>('none');

  const handlePrev = useCallback(() => {
    setCurrentQuote(prev => {
      if (prev.index > 0) {
        setDirection('left');
        const newIndex = prev.index - 1;
        return {
          index: newIndex,
          content: QUOTES_ARRAY[newIndex]
        };
      }
      return prev;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentQuote(next => {
      if (next.index < QUOTES_ARRAY.length - 1) {
        setDirection('right');
        const newIndex = next.index + 1;
        return {
          index: newIndex,
          content: QUOTES_ARRAY[newIndex]
        };
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use A and D keys for navigation
      if (e.key === 'a' || e.key === 'A') {
        handlePrev();
      } else if (e.key === 'd' || e.key === 'D') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const hasPrev = currentQuote.index > 0;
  const hasNext = currentQuote.index < QUOTES_ARRAY.length - 1;
  const quote = currentQuote.content.split("<br>");

  return (
    <footer className="w-full bg-primary border-t border-border/10 py-6 px-12 md:pl-[104px] flex flex-col items-center justify-center relative overflow-hidden font-body text-[0.6rem] tracking-[0.2em] uppercase text-primary-foreground/30">

      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6 group">

        {/* Center/Right Side: Interactive Quote */}
        <div className="relative w-full flex items-center justify-center gap-4 sm:gap-8 px-4">
          {/* Left Control */}
          <div className="flex flex-col items-center gap-1 transition-opacity duration-300 shrink-0">
            <button
              onClick={hasPrev ? handlePrev : undefined}
              disabled={!hasPrev}
              className={`p-1.5 rounded-full transition-all duration-300 ${hasPrev
                ? 'hover:bg-secondary hover:text-primary cursor-pointer text-white'
                : 'opacity-30 cursor-not-allowed text-white'
                }`}
              aria-label="Previous quote"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="hidden sm:block text-[10px] font-mono font-medium tracking-widest uppercase text-white/40">
              [A]
            </span>
          </div>

          {/* Content Area */}
          <div className="flex-1 w-full max-w-3xl overflow-hidden relative z-0 min-h-[14rem] sm:min-h-[12rem] flex flex-col items-center justify-center">
            <div
              key={currentQuote.index}
              className={`w-full flex flex-col items-center justify-center text-center animate-in fade-in ${direction === 'left' ? 'slide-in-from-left-8' :
                direction === 'right' ? 'slide-in-from-right-8' :
                  'zoom-in-95'
                } duration-500 ease-out`}
            >
              <p className="font-display italic text-lg sm:text-2xl text-white leading-relaxed break-words px-2 drop-shadow-md normal-case tracking-normal">
                {quote.map((line, i) => (
                  <span key={i} className="block mb-1 last:mb-0">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Right Control */}
          <div className="flex flex-col items-center gap-1 transition-opacity duration-300 shrink-0">
            <button
              onClick={hasNext ? handleNext : undefined}
              disabled={!hasNext}
              className={`p-1.5 rounded-full transition-all duration-300 ${hasNext
                ? 'hover:bg-secondary hover:text-primary cursor-pointer text-white'
                : 'opacity-30 cursor-not-allowed text-white'
                }`}
              aria-label="Next quote"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <span className="hidden sm:block text-[10px] font-mono font-medium tracking-widest uppercase text-white/40">
              [D]
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
