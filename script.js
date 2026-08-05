/* ==========================================================================
   KAIRÓS MOTORES – DASHBOARD FINAL (TV COMPATÍVEL + CONFIG.JSON)
   ========================================================================== */

// ===== DIAGNÓSTICO INICIAL =====
(function () {
  console.log('🚀 Script carregado com sucesso');
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 150;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 300, 150);
    console.log('🟥 Quadrado vermelho desenhado – o canvas funciona!');
  } else {
    console.error('❌ Canvas não encontrado!');
  }

  window.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('bg-overlay');
    if (overlay) {
      overlay.style.background = 'rgba(9,12,16, 0.1)';
      overlay.style.backdropFilter = 'blur(0px)';
      console.log('🔽 Overlay clareado para 10%');
    }
  });
})();

// 1. DADOS INICIAIS
const INITIAL_PROJECTS = [
  { id: '1', title: 'API Faturamento', responsibles: 'Douglas e Pedro', status: 'Em andamento', icon: 'api', progress: 75, description: 'Integração de APIs de faturamento fiscal e emissão.' },
  { id: '2', title: 'E-Commerce Kairós', responsibles: 'Rodrigo', status: 'Em análise', icon: 'cart', progress: 40, description: 'Plataforma B2B para venda de peças e motores.' },
  { id: '3', title: 'Peritagem Digital', responsibles: 'Rodrigo e Douglas', status: 'Em andamento', icon: 'clipboard', progress: 60, description: 'Sistema de vistoria e peritagem técnica por app.' },
  { id: '4', title: 'Relatório Digital', responsibles: 'Rodrigo e Douglas', status: 'Em andamento', icon: 'report', progress: 85, description: 'Geração de laudos e relatórios automatizados.' },
  { id: '5', title: 'Nova Inspeção de Qualidade', responsibles: 'Guilherme', status: 'Em andamento', icon: 'shield', progress: 50, description: 'Checklist de controle de qualidade na linha de produção.' },
  { id: '6', title: 'Capacidade Produtiva', responsibles: 'Rodrigo', status: 'Parado', icon: 'chart', progress: 20, description: 'Mapeamento de capacidade de fábrica e gargalos.' },
  { id: '7', title: 'Produção de placas de iden.', responsibles: 'Douglas e Juniel', status: 'Em andamento', icon: 'idcard', progress: 90, description: 'Impressão e gravação de plaquetas industriais.' },
  { id: '8', title: 'Ambiente Financeiro do HUB PT', responsibles: 'Douglas', status: 'Em andamento', icon: 'globe', progress: 70, description: 'Módulo financeiro e de pagamentos do HUB PT.' },
  { id: '9', title: 'Aprimoramento Ferrovia', responsibles: 'Rodrigo e Juniel', status: 'Em análise', icon: 'train', progress: 35, description: 'Projetos especiais para manutenção ferroviária.' },
  { id: '10', title: 'Start-Up nova unidade', responsibles: 'Juniel', status: 'Em andamento', icon: 'building', progress: 65, description: 'Implantação de nova unidade operacional.' }
];

const LOCAL_BACKGROUNDS = [
  { name: 'bg1.mp4 (Vídeo)', file: 'backgrounds/bg1.mp4', type: 'video' },
  { name: 'bg2.png (Imagem)', file: 'backgrounds/bg2.png', type: 'image' },
  { name: 'bg3.png (Imagem)', file: 'backgrounds/bg3.png', type: 'image' }
];

let projects;
try {
  projects = JSON.parse(localStorage.getItem('kairos_projects_v2')) || INITIAL_PROJECTS;
} catch (e) {
  console.warn('Erro ao ler projetos do localStorage, usando padrão');
  projects = INITIAL_PROJECTS;
}

let activeFilter = 'all';
let searchQuery = '';
let isTvMode = new URLSearchParams(window.location.search).get('mode') === 'tv';

let bgConfig;
try {
  bgConfig = JSON.parse(localStorage.getItem('kairos_bg_config'));
} catch (e) {
  console.warn('Erro ao ler bgConfig do localStorage, usando padrão');
  bgConfig = null;
}
if (!bgConfig || !bgConfig.type) {
  bgConfig = {
    type: 'canvas',
    videoUrl: '',
    gifUrl: '',
    localFile: 0,
    opacity: 10,
    blur: 0,
    canvasSpeed: 2,
    playlist: [],
    musicPlaylist: [],
    musicVolume: 30,
    musicMuted: false
  };
}

function saveState() {
  try {
    localStorage.setItem('kairos_projects_v2', JSON.stringify(projects));
    localStorage.setItem('kairos_bg_config', JSON.stringify(bgConfig));
  } catch (e) {
    console.warn('Não foi possível salvar no localStorage');
  }
}

