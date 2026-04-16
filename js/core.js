// ══════════════════════════════════════════════
// CORE MODULE — Navigation & UI Management
// ══════════════════════════════════════════════

// Global state
let currentPage = 'home';
let currentRole = localStorage.getItem('bontrager_role_v1') || 'student';
let currentUserName = localStorage.getItem('bontrager_username_v1') || 'Student';
let isDarkMode = localStorage.getItem('bontrager_dark_v1') === 'true';

// Initialize the app
function initApp() {
  // Apply dark mode if enabled
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    const toggle = document.getElementById('darkToggle');
    if (toggle) toggle.classList.add('on');
  }
  
  // Initialize user profile
  updateUserDisplay();
  
  // Show home page
  navTo('home');
  
  // Update statistics
  const stats = getStatistics();
  document.getElementById('homeChapters').textContent = stats.chapters;
  document.getElementById('homePositions').textContent = stats.positions;
  document.getElementById('homeBest').textContent = '—';
}

// Navigation function
function navTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) {
    pageEl.classList.add('active');
    currentPage = page;
  }
  
  // Close sidebar and update nav items
  closeSidebar();
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
  const navItem = document.getElementById('nav-' + page);
  if (navItem) navItem.classList.add('active');
  
  // Update header title
  let title = 'Bontrager Positioning';
  switch(page) {
    case 'home': title = 'Bontrager Positioning'; break;
    case 'learn-chapters': title = 'Learn'; break;
    case 'quiz-chapters': title = 'Quiz'; break;
    case 'ai': title = 'Ask AI'; break;
    case 'settings': title = 'Settings'; break;
  }
  document.getElementById('headerTitle').textContent = title;
  
  // Render content for specific pages
  if (page === 'learn-chapters') renderLearnChapters();
  if (page === 'quiz-chapters') renderQuizChapters();
}

// ═══ SIDEBAR ═══
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

// ═══ PROFILE MODAL ═══
function openProfileModal() {
  document.getElementById('profileModalOverlay').classList.add('open');
  document.getElementById('pmNameInput').value = currentUserName;
  
  // Set role selection
  document.querySelectorAll('.pm-role-card').forEach(card => card.classList.remove('selected'));
  if (currentRole === 'student') {
    document.getElementById('pmStudent').classList.add('selected');
  } else {
    document.getElementById('pmDev').classList.add('selected');
  }
}

function closeProfileModal(e) {
  if (e && e.target.id !== 'profileModalOverlay') return;
  document.getElementById('profileModalOverlay').classList.remove('open');
}

function selectPMRole(role) {
  document.querySelectorAll('.pm-role-card').forEach(card => card.classList.remove('selected'));
  if (role === 'student') {
    document.getElementById('pmStudent').classList.add('selected');
  } else {
    document.getElementById('pmDev').classList.add('selected');
  }
}

function saveProfile() {
  currentUserName = document.getElementById('pmNameInput').value || 'Student';
  localStorage.setItem('bontrager_username_v1', currentUserName);
  updateUserDisplay();
  closeProfileModal();
}

function updateUserDisplay() {
  document.getElementById('sbName').textContent = currentUserName;
  document.getElementById('sbAvatar').textContent = currentUserName.charAt(0).toUpperCase();
  
  const roleText = currentRole === 'student' ? '📚 Student mode' : '🛠 Developer mode';
  document.getElementById('sbRole').textContent = roleText;
  
  const badge = document.getElementById('heroBadge');
  if (badge) {
    badge.textContent = currentRole === 'student' ? '📚 Student Mode' : '🛠 Developer Mode';
  }
}

// ═══ ROLE MANAGEMENT ═══
function setRole(role) {
  currentRole = role;
  localStorage.setItem('bontrager_role_v1', role);
  updateUserDisplay();
  
  // Update role button states
  document.getElementById('roleStudent').classList.toggle('active', role === 'student');
  document.getElementById('roleDev').classList.toggle('active', role === 'developer');
  
  // Show/hide dev tools based on role
  if (role === 'developer') {
    document.getElementById('devAppearanceBtn').style.display = 'block';
  } else {
    document.getElementById('devAppearanceBtn').style.display = 'none';
  }
}

function requestDevRole() {
  document.getElementById('devLoginOverlay').classList.add('open');
}

function cancelDevLogin() {
  document.getElementById('devLoginOverlay').classList.remove('open');
  document.getElementById('devLoginPass').value = '';
  document.getElementById('devLoginError').classList.remove('show');
}

async function submitDevLogin() {
  const user = document.getElementById('devLoginUser').value;
  const pass = document.getElementById('devLoginPass').value;
  
  if (await _chkCreds(user, pass)) {
    setRole('developer');
    cancelDevLogin();
  } else {
    document.getElementById('devLoginError').classList.add('show');
    setTimeout(() => document.getElementById('devLoginError').classList.remove('show'), 3000);
  }
}

// ═══ APPEARANCE ═══
function toggleDark() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('bontrager_dark_v1', isDarkMode);
  document.documentElement.classList.toggle('dark');
  document.getElementById('darkToggle').classList.toggle('on');
}

function openDevAppearance() {
  document.getElementById('devAppearanceOverlay').classList.add('open');
}

function closeDevAppearance(e) {
  if (e && e.target.id !== 'devAppearanceOverlay') return;
  document.getElementById('devAppearanceOverlay').classList.remove('open');
}

