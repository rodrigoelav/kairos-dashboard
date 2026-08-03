const defaultProjects = [
    { id: 1, name: "API Faturamento", assignees: "Douglas e Pedro", icon: "fa-solid fa-laptop-code", status: "Em andamento" },
    { id: 2, name: "E-Commerce Kairós", assignees: "Rodrigo", icon: "fa-solid fa-cart-shopping", status: "Em análise" },
    { id: 3, name: "Peritagem Digital", assignees: "Rodrigo e Douglas", icon: "fa-solid fa-file-signature", status: "Em andamento" },
    { id: 4, name: "Relatório Digital", assignees: "Rodrigo e Douglas", icon: "fa-solid fa-file-invoice", status: "Em andamento" },
    { id: 5, name: "Nova Inspeção de Qualidade", assignees: "Guilherme", icon: "fa-solid fa-shield-check", status: "Em andamento" },
    { id: 6, name: "Capacidade Produtiva", assignees: "Rodrigo", icon: "fa-solid fa-chart-simple", status: "Parado" },
    { id: 7, name: "Produção de placas de iden.", assignees: "Douglas e Juniel", icon: "fa-solid fa-id-card", status: "Em andamento" },
    { id: 8, name: "Ambiente Financeiro do HUB PT", assignees: "Douglas", icon: "fa-solid fa-globe", status: "Em andamento" },
    { id: 9, name: "Aprimoramento Ferrovia", assignees: "Rodrigo e Juniel", icon: "fa-solid fa-train-tram", status: "Em análise" },
    { id: 10, name: "Start-Up nova unidade", assignees: "Juniel", icon: "fa-solid fa-city", status: "Em andamento" }
];

let projects = [];
let editingId = null;

// DOM Elements
const projectsGrid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('projectModal');
const projectForm = document.getElementById('projectForm');
const btnAddProject = document.getElementById('btnAddProject');
const btnCancelModal = document.getElementById('btnCancelModal');
const btnDeleteProject = document.getElementById('btnDeleteProject');
const btnExport = document.getElementById('btnExport');
const importFile = document.getElementById('importFile');
const btnTVMode = document.getElementById('btnTVMode');

const blurSlider = document.getElementById('blurSlider');
const opacitySlider = document.getElementById('opacitySlider');
const bgOverlay = document.getElementById('bgOverlay');

// Initialize
function init() {
    checkTVMode();
    loadProjects();
    renderProjects();
    initCanvas();
    initMediaBackgrounds();
    setupEventListeners();
}

// Data Management
function loadProjects() {
    const saved = localStorage.getItem('kairos_projects');
    if (saved) {
        projects = JSON.parse(saved);
    } else {
        projects = [...defaultProjects];
        saveProjects();
    }
}

function saveProjects() {
    localStorage.setItem('kairos_projects', JSON.stringify(projects));
}

// Rendering
function getStatusClass(status) {
    switch(status) {
        case 'Em andamento': return 'status-green';
        case 'Em análise': return 'status-yellow';
        case 'Parado': return 'status-red';
        case 'Concluído': return 'status-blue';
        default: return 'status-green';
    }
}

function renderProjects(filterText = '') {
    projectsGrid.innerHTML = '';
    
    const filtered = projects.filter(p => 
        p.name.toLowerCase().includes(filterText.toLowerCase()) || 
        p.assignees.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.onclick = (e) => {
            if(!e.target.classList.contains('status-badge')) {
                openModal(proj);
            }
        };

        const statusClass = getStatusClass(proj.status);

        card.innerHTML = `
            <div class="card-icon">
                <i class="${proj.icon}"></i>
            </div>
            <div class="card-info">
                <h3>${proj.name}</h3>
                <p>(${proj.assignees})</p>
            </div>
            <div class="status-badge ${statusClass}" onclick="toggleStatus(event, ${proj.id})">
                ${proj.status}
            </div>
        `;
        projectsGrid.appendChild(card);
    });
}

// Interactions
function toggleStatus(event, id) {
    event.stopPropagation();
    const proj = projects.find(p => p.id === id);
    if (!proj) return;

    const statuses = ['Em andamento', 'Em análise', 'Parado', 'Concluído'];
    let currentIndex = statuses.indexOf(proj.status);
    proj.status = statuses[(currentIndex + 1) % statuses.length];
    
    saveProjects();
    renderProjects(searchInput.value);
}

function openModal(proj = null) {
    editingId = proj ? proj.id : null;
    
    document.getElementById('modalTitle').innerText = proj ? 'Editar Projeto' : 'Adicionar Projeto';
    document.getElementById('projName').value = proj ? proj.name : '';
    document.getElementById('projAssignees').value = proj ? proj.assignees : '';
    document.getElementById('projIcon').value = proj ? proj.icon : 'fa-solid fa-laptop-code';
    document.getElementById('projStatus').value = proj ? proj.status : 'Em andamento';
    
    btnDeleteProject.style.display = proj ? 'block' : 'none';
    
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    projectForm.reset();
    editingId = null;
}