// 3. ÍCONES SVG
function getIconSvg(iconName) {
  const icons = {
    api: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
    cart: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
    clipboard: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>`,
    report: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    shield: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
    chart: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
    idcard: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="10" r="3"/><path d="M15 8h3M15 12h3M7 17h10"/></svg>`,
    globe: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    train: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 11h16M12 3v8M8 19l-3 3M16 19l3 3M9 19h6"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`,
    building: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/><path d="M9 22v-4h6v4"/></svg>`,
    gear: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
    box: `<svg class="card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
  };
  return icons[iconName] || icons.gear;
}

const STATUS_MAP = {
  'Em andamento': { class: 'status-andamento' },
  'Em análise': { class: 'status-analise' },
  'Parado': { class: 'status-parado' },
  'Concluído': { class: 'status-concluido' }
};
const NEXT_STATUS = {
  'Em andamento': 'Em análise',
  'Em análise': 'Parado',
  'Parado': 'Concluído',
  'Concluído': 'Em andamento'
};

// 4. RENDERIZAÇÃO
function renderProjects(animateBoeing = false) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';

  const filtered = projects.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.responsibles.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  filtered.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    if (animateBoeing) {
      card.classList.add('boeing');
      card.style.animationDelay = `${index * 0.18}s`;
    } else {
      card.style.animationDelay = `${index * 0.05}s`;
    }

    const statusInfo = STATUS_MAP[project.status] || STATUS_MAP['Em andamento'];

    card.innerHTML = `
            <div class="card-icon-wrapper">${getIconSvg(project.icon)}</div>
            <div class="card-content">
                <h3 class="card-title">${escapeHtml(project.title)}</h3>
                <p class="card-responsibilities">(${escapeHtml(project.responsibles)})</p>
            </div>
            <div class="card-footer">
                <span class="status-badge ${statusInfo.class}">${escapeHtml(project.status)}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
            </div>
            <div class="card-description">${escapeHtml(project.description)}</div>
            <button class="card-edit-btn" title="Editar">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
        `;

    card.querySelector('.status-badge').addEventListener('click', (e) => {
      e.stopPropagation();
      cycleProjectStatus(project.id);
    });
    card.addEventListener('click', () => {
      if (!isTvMode) openEditModal(project);
    });

    if (animateBoeing) {
      card.addEventListener('animationend', () => {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 400);
      });
    }

    grid.appendChild(card);
  });

  updateMetrics();
  saveState();
}

function updateMetrics() {
  document.getElementById('count-total').textContent = projects.length;
  document.getElementById('count-andamento').textContent = projects.filter(p => p.status === 'Em andamento').length;
  document.getElementById('count-analise').textContent = projects.filter(p => p.status === 'Em análise').length;
  document.getElementById('count-parados').textContent = projects.filter(p => p.status === 'Parado').length;
  document.getElementById('count-concluidos').textContent = projects.filter(p => p.status === 'Concluído').length;
}

function cycleProjectStatus(id) {
  const proj = projects.find(p => p.id === id);
  if (proj) {
    proj.status = NEXT_STATUS[proj.status] || 'Em andamento';
    renderProjects();
  }
}

function escapeHtml(str) { return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]); }

// 5. MODAIS DE PROJETO
const projectModal = document.getElementById('modal-project');
const formProject = document.getElementById('form-project');

function openAddModal() {
  document.getElementById('modal-project-title').textContent = 'Novo Projeto';
  document.getElementById('project-id').value = '';
  document.getElementById('project-title-input').value = '';
  document.getElementById('project-responsibles-input').value = '';
  document.getElementById('project-status-input').value = 'Em andamento';
  document.getElementById('project-icon-input').value = 'api';
  document.getElementById('project-progress-input').value = '50';
  document.getElementById('project-description-input').value = '';
  document.getElementById('btn-delete-project').classList.add('hidden');
  projectModal.classList.remove('hidden');
}

function openEditModal(project) {
  document.getElementById('modal-project-title').textContent = 'Editar Projeto';
  document.getElementById('project-id').value = project.id;
  document.getElementById('project-title-input').value = project.title;
  document.getElementById('project-responsibles-input').value = project.responsibles;
  document.getElementById('project-status-input').value = project.status;
  document.getElementById('project-icon-input').value = project.icon;
  document.getElementById('project-progress-input').value = project.progress;
  document.getElementById('project-description-input').value = project.description || '';
  document.getElementById('btn-delete-project').classList.remove('hidden');
  projectModal.classList.remove('hidden');
}

