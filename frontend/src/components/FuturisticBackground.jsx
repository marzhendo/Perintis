import React, { useEffect, useRef } from 'react';

export default function FuturisticBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    // Adaptive particle count based on screen size
    const particleCount = Math.min(80, Math.floor((width * height) / 20000));
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 150 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 1;
        this.glow = Math.random() > 0.75;
        this.pulse = Math.random() * Math.PI;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse push interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.5;
            this.y += Math.sin(angle) * force * 1.5;
          }
        }

        this.pulse += 0.015;
      }

      draw() {
        const isDark = document.documentElement.classList.contains('dark');
        ctx.beginPath();
        const size = this.size + (this.glow ? Math.sin(this.pulse) * 0.8 : 0);
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.glow ? 'rgba(255, 107, 26, 0.7)' : (isDark ? 'rgba(250, 246, 238, 0.25)' : 'rgba(23, 28, 56, 0.25)');
        if (this.glow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#FF6B1A';
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawGrid = (offset) => {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.strokeStyle = isDark ? 'rgba(250, 246, 238, 0.025)' : 'rgba(23, 28, 56, 0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;

      for (let x = offset % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = offset % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    let gridOffset = 0;

    const animate = () => {
      const isDark = document.documentElement.classList.contains('dark');
      // Dark / light base bg
      ctx.fillStyle = isDark ? '#0B0E14' : '#FAF6EE';
      ctx.fillRect(0, 0, width, height);

      // Soft light/dark auroras / glowing gradients
      const gradient1 = ctx.createRadialGradient(width * 0.15, height * 0.2, 50, width * 0.15, height * 0.2, 450);
      gradient1.addColorStop(0, isDark ? 'rgba(255, 107, 26, 0.06)' : 'rgba(255, 107, 26, 0.04)');
      gradient1.addColorStop(1, isDark ? 'rgba(11, 14, 20, 0)' : 'rgba(250, 246, 238, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      const gradient2 = ctx.createRadialGradient(width * 0.85, height * 0.8, 50, width * 0.85, height * 0.8, 500);
      gradient2.addColorStop(0, isDark ? 'rgba(250, 246, 238, 0.02)' : 'rgba(23, 28, 56, 0.02)');
      gradient2.addColorStop(1, isDark ? 'rgba(11, 14, 20, 0)' : 'rgba(250, 246, 238, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Shifting grid
      gridOffset -= 0.1;
      drawGrid(gridOffset);

      // Update & Draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Connections between particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.strokeStyle = isDark ? `rgba(250, 246, 238, ${alpha})` : `rgba(23, 28, 56, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connection to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.2;
            ctx.strokeStyle = `rgba(255, 107, 26, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
