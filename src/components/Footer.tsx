import {ArrowLeft, ArrowRight} from 'lucide-react';
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
        return { index: newIndex, 
        content: QUOTES_ARRAY[newIndex] };
      }
      return prev;
    });
  };

  const handleNext = () => {
    setCurrentQuote(next => {

      if (next.index < QUOTES_ARRAY.length-1) {
        const newIndex = next.index + 1;
        return { index: newIndex,
        content: QUOTES_ARRAY[newIndex] };
      }
      return next;
    });
  };

  const hasPrev = currentQuote.index > 0;
  const hasNext = currentQuote.index < QUOTES_ARRAY.length - 1;
  const quote = currentQuote.content.split("<br>");

  return (
    <footer className="w-full max-w-3xl mx-auto pt-4 pb-10 sm:pb-14 text-center">
      <span className="flex items-center py-12 pt-16 border-t border-gray-300">
        <ArrowLeft 
          className={`w-6 h-6 transition-all duration-300 ${
            hasPrev ? 'hover:translate-x-2 hover:cursor-pointer hover:scale-110' : 'opacity-50 cursor-not-allowed scale-75'}`} 
          onClick={handlePrev}
        />
        
        <div className="flex items-center justify-center w-full h-[72px] max-w-[500px] mx-auto text-lg">
          <i className="inline-block text-center select-none">
            {quote[0]}
            {<br />}
            {quote[1]}
          </i>
        </div>

        <ArrowRight 
          className={`w-6 h-6 transition-all duration-300 ${
            hasNext ? 'hover:-translate-x-2 hover:cursor-pointer hover:scale-110' : 'opacity-50 cursor-not-allowed scale-75'}`} 
          onClick={handleNext}
        />
      </span>
    </footer>
  );
};

export default Footer;
