import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

export const Carousel = ({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 3000,
}) => {
  const [curr, setCurr] = useState(0);

  const prev = () => {
    setCurr((curr) => (curr === 0 ? slides?.length - 1 : curr - 1));
  };

  const next = () => {
    setCurr((curr) => (curr === slides?.length - 1 ? 0 : curr + 1));
  };

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides}
      </div>
      {slides?.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            className="p-1 text-gray-800 bg-white rounded-full shadow opacity-80 hover:bg-white"
            onClick={prev}
          >
            <ChevronLeft size={40} />
          </button>
          <button
            className="p-1 text-gray-800 bg-white rounded-full shadow opacity-80 hover:bg-white"
            onClick={next}
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      <div className="absolute left-0 right-0 bottom-4">
        <div className="flex items-center justify-center gap-2">
          {slides?.map((_, i) => (
            <div
              className={`
                            transition-all w-3 h-3 bg-white rounded-full
                            ${curr === i ? "p-2" : "bg-opacity-50"}
                        `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
