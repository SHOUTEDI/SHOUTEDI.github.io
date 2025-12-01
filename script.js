// 1. LINE NUMBER GENERATOR
// Dynamically creates line numbers for the editor gutter
function generateLineNumbers() {
    const el = document.querySelector('.line-numbers');
    let html = '';
    for(let i=1; i<=250; i++) html += `<span>${i}</span>`;
    el.innerHTML = html;
}
generateLineNumbers();

// 2. TAB SWITCHING SYSTEM
// Handles the logic for switching between different "files" (views)
function switchTab(tabId) {
    // List of available views
    const views = ['portfolio', 'gamedeals', 'monitor', 'mod', 'social'];
    
    // Reset all views and buttons
    views.forEach(id => {
        const viewEl = document.getElementById('view-' + id);
        const btnEl = document.getElementById('tab-btn-' + id);
        
        if (viewEl) viewEl.style.display = 'none';
        if (btnEl) {
            btnEl.classList.remove('active');
            btnEl.classList.add('inactive');
        }
    });

    // Activate selected view and button
    const selectedView = document.getElementById('view-' + tabId);
    const selectedBtn = document.getElementById('tab-btn-' + tabId);

    if (selectedView) {
        selectedView.style.display = 'block';
        // Trigger reflow to restart animation
        selectedView.style.animation = 'none';
        selectedView.offsetHeight; 
        selectedView.style.animation = 'fadeUp 0.4s ease';
    }
    
    if (selectedBtn) {
        selectedBtn.classList.add('active');
        selectedBtn.classList.remove('inactive');
    }

    const codeContainer = document.querySelector('.code-container');
    if (codeContainer) {
        codeContainer.scrollTop = 0;
    }
}

// 3. TYPEWRITER EFFECT
// Simulates typing text for the "Role" property
const textEl = document.getElementById('typewriter');
const phrases = ["Game Developer", "Software Engineer", "Modder"];
let pIndex = 0;
let cIndex = 0;
let isDel = false;

function type() {
    const current = phrases[pIndex];
    if (isDel) {
        textEl.textContent = current.substring(0, cIndex - 1);
        cIndex--;
    } else {
        textEl.textContent = current.substring(0, cIndex + 1);
        cIndex++;
    }
    let speed = isDel ? 50 : 100;
    if (!isDel && cIndex === current.length) { speed = 2000; isDel = true; }
    else if (isDel && cIndex === 0) { isDel = false; pIndex = (pIndex + 1) % phrases.length; speed = 500; }
    setTimeout(type, speed);
}
document.addEventListener('DOMContentLoaded', type);

// 4. BACKGROUND
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() * 0.2) - 0.1;
        this.speedY = (Math.random() * 0.2) - 0.1;
        this.color = Math.random() > 0.5 ? '#00f2ff' : '#bd00ff';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if(this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for(let i=0; i<70; i++) particles.push(new Particle());
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Draw connections between close particles
        for(let j=i; j<particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(100, 50, 255, ${0.15 - dist/800})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Tilt Effect (Disabled on mobile to save battery and prevent touch bugs)
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (!isMobile) {
    VanillaTilt.init(document.querySelectorAll(".card"), { max: 8, speed: 400, glare: true, "max-glare": 0.1 });
}

// 5. LANGUAGE DETECTION (PT-BR / EN)
function setLanguage() {
    // Detecta se a linguagem do navegador começa com 'pt' (pt-BR, pt-PT)
    const userLang = navigator.language || navigator.userLanguage; 
    const isPortuguese = userLang.startsWith('pt');

    // Se não for português, mantém o padrão (Inglês) e sai da função
    if (!isPortuguese) return;

    // Seleciona todos os elementos que têm tradução definida
    const elements = document.querySelectorAll('[data-pt]');

    elements.forEach(el => {
        // Substitui o conteúdo HTML pelo valor do atributo data-pt
        el.innerHTML = el.getAttribute('data-pt');
    });

    // Atualiza o efeito de digitação para português
    if(typeof phrases !== 'undefined') {
        // Sobrescreve o array de frases definido anteriormente
        phrases.length = 0; // Limpa o array original
        phrases.push("Desenvolvedor de Jogos", "Engenheiro de Software", "Modder");
    }
}

// Executa a detecção de linguagem ao carregar
document.addEventListener('DOMContentLoaded', setLanguage);