formProject.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('project-id').value;
  const title = document.getElementById('project-title-input').value.trim();
  const responsibles = document.getElementById('project-responsibles-input').value.trim();
  const status = document.getElementById('project-status-input').value;
  const icon = document.getElementById('project-icon-input').value;
  const progress = parseInt(document.getElementById('project-progress-input').value, 10) || 0;
  const description = document.getElementById('project-description-input').value.trim();
  if (id) {
    const proj = projects.find(p => p.id === id);
    if (proj) Object.assign(proj, { title, responsibles, status, icon, progress, description });
  } else {
    projects.push({ id: Date.now().toString(), title, responsibles, status, icon, progress, description });
  }
  projectModal.classList.add('hidden');
  renderProjects();
});

document.getElementById('btn-delete-project').addEventListener('click', () => {
  const id = document.getElementById('project-id').value;
  if (id && confirm('Tem certeza que deseja excluir este projeto?')) {
    projects = projects.filter(p => p.id !== id);
    projectModal.classList.add('hidden');
    renderProjects();
  }
});
document.getElementById('btn-close-project-modal').addEventListener('click', () => projectModal.classList.add('hidden'));
document.getElementById('btn-cancel-project').addEventListener('click', () => projectModal.classList.add('hidden'));

// 6. FUNDO DINÂMICO
const bgCanvas = document.getElementById('bg-canvas');
const bgOverlay = document.getElementById('bg-overlay');
let bgVideo = document.getElementById('bg-video');
const bgImage = document.getElementById('bg-image');

function recreateVideoElement() {
  const oldVideo = document.getElementById('bg-video');
  if (oldVideo) oldVideo.remove();

  const newVideo = document.createElement('video');
  newVideo.id = 'bg-video';
  newVideo.loop = true;
  newVideo.muted = true;
  newVideo.defaultMuted = true;
  newVideo.playsInline = true;
  newVideo.setAttribute('muted', '');
  newVideo.setAttribute('playsinline', '');
  newVideo.setAttribute('loop', '');
  newVideo.setAttribute('autoplay', '');
  if (bgCanvas && bgCanvas.parentNode) {
    bgCanvas.parentNode.insertBefore(newVideo, bgCanvas.nextSibling);
  }
  bgVideo = newVideo;
  return newVideo;
}

let rotationTimer = null;

function startVideoRotation(playlist) {
  const newVideo = recreateVideoElement();
  let index = 0;

  function playNext() {
    if (index >= playlist.length) index = 0;
    const item = playlist[index];
    const url = item.url;
    const durationMs = (item.duration || 2) * 60 * 1000;

    newVideo.src = url;
    newVideo.classList.add('active');
    newVideo.play().catch(err => console.warn(err));
    console.log(`▶️ Vídeo ${index + 1}/${playlist.length} (${item.duration} min)`);

    index++;
    clearTimeout(rotationTimer);
    rotationTimer = setTimeout(playNext, durationMs);
  }

  clearTimeout(rotationTimer);
  playNext();
}

function applyBackgroundConfig() {
  console.log('🎨 Aplicando fundo:', bgConfig.type, bgConfig);

  bgCanvas.classList.remove('active');
  if (bgVideo) {
    bgVideo.classList.remove('active');
    bgVideo.pause();
    bgVideo.removeAttribute('src');
  }
  bgImage.classList.remove('active');

  bgOverlay.style.background = `rgba(9, 12, 16, ${bgConfig.opacity / 100})`;
  bgOverlay.style.backdropFilter = `blur(${bgConfig.blur}px)`;
  bgOverlay.style.webkitBackdropFilter = `blur(${bgConfig.blur}px)`;

  if (bgConfig.type === 'canvas') {
    bgCanvas.classList.add('active');
    console.log('✅ Canvas ativado');
  } else if (bgConfig.type === 'video') {
    const playlist = bgConfig.playlist || [];
    if (playlist.length > 0 && playlist.some(item => item.url)) {
      startVideoRotation(playlist);
    } else if (bgConfig.videoUrl) {
      const newVideo = recreateVideoElement();
      newVideo.src = bgConfig.videoUrl;
      newVideo.classList.add('active');
      newVideo.play().catch(err => console.warn(err));
      newVideo.addEventListener('ended', () => {
        if (bgConfig.type === 'video') {
          newVideo.currentTime = 0;
          newVideo.play().catch(() => { });
        }
      });
      console.log('✅ Vídeo single ativado:', bgConfig.videoUrl);
    }
  } else if (bgConfig.type === 'gif' && bgConfig.gifUrl) {
    bgImage.src = bgConfig.gifUrl;
    bgImage.classList.add('active');
    console.log('✅ Imagem/GIF ativado:', bgConfig.gifUrl);
  } else if (bgConfig.type === 'local' && bgConfig.localFile !== null && bgConfig.localFile !== undefined) {
    const local = LOCAL_BACKGROUNDS[bgConfig.localFile];
    if (local) {
      if (local.type === 'video') {
        const newVideo = recreateVideoElement();
        newVideo.src = local.file;
        newVideo.classList.add('active');
        newVideo.play().catch(err => console.warn(err));
        newVideo.addEventListener('ended', () => {
          if (bgConfig.type === 'local') {
            newVideo.currentTime = 0;
            newVideo.play().catch(() => { });
          }
        });
        console.log('✅ Vídeo local ativado:', local.file);
      } else {
        bgImage.src = local.file;
        bgImage.classList.add('active');
        console.log('✅ Imagem local ativada:', local.file);
      }
    } else {
      bgCanvas.classList.add('active');
    }
  } else {
    bgCanvas.classList.add('active');
  }
}

