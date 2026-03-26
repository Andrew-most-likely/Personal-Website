(function () {
  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // RGB channels from the site palette so the background is always in-family
  const NODE_RGB   = '61, 79, 102';   // --c-body   (#3d4f66)
  const SYMBOL_RGB = '31, 41, 60';    // --c-heading (#1f293c)
  const ACCENT_RGB = '94, 234, 212';  // --accent    (#5eead4)

  const SYMBOLS = [
    '0xFF', '0x1A', '0b10', '0x2F', '01',
    '//',   '>>',   '{}',   '</>',  '#!',
    '$',    '&&',   '||',   '!=',   '===',
    'sudo', 'grep', 'ssh',  'nmap', '>_',
  ];

  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Network nodes ──────────────────────────────────────────
  const NODE_COUNT = 55;
  const MAX_DIST   = 160;

  const nodes = Array.from({ length: NODE_COUNT }, () => {
    // ~8% of nodes glow teal for subtle accent
    const isAccent = Math.random() < 0.08;
    return {
      x:       Math.random() * W,
      y:       Math.random() * H,
      vx:      (Math.random() - 0.5) * 0.4,
      vy:      (Math.random() - 0.5) * 0.4,
      r:       Math.random() * 1.5 + 1,
      accent:  isAccent,
    };
  });

  // ── Floating terminal symbols ──────────────────────────────
  const FLOAT_COUNT = 22;

  const floaters = Array.from({ length: FLOAT_COUNT }, () => ({
    text:  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    x:     Math.random() * W,
    y:     Math.random() * H,       // scattered at start so they don't all rise at once
    speed: Math.random() * 0.22 + 0.08,
    alpha: Math.random() * 0.045 + 0.018,
    size:  Math.floor(Math.random() * 4) + 11,
  }));

  // ── Draw loop ──────────────────────────────────────────────
  const mobile = () => W < 768;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connections (skip on mobile for performance)
    if (!mobile()) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.1;
            // Teal line if either node is an accent node
            const lineRGB = (nodes[i].accent || nodes[j].accent)
              ? ACCENT_RGB
              : NODE_RGB;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineRGB}, ${a})`;
            ctx.lineWidth   = 0.7;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      const rgb   = n.accent ? ACCENT_RGB : NODE_RGB;
      const alpha = n.accent ? 0.35 : (mobile() ? 0.12 : 0.2);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
      ctx.fill();

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    // Floating symbols
    ctx.textBaseline = 'top';
    for (const f of floaters) {
      ctx.font      = `${f.size}px 'Courier New', Courier, monospace`;
      ctx.fillStyle = `rgba(${SYMBOL_RGB}, ${f.alpha})`;
      ctx.fillText(f.text, f.x, f.y);

      f.y -= f.speed;

      // Reset to bottom when it floats off the top
      if (f.y < -30) {
        f.y    = H + 10;
        f.x    = Math.random() * W;
        f.text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
