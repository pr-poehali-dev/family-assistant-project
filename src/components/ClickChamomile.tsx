import { useState, useEffect } from 'react';

interface ClickChamomileProps {
  onLoadingComplete?: () => void;
}

const chamomileColors = [
  { petals: '#FFFFFF', center: '#FFD700', centerDark: '#FFA500', name: 'классическая' },
  { petals: '#FFB6C1', center: '#FF69B4', centerDark: '#FF1493', name: 'розовая' },
  { petals: '#E0BBE4', center: '#957DAD', centerDark: '#6A5ACD', name: 'фиолетовая' },
  { petals: '#B0E0E6', center: '#4682B4', centerDark: '#1E90FF', name: 'голубая' },
  { petals: '#FFE4B5', center: '#FFA500', centerDark: '#FF8C00', name: 'персиковая' },
  { petals: '#F0E68C', center: '#FFD700', centerDark: '#DAA520', name: 'золотая' },
  { petals: '#98FB98', center: '#32CD32', centerDark: '#228B22', name: 'мятная' },
  { petals: '#FFE4E1', center: '#FFC0CB', centerDark: '#FF69B4', name: 'нежная' },
];

export function ClickChamomile({ onLoadingComplete }: ClickChamomileProps) {
  const [chamomiles, setChamomiles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    startTime: number;
    colorIndex: number;
  }>>([]);
  const [nextId, setNextId] = useState(0);
  
  const playSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Браузер не поддерживает Web Audio API
    }
  };

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

    const colorIndex = Math.floor(Math.random() * chamomileColors.length);
    const frequency = 400 + colorIndex * 100 + Math.random() * 200;
    
    playSound(frequency, 0.15);

    const newChamomile = {
      id: nextId,
      x: clientX,
      y: clientY,
      startTime: Date.now(),
      colorIndex,
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
        const colors = chamomileColors[chamomile.colorIndex];

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
              filter: `drop-shadow(0 0 ${10 + progress * 20}px ${colors.center}40)`,
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
                    fill={colors.petals}
                    stroke={colors.center}
                    strokeWidth="1.5"
                    transform={`rotate(${angle} 50 50)`}
                    style={{
                      transformOrigin: '50% 50%',
                    }}
                  />
                );
              })}
              {/* Центр ромашки */}
              <circle cx="50" cy="50" r="15" fill={colors.center} />
              <circle cx="50" cy="50" r="12" fill={colors.centerDark} opacity="0.7" />
              
              {/* Анимация загрузки в центре */}
              {progress < 0.8 && (
                <>
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
                  {/* Искорки вокруг */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const sparkAngle = (i * 90) + (progress * 360);
                    const sparkX = 50 + Math.cos((sparkAngle * Math.PI) / 180) * 20;
                    const sparkY = 50 + Math.sin((sparkAngle * Math.PI) / 180) * 20;
                    return (
                      <circle
                        key={`spark-${i}`}
                        cx={sparkX}
                        cy={sparkY}
                        r={2 - progress * 2}
                        fill="white"
                        opacity={(1 - progress) * 0.8}
                      />
                    );
                  })}
                </>
              )}
              
              {/* Текст с названием цвета (первые 0.5 сек) */}
              {progress < 0.15 && (
                <text
                  x="50"
                  y="85"
                  textAnchor="middle"
                  fill={colors.center}
                  fontSize="8"
                  fontWeight="bold"
                  opacity={1 - (progress / 0.15)}
                >
                  {colors.name}
                </text>
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