// Canvas animation
let canvasCtx = bgCanvas.getContext('2d');
let animationFrameId, particles = [], gears = [], canvasAngle = 0;

function initCanvasElements() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * bgCanvas.width, y: Math.random() * bgCanvas.height,
    vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 2 + 1
  }));
  gears = [
    { x: bgCanvas.width * 0.15, y: bgCanvas.height * 0.85, radius: 140, teeth: 12, speed: 0.003 },
    { x: bgCanvas.width * 0.88, y: bgCanvas.height * 0.2, radius: 100, teeth: 10, speed: -0.004 }
  ];
}

function drawGear(ctx, x, y, radius, teeth, angle) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.beginPath();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)'; ctx.lineWidth = 2;
  const toothDepth = 12;
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.8) / teeth) * Math.PI * 2;
    ctx.lineTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
    ctx.lineTo(Math.cos(a2) * (radius + toothDepth), Math.sin(a2) * (radius + toothDepth));
    ctx.lineTo(Math.cos(a3) * (radius + toothDepth), Math.sin(a3) * (radius + toothDepth));
    ctx.lineTo(Math.cos(a4) * radius, Math.sin(a4) * radius);
  }
  ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function animateCanvas() {
  if (bgConfig.type === 'canvas') {
    canvasCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    canvasAngle += 0.002 * (bgConfig.canvasSpeed || 2);
    gears.forEach(g => drawGear(canvasCtx, g.x, g.y, g.radius, g.teeth, canvasAngle * (g.speed > 0 ? 1 : -1)));
    canvasCtx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    particles.forEach((p, i) => {
      p.x += p.vx * (bgConfig.canvasSpeed || 2);
      p.y += p.vy * (bgConfig.canvasSpeed || 2);
      if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;
      canvasCtx.beginPath(); canvasCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); canvasCtx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 130) {
          canvasCtx.strokeStyle = `rgba(239, 68, 68, ${0.15 * (1 - dist / 130)})`;
          canvasCtx.lineWidth = 1;
          canvasCtx.beginPath(); canvasCtx.moveTo(p.x, p.y); canvasCtx.lineTo(p2.x, p2.y); canvasCtx.stroke();
        }
      }
    });
  }
  animationFrameId = requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', initCanvasElements);

// Modal Background
const bgModal = document.getElementById('modal-bg');
document.getElementById('btn-bg-settings').addEventListener('click', () => {
  console.log('🖌️ Abrindo modal de fundo');
  bgModal.classList.remove('hidden');
  document.getElementById('bg-overlay-opacity').value = bgConfig.opacity;
  document.getElementById('opacity-val').textContent = `${bgConfig.opacity}%`;
  document.getElementById('bg-blur-amount').value = bgConfig.blur;
  document.getElementById('blur-val').textContent = `${bgConfig.blur}px`;
  document.getElementById('bg-video-url').value = bgConfig.videoUrl || '';
  document.getElementById('bg-gif-url').value = bgConfig.gifUrl || '';
  updateBgSelectorUI();
  renderLocalBackgrounds();
  renderPlaylistItems();
  renderMusicPlaylistItems();
  document.getElementById('music-volume').value = bgConfig.musicVolume;
  document.getElementById('mute-icon').textContent = bgConfig.musicMuted ? '🔇' : '🔊';
  document.getElementById('mute-label').textContent = bgConfig.musicMuted ? 'Ativar som' : 'Mutar';
});

