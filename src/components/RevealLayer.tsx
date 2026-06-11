import { useEffect, useRef, useState, CSSProperties } from 'react';

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

const SPOTLIGHT_R = 260;

export default function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskUrl, setMaskUrl] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (cursorX === -999 && cursorY === -999) {
      setMaskUrl('');
      return;
    }

    // Build a radial gradient at (cursorX, cursorY) from radius 0 -> SPOTLIGHT_R
    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R
    );

    // Stops specified in the instruction:
    // 0 -> rgba(255,255,255,1), 0.4 -> 1, 0.6 -> 0.75, 0.75 -> 0.4, 0.88 -> 0.12, 1 -> 0
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
    gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    try {
      const dataUrl = canvas.toDataURL();
      setMaskUrl(dataUrl);
    } catch (err) {
      console.error('Error generating mask data URL:', err);
    }
  }, [cursorX, cursorY]);

  const hasCursor = cursorX !== -999 && cursorY !== -999;
  const maskValue = hasCursor && maskUrl 
    ? `url(${maskUrl})` 
    : 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)';

  const revealStyle: CSSProperties = {
    backgroundImage: `url(${image})`,
    maskImage: maskValue,
    WebkitMaskImage: maskValue,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
        id="spotlight-reveal-canvas"
      />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={revealStyle}
        id="spotlight-reveal-layer"
      />
    </>
  );
}
