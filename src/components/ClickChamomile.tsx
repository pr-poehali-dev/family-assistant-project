import { useState, useEffect } from 'react';

interface ClickChamomileProps {
  onLoadingComplete?: () => void;
}

export function ClickChamomile({ onLoadingComplete }: ClickChamomileProps) {
  const [chamomiles, setChamomiles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    startTime: number;
  }>>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setChamomiles((prev) => {
        const now = Date.now();
        return prev.filter((c) => now - c.startTime < 3000);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newChamomile = {
      id: nextId,
      x: clientX,
      y: clientY,
      startTime: Date.now(),
    };

    setChamomiles((prev) => [...prev, newChamomile]);
    setNextId((prev) => prev + 1);

    if (onLoadingComplete) {
      onLoadingComplete();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-auto"
      onClick={handleClick}
      onTouchStart={handleClick}
      style={{ touchAction: 'none' }}
    >
      {chamomiles.map((chamomile) => {
        const elapsed = Date.now() - chamomile.startTime;
        const progress = Math.min(elapsed / 3000, 1);
        const opacity = 1 - progress;
        const scale = 0.5 + progress * 1.5;
        const rotate = progress * 360;
        const translateY = -progress * 200;

        return (
          <div
            key={chamomile.id}
            className="absolute pointer-events-none"
            style={{
              left: chamomile.x,
              top: chamomile.y,
              transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
              opacity,
              transition: 'none',
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Лепестки ромашки */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 360) / 8;
                return (
                  <ellipse
                    key={i}
                    cx="50"
                    cy="50"
                    rx="12"
                    ry="25"
                    fill="white"
                    stroke="#FFD700"
                    strokeWidth="1"
                    transform={`rotate(${angle} 50 50)`}
                    style={{
                      transformOrigin: '50% 50%',
                    }}
                  />
                );
              })}
              {/* Центр ромашки */}
              <circle cx="50" cy="50" r="15" fill="#FFD700" />
              <circle cx="50" cy="50" r="12" fill="#FFA500" opacity="0.7" />
              
              {/* Анимация загрузки в центре */}
              {progress < 0.8 && (
                <circle
                  cx="50"
                  cy="50"
                  r="8"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray={`${progress * 50} 50`}
                  transform="rotate(-90 50 50)"
                  opacity={1 - progress}
                />
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
