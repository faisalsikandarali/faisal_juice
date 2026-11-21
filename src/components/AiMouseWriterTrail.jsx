import React, { useEffect, useRef, useState } from "react";

export default function AiMouseWriterTrail() {
  const canvasRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const pointsRef = useRef([]);
  const glyphsRef = useRef([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const lastSpawn = useRef(0);

  const letters = ["F", "A", "I", "S", "A", "L", "J", "U", "I", "C", "E", "✨", "🌱", "💧", "🍏", "🍐"];
  const colors = ["#10b981", "#34d399", "#6ee7b7", "#f43f5e", "#fbbf24", "#a7f3d0"];

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;
      mousePos.current = { x, y };

      // Add to ribbon stroke points
      pointsRef.current.push({
        x,
        y,
        life: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.min(12, Math.max(3, Math.hypot(e.movementX, e.movementY) * 0.4)),
      });

      // Spawn AI writing letters occasionally
      if (now - lastSpawn.current > 75) {
        lastSpawn.current = now;
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        glyphsRef.current.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -1.2 - Math.random() * 1.8,
          rot: (Math.random() - 0.5) * 0.4,
          life: 1.0,
          char: letter,
          color,
          size: 11 + Math.random() * 5,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw glowing ribbon stroke
      if (pointsRef.current.length > 1) {
        for (let i = 0; i < pointsRef.current.length - 1; i++) {
          const pt = pointsRef.current[i];
          const next = pointsRef.current[i + 1];
          pt.life -= 0.035;

          if (pt.life > 0) {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = pt.color;
            ctx.globalAlpha = pt.life * 0.7;
            ctx.lineWidth = pt.width * pt.life;
            ctx.lineCap = "round";
            ctx.shadowColor = pt.color;
            ctx.shadowBlur = 10;
            ctx.stroke();
          }
        }
        pointsRef.current = pointsRef.current.filter((p) => p.life > 0);
      }

      // 2. Draw floating AI glyphs / letters
      for (let i = 0; i < glyphsRef.current.length; i++) {
        const g = glyphsRef.current[i];
        g.x += g.vx;
        g.y += g.vy;
        g.life -= 0.022;

        if (g.life > 0) {
          ctx.save();
          ctx.translate(g.x, g.y);
          ctx.rotate(g.rot);
          ctx.font = `bold ${g.size}px "Clash Display", monospace`;
          ctx.fillStyle = g.color;
          ctx.shadowColor = g.color;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = g.life * 0.85;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(g.char, 0, 0);
          ctx.restore();
        }
      }
      glyphsRef.current = glyphsRef.current.filter((g) => g.life > 0);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [isEnabled]);

  return (
    <>
      {/* Fullscreen particle canvas */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[99999]"
        />
      )}

      {/* Subtle Bottom-Left AI Writing Mode Badge */}
      <div className="fixed bottom-4 left-4 z-[9999] hidden sm:block">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          title="Toggle AI Kinetic Mouse Writing Trail"
          className="flex items-center gap-2 bg-neutral-900/80 hover:bg-neutral-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <span className={`w-2 h-2 rounded-full ${isEnabled ? "bg-emerald-400 animate-ping" : "bg-neutral-500"}`} />
          <span>{isEnabled ? "🖊️ AI Kinetic Writing: Active" : "🖊️ AI Writing: Paused"}</span>
        </button>
      </div>
    </>
  );
}
