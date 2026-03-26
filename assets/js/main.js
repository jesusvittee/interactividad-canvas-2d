(() => {
  const canvas = document.getElementById("mainCanvas");
  const ctx = canvas.getContext("2d");

  // ─── CANVAS SIZE ──────────────────────────────────────────────
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = Math.floor(rect.width)  || 800;
    canvas.height = Math.floor(rect.height) || 520;
  }
  resizeCanvas();
  const W = () => canvas.width;
  const H = () => canvas.height;

  // ─── PALETTE ──────────────────────────────────────────────────
  const COLORS = [
    { base: "#00e5ff", glow: "rgba(0,229,255,0.35)" },
    { base: "#a8ff3e", glow: "rgba(168,255,62,0.35)" },
    { base: "#ff9f3e", glow: "rgba(255,159,62,0.35)" },
    { base: "#c77dff", glow: "rgba(199,125,255,0.35)" },
    { base: "#ff6b9d", glow: "rgba(255,107,157,0.35)" },
    { base: "#4ecdc4", glow: "rgba(78,205,196,0.35)" },
  ];

  // ─── STATE ────────────────────────────────────────────────────
  let level         = 1;
  let eliminated    = 0;   // total ever removed
  let levelElim     = 0;   // removed in current level
  const LEVEL_SIZE  = 10;
  let baseSpeed     = 0.8;
  let circles       = [];
  let mouseX        = -999, mouseY = -999;

  // ─── CIRCLE CLASS ─────────────────────────────────────────────
  class Circle {
    constructor(index) {
      this.id      = index;
      this.radius  = Math.random() * 22 + 18;
      this.x       = Math.random() * (W() - this.radius * 2) + this.radius;
      this.y       = H() + this.radius + Math.random() * 200;

      // Random horizontal drift component (wander)
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.wanderSpeed = (Math.random() * 0.6 + 0.4) * baseSpeed;

      // Color from palette
      const c      = COLORS[index % COLORS.length];
      this.colorBase = c.base;
      this.colorGlow = c.glow;
      this.label   = index + 1;

      // Hover / fade state
      this.hovered  = false;
      this.alpha    = 1;
      this.fading   = false;
      this.dead     = false;
    }

    // Wander: slowly rotate wander angle → horizontal sway + upward movement
    update() {
      if (this.dead) return;

      if (this.fading) {
        this.alpha -= 0.025;
        if (this.alpha <= 0) {
          this.alpha = 0;
          this.dead  = true;
          onCircleRemoved();
          return;
        }
        // still drifts while fading
      }

      // Gently rotate wander angle for organic movement
      this.wanderAngle += (Math.random() - 0.5) * 0.12;

      const speed = this.wanderSpeed;
      this.x += Math.cos(this.wanderAngle) * speed * 0.7;
      this.y -= speed; // primary: upward

      // Wrap horizontally (exit/enter sides)
      if (this.x < -this.radius)  this.x = W() + this.radius;
      if (this.x > W() + this.radius) this.x = -this.radius;

      // Check if fully off top
      if (this.y < -this.radius && !this.fading) {
        this.y = H() + this.radius + Math.random() * 100;
        this.x = Math.random() * (W() - this.radius * 2) + this.radius;
        this.wanderAngle = Math.random() * Math.PI * 2;
      }
    }

    draw() {
      if (this.dead) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;

      // Glow ring on hover
      if (this.hovered && !this.fading) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = this.colorBase;
        ctx.lineWidth   = 2;
        ctx.shadowColor = this.colorBase;
        ctx.shadowBlur  = 18;
        ctx.stroke();
        ctx.shadowBlur  = 0;
      }

      // Fill
      const grad = ctx.createRadialGradient(
        this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1,
        this.x, this.y, this.radius
      );
      grad.addColorStop(0, this.hovered ? "#ffffff" : this.colorBase);
      grad.addColorStop(1, this.colorGlow);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Border
      ctx.strokeStyle = this.hovered ? "#ffffff" : this.colorBase;
      ctx.lineWidth   = this.hovered ? 2 : 1;
      ctx.stroke();

      // Label
      ctx.fillStyle   = this.hovered ? "#000000" : "#ffffff";
      ctx.font        = `bold ${Math.max(11, this.radius * 0.55)}px 'Space Mono', monospace`;
      ctx.textAlign   = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.label, this.x, this.y);

      ctx.restore();
    }

    contains(px, py) {
      const dx = px - this.x, dy = py - this.y;
      return dx * dx + dy * dy <= this.radius * this.radius;
    }
  }

  // ─── SPAWN BATCH ──────────────────────────────────────────────
  function spawnLevel(lvl) {
    circles = [];
    levelElim = 0;
    const speed = baseSpeed + (lvl - 1) * 0.35;
    for (let i = 0; i < LEVEL_SIZE; i++) {
      const c = new Circle(i);
      c.wanderSpeed = (Math.random() * 0.6 + 0.4) * speed;
      // stagger spawn heights
      c.y = H() + c.radius + i * 60 + Math.random() * 80;
      circles.push(c);
    }
    updateUI();
  }

  // ─── ON CIRCLE REMOVED ────────────────────────────────────────
  function onCircleRemoved() {
    eliminated++;
    levelElim++;
    updateUI();

    if (levelElim >= LEVEL_SIZE) {
      // All eliminated → next level after delay
      setTimeout(() => {
        level++;
        showLevelUp(level);
        setTimeout(() => {
          hideLevelUp();
          spawnLevel(level);
        }, 2200);
      }, 600);
    }
  }

  // ─── LEVEL UP OVERLAY ─────────────────────────────────────────
  function showLevelUp(lvl) {
    document.getElementById("overlayLevel").textContent = lvl;
    document.getElementById("levelUpOverlay").classList.add("show");
  }
  function hideLevelUp() {
    document.getElementById("levelUpOverlay").classList.remove("show");
  }

  // ─── UPDATE UI ────────────────────────────────────────────────
  function updateUI() {
    const active = circles.filter(c => !c.dead).length;
    const pct    = LEVEL_SIZE > 0 ? Math.round((levelElim / LEVEL_SIZE) * 100) : 0;
    const speed  = (baseSpeed + (level - 1) * 0.35).toFixed(2);

    document.getElementById("navLevel").textContent    = level;
    document.getElementById("navElim").textContent     = eliminated;
    document.getElementById("statLevel").textContent   = level;
    document.getElementById("statElim").textContent    = eliminated;
    document.getElementById("statPercent").textContent = `${pct}% del nivel`;
    document.getElementById("progressBar").style.width = `${(levelElim / LEVEL_SIZE) * 100}%`;
    document.getElementById("progressText").textContent = `${levelElim} / ${LEVEL_SIZE}`;
    document.getElementById("activeCount").textContent = active;
    document.getElementById("speedLabel").textContent  = `x${speed} — Nivel ${level}`;

    // Speed dots (up to 5)
    const dots = document.querySelectorAll("#speedDots .dot");
    dots.forEach((d, i) => {
      d.classList.toggle("active", i < Math.min(level, 5));
    });
  }

  // ─── MOUSE / CLICK EVENTS ─────────────────────────────────────
  function toCanvas(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width  / rect.width),
      y: (clientY - rect.top)  * (canvas.height / rect.height),
    };
  }

  canvas.addEventListener("mousemove", e => {
    const p = toCanvas(e.clientX, e.clientY);
    mouseX = p.x; mouseY = p.y;
  });

  canvas.addEventListener("mouseleave", () => {
    mouseX = -999; mouseY = -999;
  });

  canvas.addEventListener("click", e => {
    const p = toCanvas(e.clientX, e.clientY);
    for (const c of circles) {
      if (!c.dead && !c.fading && c.contains(p.x, p.y)) {
        c.fading = true;
        break;
      }
    }
  });

  // ─── BACKGROUND GRID ─────────────────────────────────────────
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = "rgba(30,39,48,0.6)";
    ctx.lineWidth   = 1;
    const step = 40;
    for (let x = 0; x <= W(); x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H()); ctx.stroke();
    }
    for (let y = 0; y <= H(); y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W(), y); ctx.stroke();
    }
    ctx.restore();
  }

  // ─── ANIMATION LOOP ───────────────────────────────────────────
  function loop() {
    requestAnimationFrame(loop);

    // Background
    ctx.fillStyle = "#080b10";
    ctx.fillRect(0, 0, W(), H());
    drawGrid();

    // Update hover
    circles.forEach(c => {
      c.hovered = !c.fading && !c.dead && c.contains(mouseX, mouseY);
    });

    // Update + draw
    circles.forEach(c => c.update());
    circles.forEach(c => c.draw());

    // Canvas cursor
    const anyHover = circles.some(c => c.hovered);
    canvas.style.cursor = anyHover ? "pointer" : "crosshair";
  }

  // ─── INIT ─────────────────────────────────────────────────────
  // Wait one frame so the CSS layout settles before reading dimensions
  requestAnimationFrame(() => {
    resizeCanvas();
    spawnLevel(1);
    loop();
  });

  // Keep canvas in sync if window resizes
  new ResizeObserver(() => resizeCanvas()).observe(canvas);

})();