function renderLocalBackgrounds() {
  const container = document.getElementById('local-bg-list');
  if (!container) return;
  container.innerHTML = LOCAL_BACKGROUNDS.map((bg, idx) => `
        <button class="local-bg-item ${bgConfig.type === 'local' && bgConfig.localFile === idx ? 'active' : ''}"
                data-index="${idx}">
            <span>${bg.name}</span>
        </button>
    `).join('');
  document.querySelectorAll('.local-bg-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      bgConfig.type = 'local';
      bgConfig.localFile = index;
      updateBgSelectorUI();
      applyBackgroundConfig();
      saveState();
    });
  });
}

function renderPlaylistItems() {
  const container = document.getElementById('playlist-container');
  if (!container) return;
  container.innerHTML = '';

  if (!bgConfig.playlist) bgConfig.playlist = [];

  bgConfig.playlist.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'playlist-row';
    row.innerHTML = `
            <input type="text" class="playlist-url" value="${escapeHtml(item.url)}" placeholder="URL do vídeo" data-index="${index}">
            <input type="number" class="playlist-duration" value="${item.duration || 2}" min="0.5" max="60" step="0.5" data-index="${index}">
            <button type="button" class="btn btn-danger btn-remove-playlist-item" data-index="${index}" title="Remover">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;
    container.appendChild(row);
  });

  document.querySelectorAll('.playlist-url').forEach(input => {
    input.addEventListener('input', function (e) {
      const idx = parseInt(this.dataset.index);
      bgConfig.playlist[idx].url = this.value.trim();
      saveState();
    });
  });

  document.querySelectorAll('.playlist-duration').forEach(input => {
    input.addEventListener('input', function (e) {
      const idx = parseInt(this.dataset.index);
      bgConfig.playlist[idx].duration = parseFloat(this.value) || 2;
      saveState();
    });
  });

  document.querySelectorAll('.btn-remove-playlist-item').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const idx = parseInt(this.dataset.index);
      bgConfig.playlist.splice(idx, 1);
      saveState();
      renderPlaylistItems();
    });
  });
}

function addPlaylistItem() {
  if (!bgConfig.playlist) bgConfig.playlist = [];
  bgConfig.playlist.push({ url: '', duration: 2 });
  saveState();
  renderPlaylistItems();
}

document.getElementById('btn-add-playlist-item')?.addEventListener('click', addPlaylistItem);


// --- MÚSICA DE FUNDO (CORRIGIDA) ---
let audioElement = null;
let musicTimer = null;
let userHasInteracted = false;

function createAudioElement() {
  if (audioElement) return audioElement;
  audioElement = document.createElement('audio');
  audioElement.id = 'bg-music';
  audioElement.loop = false;
  audioElement.style.display = 'none';
  document.body.appendChild(audioElement);
  return audioElement;
}

function stopMusic() {
  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
  if (audioElement) {
    audioElement.pause();
    audioElement.removeAttribute('src');
  }
}

function startMusicRotation(playlist) {
  if (!playlist || playlist.length === 0) return;
  createAudioElement();

  if (musicTimer) clearTimeout(musicTimer);

  let currentIndex = 0;

  function playNext() {
    if (!bgConfig.musicPlaylist || bgConfig.musicPlaylist.length === 0) return;
    if (bgConfig.musicMuted || bgConfig.musicVolume <= 0) return;

    const item = bgConfig.musicPlaylist[currentIndex];
    if (!item || !item.url) {
      currentIndex = (currentIndex + 1) % bgConfig.musicPlaylist.length;
      musicTimer = setTimeout(playNext, 1000);
      return;
    }

    audioElement.src = item.url;
    audioElement.volume = bgConfig.musicVolume / 100;
    audioElement.currentTime = 0;

    if (userHasInteracted) {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('🎵 Tocando agora:', item.url);
        }).catch(e => {
          console.warn('🔇 Áudio retido. O navegador ainda está bloqueando.');
        });
      }
    } else {
      console.log('🔇 Música na agulha! Aguardando o seu primeiro clique na tela para tocar...');
    }

    const durationMs = (item.duration || 2) * 60 * 1000;
    currentIndex = (currentIndex + 1) % bgConfig.musicPlaylist.length;

    clearTimeout(musicTimer);
    musicTimer = setTimeout(playNext, durationMs);
  }

  playNext();
}

function applyMusicConfig() {
  stopMusic();
  const playlist = bgConfig.musicPlaylist || [];
  if (playlist.length > 0 && !bgConfig.musicMuted && bgConfig.musicVolume > 0) {
    startMusicRotation(playlist);
  }
}

function updateMusicVolume() {
  if (audioElement) {
    audioElement.volume = bgConfig.musicMuted ? 0 : bgConfig.musicVolume / 100;
  }
}

function renderMusicPlaylistItems() {
  const container = document.getElementById('music-playlist-container');
  if (!container) return;
  container.innerHTML = '';

  if (!bgConfig.musicPlaylist) bgConfig.musicPlaylist = [];

  bgConfig.musicPlaylist.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'playlist-row';
    row.innerHTML = `
            <input type="text" class="music-url" value="${escapeHtml(item.url || '')}" placeholder="URL da música (.mp3)" data-index="${idx}">
            <input type="number" class="music-duration" value="${item.duration || 2}" min="0.5" max="60" step="0.5" data-index="${idx}">
            <button type="button" class="btn btn-danger btn-remove-music-item" data-index="${idx}" title="Remover">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;
    container.appendChild(row);
  });

  document.querySelectorAll('.music-url').forEach(input => {
    input.addEventListener('change', function (e) {
      const idx = parseInt(this.dataset.index);
      if (bgConfig.musicPlaylist[idx]) {
        bgConfig.musicPlaylist[idx].url = this.value.trim();
        saveState();
        applyMusicConfig();
      }
    });
  });

  document.querySelectorAll('.music-duration').forEach(input => {
    input.addEventListener('change', function (e) {
      const idx = parseInt(this.dataset.index);
      if (bgConfig.musicPlaylist[idx]) {
        bgConfig.musicPlaylist[idx].duration = parseFloat(this.value) || 2;
        saveState();
      }
    });
  });

  document.querySelectorAll('.btn-remove-music-item').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const idx = parseInt(this.dataset.index);
      bgConfig.musicPlaylist.splice(idx, 1);
      saveState();
      renderMusicPlaylistItems();
      applyMusicConfig();
    });
  });
}

