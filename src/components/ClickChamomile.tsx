import { useState, useEffect } from 'react';

interface ClickChamomileProps {
  enabled?: boolean;
  soundEnabled?: boolean;
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

export function ClickChamomile({ enabled = true, soundEnabled = true }: ClickChamomileProps) {
  const [chamomiles, setChamomiles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    startTime: number;
    colorIndex: number;
    combo?: number;
  }>>([]);
  const [nextId, setNextId] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  
  const playSound = (frequency: number, duration: number, comboMultiplier: number = 1) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency * comboMultiplier;
      oscillator.type = comboMultiplier > 1 ? 'triangle' : 'sine';
      
      const volume = Math.min(0.3 * comboMultiplier, 0.6);
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      // Комбо звук - дополнительная нота
      if (comboMultiplier > 1) {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.value = frequency * comboMultiplier * 1.5;
        oscillator2.type = 'sine';
        
        gainNode2.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration * 0.5);
        
        oscillator2.start(audioContext.currentTime + 0.05);
        oscillator2.stop(audioContext.currentTime + duration * 0.5);
      }
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

  useEffect(() => {
    if (!enabled) return;

    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime;
      
      // Комбо: если клик меньше чем за 500мс
      let currentCombo = 1;
      if (timeSinceLastClick < 500) {
        currentCombo = Math.min(comboCount + 1, 10);
        setComboCount(currentCombo);
      } else {
        setComboCount(1);
        currentCombo = 1;
      }
      
      setLastClickTime(now);

      const colorIndex = Math.floor(Math.random() * chamomileColors.length);
      const baseFrequency = 400 + colorIndex * 100 + Math.random() * 200;
      const comboMultiplier = 1 + (currentCombo - 1) * 0.1;
      
      playSound(baseFrequency, 0.15, comboMultiplier);

      const newChamomile = {
        id: nextId,
        x: clientX,
        y: clientY,
        startTime: now,
        colorIndex,
        combo: currentCombo > 1 ? currentCombo : undefined,
      };

      setChamomiles((prev) => [...prev, newChamomile]);
      setNextId((prev) => prev + 1);
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [enabled, lastClickTime, comboCount, nextId, soundEnabled]);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ touchAction: 'none' }}
    >
      {chamomiles.map((chamomile) => {
        const elapsed = Date.now() - chamomile.startTime;
        const progress = Math.min(elapsed / 3000, 1);
        const opacity = 1 - progress;
        const scale = 0.5 + progress * 1.5 * (chamomile.combo ? 1 + chamomile.combo * 0.1 : 1);
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
              
              {/* Текст с названием цвета или комбо */}
              {progress < 0.15 && (
                <text
                  x="50"
                  y="85"
                  textAnchor="middle"
                  fill={colors.center}
                  fontSize={chamomile.combo ? "12" : "8"}
                  fontWeight="bold"
                  opacity={1 - (progress / 0.15)}
                >
                  {chamomile.combo ? `x${chamomile.combo} COMBO!` : colors.name}
                </text>
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
