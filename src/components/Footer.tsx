import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QUOTES_ARRAY } from '../lib/consts';
import { useState } from 'react';

function initQuote(list: string[]) {
  const r = Math.floor(Math.random() * list.length);
  return { index: r, content: list[r] };
}

const Footer = () => {
  const [currentQuote, setCurrentQuote] = useState(() => initQuote(QUOTES_ARRAY));

  const handlePrev = () => {
    setCurrentQuote(prev => {
      if (prev.index > 0) {
        const newIndex = prev.index - 1;
        return {
          index: newIndex,
          content: QUOTES_ARRAY[newIndex]
        };
      }
      return prev;
    });
  };

  const handleNext = () => {
    setCurrentQuote(next => {

      if (next.index < QUOTES_ARRAY.length - 1) {
        const newIndex = next.index + 1;
        return {
          index: newIndex,
          content: QUOTES_ARRAY[newIndex]
        };
      }
      return next;
    });
  };

  const hasPrev = currentQuote.index > 0;
  const hasNext = currentQuote.index < QUOTES_ARRAY.length - 1;
  const quote = currentQuote.content.split("<br>");

  return (
    <footer className="w-full max-w-3xl mx-auto pb-12 sm:pb-20 text-center px-6">
      <div className="w-full h-px bg-border/40 my-12 mx-auto max-w-[200px]" />

      <div className="flex items-center justify-center gap-6 sm:gap-8 mb-12">
        <ArrowLeft
          className={`w-5 h-5 text-muted-foreground transition-all duration-300 ${hasPrev ? 'hover:text-primary hover:-translate-x-1 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
          onClick={handlePrev}
        />

        <div className="min-h-[60px] flex items-center justify-center max-w-[450px]">
          <p className="font-display italic text-lg sm:text-xl text-muted-foreground/80 leading-relaxed">
            {quote.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <ArrowRight
          className={`w-5 h-5 text-muted-foreground transition-all duration-300 ${hasNext ? 'hover:text-primary hover:translate-x-1 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
          onClick={handleNext}
        />
      </div>

{/*       <p className="text-sm text-muted-foreground/60 font-light">
        &copy; {new Date().getFullYear()} kygra.xyz
      </p> */}
    </footer>
  );
};

export default Footer;