document.getElementById('btn-add-music-item').addEventListener('click', () => {
  if (!bgConfig.musicPlaylist) bgConfig.musicPlaylist = [];
  bgConfig.musicPlaylist.push({ url: '', duration: 2 });
  saveState();
  renderMusicPlaylistItems();
});

document.getElementById('music-volume').addEventListener('input', e => {
  bgConfig.musicVolume = parseInt(e.target.value);
  saveState();
  updateMusicVolume();
});

document.getElementById('btn-toggle-mute').addEventListener('click', () => {
  bgConfig.musicMuted = !bgConfig.musicMuted;
  saveState();
  const icon = document.getElementById('mute-icon');
  const label = document.getElementById('mute-label');
  if (bgConfig.musicMuted) {
    icon.textContent = '🔇';
    label.textContent = 'Ativar som';
    stopMusic();
  } else {
    icon.textContent = '🔊';
    label.textContent = 'Mutar';
    applyMusicConfig();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.getElementById('music-volume')) {
      document.getElementById('music-volume').value = bgConfig.musicVolume;
    }
    if (document.getElementById('mute-icon')) {
      document.getElementById('mute-icon').textContent = bgConfig.musicMuted ? '🔇' : '🔊';
      document.getElementById('mute-label').textContent = bgConfig.musicMuted ? 'Ativar som' : 'Mutar';
    }
    applyMusicConfig();
  }, 500);
});

document.querySelectorAll('.bg-type-btn').forEach(btn => btn.addEventListener('click', (e) => {
  const type = e.target.dataset.type;
  bgConfig.type = type;
  if (type === 'local') bgConfig.localFile = 0;
  console.log('🔄 Tipo alterado para:', type);
  updateBgSelectorUI();
  applyBackgroundConfig();
  saveState();
}));

function updateBgSelectorUI() {
  document.querySelectorAll('.bg-type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === bgConfig.type));
  document.getElementById('bg-canvas-options').classList.toggle('hidden', bgConfig.type !== 'canvas');
  document.getElementById('bg-video-options').classList.toggle('hidden', bgConfig.type !== 'video');
  document.getElementById('bg-gif-options').classList.toggle('hidden', bgConfig.type !== 'gif');
  document.getElementById('bg-local-options').classList.toggle('hidden', bgConfig.type !== 'local');
}

document.querySelectorAll('.btn-apply-bg').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (target === 'video') {
      bgConfig.videoUrl = document.getElementById('bg-video-url').value.trim();
      saveState();
      bgConfig.type = 'video';
      console.log('🎬 Aplicando vídeo/playlist');
    } else if (target === 'gif') {
      bgConfig.gifUrl = document.getElementById('bg-gif-url').value.trim();
      bgConfig.type = 'gif';
      console.log('🖼️ Aplicando imagem/GIF:', bgConfig.gifUrl);
    }
    updateBgSelectorUI();
    applyBackgroundConfig();
    saveState();
  });
});