// Event Listeners Setup
function setupEventListeners() {
    searchInput.addEventListener('input', (e) => renderProjects(e.target.value));
    
    btnAddProject.addEventListener('click', () => openModal());
    btnCancelModal.addEventListener('click', closeModal);
    
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newProj = {
            id: editingId || Date.now(),
            name: document.getElementById('projName').value,
            assignees: document.getElementById('projAssignees').value,
            icon: document.getElementById('projIcon').value,
            status: document.getElementById('projStatus').value
        };

        if (editingId) {
            const index = projects.findIndex(p => p.id === editingId);
            if (index !== -1) projects[index] = newProj;
        } else {
            projects.push(newProj);
        }

        saveProjects();
        renderProjects(searchInput.value);
        closeModal();
    });

    btnDeleteProject.addEventListener('click', () => {
        if(confirm('Tem certeza que deseja excluir este projeto?')) {
            projects = projects.filter(p => p.id !== editingId);
            saveProjects();
            renderProjects(searchInput.value);
            closeModal();
        }
    });

    // Background Controls
    blurSlider.addEventListener('input', (e) => {
        bgOverlay.style.backdropFilter = `blur(${e.target.value}px)`;
    });

    opacitySlider.addEventListener('input', (e) => {
        bgOverlay.style.backgroundColor = `rgba(0, 0, 0, ${e.target.value})`;
    });

    // Backup & Restore
    btnExport.addEventListener('click', (e) => {
        e.preventDefault();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "kairos_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    projects = imported;
                    saveProjects();
                    renderProjects();
                    alert('Backup importado com sucesso!');
                }
            } catch (err) {
                alert('Erro ao importar arquivo JSON.');
            }
        };
        reader.readAsText(file);
    });

    // TV Mode Button
    btnTVMode.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = window.location.pathname + '?mode=tv';
    });
    
    // Settings Dropdown Toggle
    const btnSettings = document.querySelector('.dropdown .btn-secondary');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    btnSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdownContent.classList.remove('show');
    });
    
    dropdownContent.addEventListener('click', (e) => {
        e.stopPropagation(); // keep open if clicking inside, or close if hitting a button
    });
}

// TV Mode Logic
function checkTVMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'tv') {
        document.body.classList.add('tv-mode');
        
        // Sair do modo TV com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = window.location.pathname;
            }
        });
    }
}

// Canvas Animation (Gears & Particles)
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(255, 42, 42, ${Math.random() * 0.5})`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if(this.x > width || this.x < 0) this.speedX *= -1;
            if(this.y > height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    let angle = 0;
    
    function drawGear(x, y, radius, teeth, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * (radius % 2 === 0 ? 1 : -1));
        ctx.beginPath();
        
        const innerRadius = radius * 0.8;
        
        for (let i = 0; i < teeth; i++) {
            const a0 = (i / teeth) * Math.PI * 2;
            const a1 = ((i + 0.5) / teeth) * Math.PI * 2;
            ctx.lineTo(Math.cos(a0) * radius, Math.sin(a0) * radius);
            ctx.lineTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
            ctx.lineTo(Math.cos(a1) * innerRadius, Math.sin(a1) * innerRadius);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw some tech lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for(let i = 0; i < height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        
        // Draw Gears (subtle in background)
        drawGear(width * 0.1, height * 0.8, 150, 16, 'rgba(255,42,42,0.05)');
        drawGear(width * 0.9, height * 0.2, 200, 20, 'rgba(255,255,255,0.03)');
        drawGear(width * 0.15, height * 0.85, 80, 10, 'rgba(255,255,255,0.03)');
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        angle += 0.002;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Media Background Manager (Loop 10 mins)
function initMediaBackgrounds() {
    const mediaContainer = document.getElementById('mediaBgContainer');
    // Para funcionar localmente, nomeie os arquivos nesta ordem na pasta 'backgrounds'.
    // Suporta vídeos e imagens.
    const backgrounds = [
        'bg1.mp4', 'bg1.webm', 'bg1.jpg', 'bg1.png',
        'bg2.mp4', 'bg2.webm', 'bg2.jpg', 'bg2.png',
        'bg3.mp4', 'bg3.webm', 'bg3.jpg', 'bg3.png'
    ];
    
    let currentIndex = 0;
    const mediaElements = [];

    // Tentamos carregar os arquivos. Como é local, alguns falharão silenciosamente se não existirem, 
    // mas os que existirem ficarão prontos.
    backgrounds.forEach((file, index) => {
        let el;
        if (file.endsWith('.mp4') || file.endsWith('.webm')) {
            el = document.createElement('video');
            el.src = `backgrounds/${file}`;
            el.loop = true;
            el.muted = true;
            el.autoplay = true;
            el.playsInline = true;
        } else {
            el = document.createElement('img');
            el.src = `backgrounds/${file}`;
        }
        
        el.onerror = () => { el.remove(); }; // Remove do DOM se não existir
        el.onload = () => { mediaElements.push(el); };
        if (el.tagName === 'VIDEO') {
            el.onloadeddata = () => { mediaElements.push(el); };
        }
        
        mediaContainer.appendChild(el);
    });

    // Trocar a cada 10 minutos (600000 ms)
    setInterval(() => {
        if (mediaElements.length === 0) return;
        
        // Remove a classe active de todos
        mediaElements.forEach(el => el.classList.remove('active-media'));
        
        // Pega o próximo
        currentIndex = (currentIndex + 1) % mediaElements.length;
        const nextMedia = mediaElements[currentIndex];
        
        if (nextMedia) {
            nextMedia.classList.add('active-media');
            // Ocultar o canvas se houver mídia ativa
            document.getElementById('bgCanvas').style.opacity = '0';
        }
    }, 600000);

    // Ativar o primeiro após um breve delay para garantir carregamento
    setTimeout(() => {
        if (mediaElements.length > 0) {
            mediaElements[0].classList.add('active-media');
            document.getElementById('bgCanvas').style.opacity = '0';
        }
    }, 2000);
}

// Start
init();