function previewAppearance() {
  const bg = document.getElementById('dap-bg').value;
  const bgCard = document.getElementById('dap-bg-card').value;
  const accent = document.getElementById('dap-accent').value;
  const text = document.getElementById('dap-text').value;
  const text2 = document.getElementById('dap-text2').value;
  
  document.documentElement.style.setProperty('--bg2', bg);
  document.documentElement.style.setProperty('--bg', bgCard);
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--text', text);
  document.documentElement.style.setProperty('--text2', text2);
}

function resetAppearance() {
  document.getElementById('dap-bg').value = '#f4f3f1';
  document.getElementById('dap-bg-card').value = '#ffffff';
  document.getElementById('dap-accent').value = '#0057b8';
  document.getElementById('dap-text').value = '#09090b';
  document.getElementById('dap-text2').value = '#52525b';
  previewAppearance();
  saveAppearance();
}

function saveAppearance() {
  localStorage.setItem('bontrager_appearance_v1', JSON.stringify({
    bg: document.getElementById('dap-bg').value,
    bgCard: document.getElementById('dap-bg-card').value,
    accent: document.getElementById('dap-accent').value,
    text: document.getElementById('dap-text').value,
    text2: document.getElementById('dap-text2').value,
  }));
  closeDevAppearance();
}

// ═══ PAGE RENDERING ═══
function renderLearnChapters() {
  const container = document.getElementById('learnChList');
  container.innerHTML = '';
  
  for (let chKey in BOOK) {
    const chapter = BOOK[chKey];
    
    // If chapter has subchapters
    if (chapter.subchapters) {
      for (let schKey in chapter.subchapters) {
        const subch = chapter.subchapters[schKey];
        const btn = document.createElement('div');
        btn.className = 'ch-btn';
        btn.innerHTML = `
          <div class="ch-icon">${subch.icon}</div>
          <div class="ch-info">
            <div class="ch-name">${subch.name}</div>
            <div class="ch-sub">${(subch.positions || []).length} positions</div>
          </div>
          <div class="ch-arrow">→</div>
        `;
        btn.onclick = () => renderLearnPositions(chKey, schKey);
        container.appendChild(btn);
      }
    } else {
      // Chapter without subchapters
      const btn = document.createElement('div');
      btn.className = 'ch-btn';
      btn.innerHTML = `
        <div class="ch-icon">${chapter.icon}</div>
        <div class="ch-info">
          <div class="ch-name">${chapter.name}</div>
          <div class="ch-sub">${(chapter.positions || []).length} positions</div>
        </div>
        <div class="ch-arrow">→</div>
      `;
      btn.onclick = () => renderLearnPositions(chKey, null);
      container.appendChild(btn);
    }
  }
}

function renderLearnPositions(chKey, schKey) {
  const chapter = BOOK[chKey];
  let positions = [];
  let title = '';
  
  if (schKey && chapter.subchapters && chapter.subchapters[schKey]) {
    positions = chapter.subchapters[schKey].positions || [];
    title = chapter.subchapters[schKey].name;
  } else {
    positions = chapter.positions || [];
    title = chapter.name;
  }
  
  document.getElementById('learnPosTitle').textContent = title;
  const container = document.getElementById('learnPosList');
  container.innerHTML = '';
  
  positions.forEach((pos, idx) => {
    const btn = document.createElement('div');
    btn.className = 'pos-btn';
    const badge = pos.type === 'routine' ? '🔵' : '⭐';
    btn.innerHTML = `${badge} ${pos.name}`;
    btn.onclick = () => viewPosition(pos, title, idx);
    container.appendChild(btn);
  });
  
  navTo('learn-positions');
}

function viewPosition(position, chapterName, posIdx) {
  document.getElementById('posViewTitle').textContent = position.name;
  document.getElementById('posViewDesc').textContent = position.info.desc;
  
  // Build tech card
  const techHtml = `
    <div class="tech-row">
      <div class="tech-label">CR</div>
      <div class="tech-val">${position.info.cr}</div>
    </div>
    <div class="tech-row">
      <div class="tech-label">IR</div>
      <div class="tech-val">${position.info.ir}</div>
    </div>
    <div class="tech-row">
      <div class="tech-label">SID</div>
      <div class="tech-val">${position.info.sid}</div>
    </div>
    <div class="tech-row">
      <div class="tech-label">kVp</div>
      <div class="tech-val">${position.info.kv}</div>
    </div>
    <div class="tech-row">
      <div class="tech-label">Respiration</div>
      <div class="tech-val">${position.info.resp}</div>
    </div>
  `;
  document.getElementById('posViewTech').innerHTML = techHtml;
  
  // Set badge
  const badgeEl = document.getElementById('posViewBadge');
  if (position.type === 'routine') {
    badgeEl.innerHTML = '<span class="badge badge-r">🔵 Routine Position</span>';
  } else {
    badgeEl.innerHTML = '<span class="badge badge-s">⭐ Special Position</span>';
  }
  
  displayPositionImage(position.name);
  navTo('pos-view');
}

function renderQuizChapters() {
  const container = document.getElementById('quizChList');
  container.innerHTML = '<p style="color:var(--text2);padding:16px">Quiz questions coming soon...</p>';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initApp);