document.getElementById('bg-video-file').addEventListener('change', e => {
  if (e.target.files[0]) {
    bgConfig.videoUrl = URL.createObjectURL(e.target.files[0]);
    bgConfig.type = 'video';
    console.log('📁 Vídeo carregado por upload');
    updateBgSelectorUI();
    applyBackgroundConfig();
    saveState();
  }
});
document.getElementById('bg-gif-file').addEventListener('change', e => {
  if (e.target.files[0]) {
    bgConfig.gifUrl = URL.createObjectURL(e.target.files[0]);
    bgConfig.type = 'gif';
    console.log('📁 Imagem carregada por upload');
    updateBgSelectorUI();
    applyBackgroundConfig();
    saveState();
  }
});

document.querySelectorAll('.preset-link').forEach(link => link.addEventListener('click', (e) => {
  const url = e.target.dataset.url;
  document.getElementById('bg-video-url').value = url;
  bgConfig.videoUrl = url;
  bgConfig.type = 'video';
  console.log('🎞️ Preset de vídeo aplicado:', url);
  updateBgSelectorUI();
  applyBackgroundConfig();
  saveState();
}));

document.getElementById('bg-overlay-opacity').addEventListener('input', e => {
  bgConfig.opacity = e.target.value;
  document.getElementById('opacity-val').textContent = `${bgConfig.opacity}%`;
  applyBackgroundConfig();
  saveState();
});
document.getElementById('bg-blur-amount').addEventListener('input', e => {
  bgConfig.blur = e.target.value;
  document.getElementById('blur-val').textContent = `${bgConfig.blur}px`;
  applyBackgroundConfig();
  saveState();
});
document.getElementById('bg-canvas-speed').addEventListener('input', e => {
  bgConfig.canvasSpeed = parseFloat(e.target.value);
  saveState();
});

document.getElementById('btn-close-bg-modal').addEventListener('click', () => bgModal.classList.add('hidden'));
document.getElementById('btn-close-bg-modal-2').addEventListener('click', () => bgModal.classList.add('hidden'));

// 7. MODO TV 
let boeingInterval = null;

function triggerBoeingAnimation() {
  if (!isTvMode) return;
  console.log('✈️ Disparando animação Boeing de colisão');
  renderProjects(true);
}

function setTvMode(enable) {
  isTvMode = enable;
  document.body.classList.toggle('tv-mode', enable);
  document.getElementById('btn-exit-tv').classList.toggle('hidden', !enable);
  document.getElementById('tv-datetime').classList.toggle('hidden', !enable);

  if (boeingInterval) {
    clearInterval(boeingInterval);
    boeingInterval = null;
  }

  if (enable) {
    document.documentElement.requestFullscreen().catch(() => { });
    updateClock();
    triggerBoeingAnimation();
    boeingInterval = setInterval(triggerBoeingAnimation, 300000);
  } else {
    if (document.fullscreenElement) document.exitFullscreen();
    renderProjects(false);
  }
}

document.getElementById('btn-tv-mode').addEventListener('click', () => setTvMode(true));
document.getElementById('btn-exit-tv').addEventListener('click', () => setTvMode(false));

function updateClock() {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const clockEl = document.getElementById('tv-clock');
  if (clockEl) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
  }

  const weekdaysContainer = document.getElementById('tv-weekdays');
  if (weekdaysContainer) {
    const allDays = weekdaysContainer.querySelectorAll('span');
    allDays.forEach(span => {
      const day = parseInt(span.getAttribute('data-day'), 10);
      if (day === dayOfWeek) {
        span.classList.add('active');
      } else {
        span.classList.remove('active');
      }
    });
  }
}
setInterval(updateClock, 1000);

