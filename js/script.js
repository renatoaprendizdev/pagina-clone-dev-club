
/* ========================================
   DEVCLUB IA - JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       ELEMENTOS
    ======================================== */

    const canvas = document.getElementById("universeCanvas");
    const ctx = canvas.getContext("2d");

    const pauseButton = document.getElementById("pauseAnimation");
    const resetButton = document.getElementById("resetAnimation");
    const themeToggle = document.getElementById("themeToggle");
    const soundToggle = document.getElementById("soundToggle");

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const microphoneButton = document.querySelector(".microphone-button");

    let particles = [];
    let animationId;

    let animationPaused = false;
    let soundEnabled = false;

    let width = 0;
    let height = 0;

    const particleCount = 130;

    const green = "#19e65b";


    /* ========================================
       AJUSTAR CANVAS
    ======================================== */

    function resizeCanvas() {

        const rect = canvas.getBoundingClientRect();

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        width = rect.width;
        height = rect.height;

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        createParticles();
    }


    /* ========================================
       CRIAR PARTÍCULAS
    ======================================== */

    function createParticles() {

        particles = [];

        for (let i = 0; i < particleCount; i++) {

            particles.push({

                x: Math.random() * width,
                y: Math.random() * height,

                radius: Math.random() * 1.8 + 0.5,

                speedX: (Math.random() - 0.5) * 0.35,
                speedY: (Math.random() - 0.5) * 0.35,

                opacity: Math.random() * 0.7 + 0.2,

                pulse: Math.random() * Math.PI * 2

            });

        }

    }


    /* ========================================
       DESENHAR PARTÍCULAS
    ======================================== */

    function drawParticles() {

        particles.forEach((particle, index) => {

            particle.pulse += 0.025;

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Reposicionar quando sair da tela

            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;

            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;

            const opacity = particle.opacity *
                (0.7 + Math.sin(particle.pulse) * 0.3);

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(25, 230, 91, ${opacity})`;

            ctx.shadowBlur = 10;
            ctx.shadowColor = green;

            ctx.fill();

            ctx.shadowBlur = 0;


            // Conectar partículas próximas

            for (let j = index + 1; j < particles.length; j++) {

                const other = particles[j];

                const dx = particle.x - other.x;
                const dy = particle.y - other.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {

                    ctx.beginPath();

                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);

                    ctx.strokeStyle =
                        `rgba(25, 230, 91, ${0.12 * (1 - distance / 100)})`;

                    ctx.lineWidth = 0.6;
                    ctx.stroke();

                }

            }

        });

    }


    /* ========================================
       DESENHAR ÓRBITA DE FUNDO
    ======================================== */

    let orbitAngle = 0;

    function drawOrbit() {

        const centerX = width / 2;
        const centerY = height / 2;

        const radius = Math.min(width, height) * 0.205;

        orbitAngle += 0.0015;

        // Órbita principal

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius,
            orbitAngle,
            orbitAngle + Math.PI * 1.8
        );

        ctx.strokeStyle = "rgba(145, 210, 183, 0.28)";
        ctx.lineWidth = 1;
        ctx.stroke();


        // Órbita secundária

        ctx.save();

        ctx.translate(centerX, centerY);
        ctx.rotate(-orbitAngle);

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            radius * 0.9,
            radius * 0.45,
            0,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "rgba(25, 230, 91, 0.16)";
        ctx.stroke();

        ctx.restore();


        // Pontos luminosos orbitais

        for (let i = 0; i < 4; i++) {

            const angle = orbitAngle * 2 + i * Math.PI / 2;

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            ctx.beginPath();

            ctx.arc(x, y, 2, 0, Math.PI * 2);

            ctx.fillStyle = green;
            ctx.shadowBlur = 12;
            ctx.shadowColor = green;

            ctx.fill();

            ctx.shadowBlur = 0;

        }

    }


    /* ========================================
       ANIMAÇÃO PRINCIPAL
    ======================================== */

    function animate() {

        if (animationPaused) return;

        ctx.clearRect(0, 0, width, height);

        drawParticles();
        drawOrbit();

        animationId = requestAnimationFrame(animate);

    }


    function startAnimation() {

        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        animationPaused = false;

        pauseButton.textContent = "Ⅱ";

        animate();

    }


    /* ========================================
       PAUSAR ANIMAÇÃO
    ======================================== */

    pauseButton.addEventListener("click", () => {

        animationPaused = !animationPaused;

        if (animationPaused) {

            cancelAnimationFrame(animationId);

            pauseButton.textContent = "▶";

        } else {

            pauseButton.textContent = "Ⅱ";

            animate();

        }

    });


    /* ========================================
       REINICIAR ANIMAÇÃO
    ======================================== */

    resetButton.addEventListener("click", () => {

        orbitAngle = 0;

        createParticles();

        startAnimation();

    });


    /* ========================================
       ALTERNAR TEMA
    ======================================== */

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-theme");

        const isLight = document.body.classList.contains("light-theme");

        themeToggle.textContent = isLight ? "☀" : "◐";

    });


    /* ========================================
       CONTROLE DE SOM
    ======================================== */

    soundToggle.addEventListener("click", () => {

        soundEnabled = !soundEnabled;

        soundToggle.textContent = soundEnabled ? "◖" : "◗";

        soundToggle.setAttribute(
            "aria-label",
            soundEnabled ? "Desativar som" : "Ativar som"
        );

    });


    /* ========================================
       NAVEGAÇÃO SIDEBAR
    ======================================== */

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });


    /* ========================================
       PESQUISA
    ======================================== */

    searchForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const query = searchInput.value.trim();

        if (!query) {

            searchInput.focus();

            return;

        }

        // Neste protótipo, a pesquisa gera um evento
        // que poderá ser conectado futuramente à API de IA.

        document.dispatchEvent(
            new CustomEvent("devclub:search", {
                detail: {
                    query: query
                }
            })
        );

        console.log("Pesquisa solicitada:", query);

        searchInput.value = "";

    });


    /* ========================================
       PESQUISA POR VOZ
    ======================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (SpeechRecognition) {

        const recognition = new SpeechRecognition();

        recognition.lang = "pt-BR";
        recognition.continuous = false;
        recognition.interimResults = false;

        microphoneButton.addEventListener("click", () => {

            try {

                recognition.start();

                microphoneButton.textContent = "●";

            } catch (error) {

                console.warn("Reconhecimento de voz indisponível.", error);

            }

        });

        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;

            searchInput.value = transcript;

        };

        recognition.onend = () => {

            microphoneButton.textContent = "♩";

        };

        recognition.onerror = () => {

            microphoneButton.textContent = "♩";

        };

    } else {

        microphoneButton.addEventListener("click", () => {

            alert("Seu navegador não oferece suporte à pesquisa por voz.");

        });

    }


    /* ========================================
       EFEITO NOS MÓDULOS
    ======================================== */

    const modules = document.querySelectorAll(".module");

    modules.forEach(module => {

        module.addEventListener("mouseenter", () => {

            module.style.zIndex = "10";

        });

        module.addEventListener("mouseleave", () => {

            module.style.zIndex = "5";

        });

    });


    /* ========================================
       INICIALIZAÇÃO
    ======================================== */

    resizeCanvas();

    startAnimation();

    window.addEventListener("resize", resizeCanvas);


    /* ========================================
       ACESSIBILIDADE: REDUZIR ANIMAÇÕES
    ======================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {

        animationPaused = true;

        cancelAnimationFrame(animationId);

        ctx.clearRect(0, 0, width, height);

        drawParticles();
        drawOrbit();

        pauseButton.textContent = "▶";

    }

});
