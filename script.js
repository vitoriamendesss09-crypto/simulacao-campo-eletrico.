const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const botaoPositiva = document.getElementById("positiva");
const botaoNegativa = document.getElementById("negativa");
const botaoLimpar = document.getElementById("limpar");

let tipoCarga = "positiva";
let cargas = [];


// ==============================
// BOTÕES
// ==============================

botaoPositiva.addEventListener("click", () => {
    tipoCarga = "positiva";
});

botaoNegativa.addEventListener("click", () => {
    tipoCarga = "negativa";
});

botaoLimpar.addEventListener("click", () => {
    cargas = [];
    desenhar();
});


// ==============================
// ADICIONAR CARGAS
// ==============================

canvas.addEventListener("click", (evento) => {

    const rect = canvas.getBoundingClientRect();

    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;

    const valor = tipoCarga === "positiva" ? 1 : -1;

    cargas.push({
        x: x,
        y: y,
        q: valor
    });

    desenhar();
});


// ==============================
// DESENHAR O CAMPO ELÉTRICO
// ==============================

function desenharCampo() {

    const espacamento = 40;

    for (let x = 20; x < canvas.width; x += espacamento) {

        for (let y = 20; y < canvas.height; y += espacamento) {

            let Ex = 0;
            let Ey = 0;

            cargas.forEach(carga => {

                const dx = x - carga.x;
                const dy = y - carga.y;

                const distancia = Math.sqrt(dx * dx + dy * dy);

                // Evita problemas muito perto da carga
                if (distancia > 20) {

                    const intensidade =
                        carga.q / (distancia * distancia);

                    Ex += intensidade * dx / distancia;
                    Ey += intensidade * dy / distancia;
                }

            });

            const tamanho = Math.sqrt(Ex * Ex + Ey * Ey);

            if (tamanho > 0) {

                const direcaoX = Ex / tamanho;
                const direcaoY = Ey / tamanho;

                desenharSeta(
                    x,
                    y,
                    direcaoX,
                    direcaoY
                );
            }
        }
    }
}


// ==============================
// DESENHAR UMA SETA
// ==============================

function desenharSeta(x, y, dx, dy) {

    const tamanho = 13;

    const fimX = x + dx * tamanho;
    const fimY = y + dy * tamanho;

    ctx.beginPath();

    ctx.moveTo(x, y);
    ctx.lineTo(fimX, fimY);

    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;

    ctx.stroke();

    const angulo = Math.atan2(dy, dx);

    ctx.beginPath();

    ctx.moveTo(fimX, fimY);

    ctx.lineTo(
        fimX - 6 * Math.cos(angulo - Math.PI / 6),
        fimY - 6 * Math.sin(angulo - Math.PI / 6)
    );

    ctx.lineTo(
        fimX - 6 * Math.cos(angulo + Math.PI / 6),
        fimY - 6 * Math.sin(angulo + Math.PI / 6)
    );

    ctx.closePath();

    ctx.fillStyle = "#555";
    ctx.fill();
}


// ==============================
// DESENHAR AS CARGAS
// ==============================

function desenharCargas() {

    cargas.forEach(carga => {

        ctx.beginPath();

        ctx.arc(
            carga.x,
            carga.y,
            22,
            0,
            Math.PI * 2
        );

        if (carga.q > 0) {
            ctx.fillStyle = "#e74c3c";
        } else {
            ctx.fillStyle = "#3498db";
        }

        ctx.fill();

        ctx.strokeStyle = "#222";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 26px Arial";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const simbolo = carga.q > 0 ? "+" : "−";

        ctx.fillText(
            simbolo,
            carga.x,
            carga.y
        );
    });
}


// ==============================
// DESENHAR TUDO
// ==============================

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    desenharCampo();

    desenharCargas();
}


// ==============================
// INICIAR
// ==============================

desenhar();
