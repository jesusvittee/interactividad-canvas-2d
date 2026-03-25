{
    const canvas = document.getElementById("canvasC");
    let ctx = canvas.getContext("2d");

    canvas.height = window.innerHeight / 2;
    canvas.width = window.innerWidth / 2;

    canvas.style.background = "rgb(200, 230, 255)";

    const RED_DURATION = 500;

    class Circle {
        constructor(x, y, radius, text, speed) {
            this.posX = x;
            this.posY = y;
            this.radius = radius;
            this.color = "blue";
            this.text = text;

            this.dx = (Math.random() - 0.5) * speed;
            this.dy = (Math.random() - 0.5) * speed;

            this.redUntil = 0;
        }

        draw(ctx) {
            ctx.beginPath();

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = this.color;
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.text, this.posX, this.posY);

            ctx.closePath();
        }

        move() {
            // rebote con paredes (ajuste fino)
            if (this.posX + this.radius >= canvas.width || this.posX - this.radius <= 0) {
                this.dx *= -1;
            }

            if (this.posY + this.radius >= canvas.height || this.posY - this.radius <= 0) {
                this.dy *= -1;
            }

            this.posX += this.dx;
            this.posY += this.dy;
        }
    }

    // 🔍 DETECCIÓN
    function detectarColision(c1, c2) {
        let dx = c2.posX - c1.posX;
        let dy = c2.posY - c1.posY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        return { colision: dist < (c1.radius + c2.radius), dx, dy, dist };
    }

    // 💥 REBOTE REAL (estable)
    function resolverRebote(c1, c2, dx, dy, dist) {
        if (dist === 0) return;

        let nx = dx / dist;
        let ny = dy / dist;

        // 🔧 evitar que se encimen
        let overlap = (c1.radius + c2.radius) - dist;
        c1.posX -= nx * overlap / 2;
        c1.posY -= ny * overlap / 2;
        c2.posX += nx * overlap / 2;
        c2.posY += ny * overlap / 2;

        // ⚡ intercambio de velocidades proyectadas
        let kx = c1.dx - c2.dx;
        let ky = c1.dy - c2.dy;

        let p = 2 * (kx * nx + ky * ny) / 2;

        c1.dx -= p * nx;
        c1.dy -= p * ny;
        c2.dx += p * nx;
        c2.dy += p * ny;
    }

    // 🔵 CREAR CÍRCULOS SIN ENCIMARSE
    let circles = [];
    let N = 6;

    for (let i = 0; i < N; i++) {
        let intentos = 0;
        let creado = false;

        while (!creado && intentos < 200) {
            let radius = Math.random() * 30 + 20;
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let y = Math.random() * (canvas.height - radius * 2) + radius;

            let overlap = circles.some(c => {
                let dx = c.posX - x;
                let dy = c.posY - y;
                return Math.sqrt(dx * dx + dy * dy) < (c.radius + radius + 5);
            });

            if (!overlap) {
                let speed = Math.random() * 3 + 2;
                circles.push(new Circle(x, y, radius, i + 1, speed));
                creado = true;
            }

            intentos++;
        }
    }

    // 🔄 ANIMACIÓN
    function update() {
        requestAnimationFrame(update);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let now = performance.now();

        // 🎨 colores
        circles.forEach(c => {
            c.color = now < c.redUntil ? "red" : "blue";
        });

        // 🚀 mover
        circles.forEach(c => c.move());

        // 💥 colisiones
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                let { colision, dx, dy, dist } = detectarColision(circles[i], circles[j]);

                if (colision) {
                    resolverRebote(circles[i], circles[j], dx, dy, dist);

                    circles[i].redUntil = now + RED_DURATION;
                    circles[j].redUntil = now + RED_DURATION;
                }
            }
        }

        // 🎯 dibujar
        circles.forEach(c => c.draw(ctx));
    }

    update();
}