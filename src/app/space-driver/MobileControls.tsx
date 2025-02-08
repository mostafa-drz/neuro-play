// MobileControls.tsx
import React from 'react';

const MobileControls: React.FC = () => {
  const handlePress = (key: string) => {
    // Dispatch a synthetic keydown event to mimic a physical key press.
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    window.dispatchEvent(event);
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
      <button
        onClick={() => handlePress('ArrowLeft')}
        className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-transform duration-100 active:scale-90"
      >
        &#8592;
      </button>
      <button
        onClick={() => handlePress('ArrowUp')}
        className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-transform duration-100 active:scale-90"
      >
        &#8593;
      </button>
      <button
        onClick={() => handlePress('ArrowRight')}
        className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-transform duration-100 active:scale-90"
      >
        &#8594;
      </button>
    </div>
  );
};

export default MobileControls;