// 8. OPÇÕES EXTRA
const optionsModal = document.getElementById('modal-options');
document.getElementById('btn-more-options').addEventListener('click', () => {
  optionsModal.classList.remove('hidden');
  document.getElementById('tv-share-url').value = `${window.location.origin}${window.location.pathname}?mode=tv`;
});
document.getElementById('btn-copy-tv-url').addEventListener('click', () => {
  const input = document.getElementById('tv-share-url');
  input.select();
  navigator.clipboard.writeText(input.value);
  alert('Link copiado!');
});
document.getElementById('btn-close-options-modal').addEventListener('click', () => optionsModal.classList.add('hidden'));
document.getElementById('btn-export-data').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
  const a = document.createElement('a');
  a.href = dataStr; a.download = `kairos_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
});
document.getElementById('btn-trigger-import').addEventListener('click', () => document.getElementById('import-file-input').click());
document.getElementById('import-file-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (Array.isArray(imported)) { projects = imported; renderProjects(); alert('Importado!'); optionsModal.classList.add('hidden'); }
    } catch { alert('JSON inválido'); }
  };
  reader.readAsText(file);
});

// NOVOS BOTÕES DE CONFIGURAÇÃO
document.getElementById('btn-export-config').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ bgConfig }, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `kairos_config.json`;
  a.click();
});
document.getElementById('btn-import-config').addEventListener('click', () => {
  document.getElementById('import-config-input').click();
});
document.getElementById('import-config-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (imported.bgConfig) {
        bgConfig = imported.bgConfig;
        saveState();
        applyBackgroundConfig();
        applyMusicConfig();
        alert('Configurações importadas com sucesso!');
        optionsModal.classList.add('hidden');
      }
    } catch {
      alert('Ficheiro JSON inválido.');
    }
  };
  reader.readAsText(file);
});

document.getElementById('btn-reset-defaults').addEventListener('click', () => {
  if (confirm('Restaurar projetos padrão?')) {
    projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
    renderProjects();
    optionsModal.classList.add('hidden');
  }
});

// 9. FILTROS E BUSCA (MANUAIS)
document.querySelectorAll('.metric-chip').forEach(chip => chip.addEventListener('click', e => {
  document.querySelectorAll('.metric-chip').forEach(c => c.classList.remove('active'));
  e.currentTarget.classList.add('active');
  activeFilter = e.currentTarget.dataset.filter;
  renderProjects();
}));
document.getElementById('search-input').addEventListener('input', e => { searchQuery = e.target.value; renderProjects(); });

window.addEventListener('DOMContentLoaded', () => {
  const headerRight = document.querySelector('.header-right');
  if (headerRight && !document.getElementById('btn-add-project')) {
    const btnAdd = document.createElement('button');
    btnAdd.id = 'btn-add-project';
    btnAdd.className = 'btn btn-primary';
    btnAdd.innerHTML = `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Novo`;
    headerRight.appendChild(btnAdd);
    btnAdd.addEventListener('click', openAddModal);
  }
});

// 10. INICIALIZAÇÃO
function loadConfigFromFile() {
  fetch('config.json')
    .then(response => {
      if (!response.ok) throw new Error('config.json não encontrado');
      return response.json();
    })
    .then(data => {
      if (data && data.bgConfig) {
        console.log('📁 Configurações carregadas do ficheiro config.json');
        bgConfig = data.bgConfig;
        saveState();
        applyBackgroundConfig();
        applyMusicConfig();
        renderProjects();
      }
    })
    .catch(() => {
      console.log('ℹ️ Nenhum ficheiro config.json encontrado, usando configurações padrão ou localStorage.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Dashboard iniciado');
  setTvMode(isTvMode);
  initCanvasElements();
  animateCanvas();

  const hasStoredConfig = localStorage.getItem('kairos_bg_config');
  if (!hasStoredConfig) {
    loadConfigFromFile();
  } else {
    console.log('📦 Configurações carregadas do localStorage.');
    applyBackgroundConfig();
  }

  if (!document.getElementById('metrics-bar').innerHTML) {
    const filters = [
      { label: 'Todos', filter: 'all', id: 'count-total' },
      { label: 'Em andamento', filter: 'Em andamento', id: 'count-andamento' },
      { label: 'Em análise', filter: 'Em análise', id: 'count-analise' },
      { label: 'Parados', filter: 'Parado', id: 'count-parados' },
      { label: 'Concluídos', filter: 'Concluído', id: 'count-concluidos' }
    ];
    const bar = document.getElementById('metrics-bar');
    bar.innerHTML = filters.map(f => `
            <div class="metric-chip ${f.filter === 'all' ? 'active' : ''}" data-filter="${f.filter}">
                ${f.label} <span class="chip-count" id="${f.id}">0</span>
            </div>
        `).join('');
    document.querySelectorAll('.metric-chip').forEach(chip => chip.addEventListener('click', e => {
      document.querySelectorAll('.metric-chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeFilter = e.currentTarget.dataset.filter;
      renderProjects();
    }));
  }
  renderProjects();
  updateMetrics();
  console.log('✅ Pronto.');
});

// Desbloqueia o áudio na primeira interação do usuário
document.body.addEventListener('click', function unlockAudio() {
  userHasInteracted = true;
  if (audioElement && audioElement.paused && !bgConfig.musicMuted && bgConfig.musicVolume > 0 && bgConfig.musicPlaylist && bgConfig.musicPlaylist.length > 0) {
    if (bgConfig.musicPlaylist.some(item => item.url)) {
      audioElement.play().catch(() => { });
    }
  }
}, { once: true });