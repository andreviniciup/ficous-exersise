import { useState, useEffect } from 'react';

interface TextHighlightProps {
  isVisible: boolean;
}

export function TextHighlight({ isVisible }: TextHighlightProps) {
  const [highlights, setHighlights] = useState<Array<{ top: number; left: number; width: number; height: number }>>([]);

  useEffect(() => {
    if (!isVisible) {
      setHighlights([]);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setHighlights([]);
      return;
    }

    const range = selection.getRangeAt(0);
    const rects = Array.from(range.getClientRects());
    
    const newHighlights = rects.map(rect => ({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    }));

    setHighlights(newHighlights);
  }, [isVisible]);

  if (!isVisible || highlights.length === 0) return null;

  return (
    <>
      {highlights.map((highlight, index) => (
        <div
          key={index}
          className="absolute bg-[#d4e8fb] pointer-events-none z-10"
          style={{
            top: `${highlight.top}px`,
            left: `${highlight.left}px`,
            width: `${highlight.width}px`,
            height: `${highlight.height}px`,
          }}
        />
      ))}
    </>
  );
}