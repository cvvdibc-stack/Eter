'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const screenshots = [
  { id: 1, title: 'Walka', image: '/screenshots/combat.jpg' },
  { id: 2, title: 'Ekwipunek', image: '/screenshots/inventory.jpg' },
  { id: 3, title: 'Bestiariusz', image: '/screenshots/bestiary.jpg' },
  { id: 4, title: 'Skrzynka Pocztowa', image: '/screenshots/mailbox.jpg' },
  { id: 5, title: 'Aukcje', image: '/screenshots/auctions.jpg' },
];

export function GamePreview() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Zobacz grę w akcji</h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
            {/* Screenshot placeholder */}
            <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-400 mb-2">{screenshots[currentIndex].title}</p>
                <p className="text-slate-500">Screenshot placeholder</p>
              </div>

              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
                aria-label="Poprzedni"
              >
                <ChevronLeft className="text-white" size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
                aria-label="Następny"
              >
                <ChevronRight className="text-white" size={24} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 p-4 bg-slate-900 border-t border-slate-700">
              {screenshots.map((screenshot, index) => (
                <button
                  key={screenshot.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-1 p-2 rounded border transition-colors ${
                    index === currentIndex
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="aspect-video bg-slate-700 rounded flex items-center justify-center">
                    <span className="text-xs text-slate-400">{screenshot.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



