// Teacher data
const teachers = [
  { id: 't1', name: 'ครูสมศรี ใจดี', subject: 'กลุ่มสาระภาษาไทย', quote: '"การเรียนรู้คือการเดินทางที่ไม่มีวันสิ้นสุด"' },
  { id: 't2', name: 'ครูประยุทธ์ วิชาดี', subject: 'กลุ่มสาระคณิตศาสตร์', quote: '"ตัวเลขคือภาษาของจักรวาล"' },
  { id: 't3', name: 'ครูมาลี รักเรียน', subject: 'กลุ่มสาระวิทยาศาสตร์', quote: '"ทุกคำถามนำไปสู่การค้นพบ"' },
  { id: 't4', name: 'ครูสมชาย ศิลป์สวย', subject: 'กลุ่มสาระศิลปะ', quote: '"ศิลปะอยู่ในทุกสิ่งรอบตัว"' },
  { id: 't5', name: 'ครูวิภา อังกฤษเก่ง', subject: 'กลุ่มสาระภาษาต่างประเทศ', quote: '"Language opens doors to the world"' },
  { id: 't6', name: 'ครูธนพล กีฬาเด่น', subject: 'กลุ่มสาระสุขศึกษา', quote: '"สุขภาพดีคือทรัพย์สินที่มีค่าที่สุด"' },
];

let currentTeacherIdx = 0;
let collection = JSON.parse(localStorage.getItem('gacha_collection') || '[]');
let allData = [];
let currentRecordCount = 0;

// Populate teacher select
const sel = document.getElementById('msg-teacher');
teachers.forEach(t => {
  const o = document.createElement('option');
  o.value = t.id;
  o.textContent = t.name;
  sel.appendChild(o);
});

function showSection(name, el) {
  document.querySelectorAll('.section-content').forEach(s => {
    s.classList.add('hidden');
  });

  document.getElementById('section-' + name).classList.remove('hidden');

  // Reset nav buttons
  document.querySelectorAll('.nav-btn, .nav-btn a, .nav-btn').forEach(b => {
    b.classList.remove('bg-pink-500', 'text-white', 'shadow-md');
    b.classList.add('bg-white', 'text-pink-500', 'border', 'border-pink-200');
  });

  // If an element was passed, mark it active; otherwise try to find matching button by onclick attribute or href
  if (el) {
    el.classList.add('bg-pink-500', 'text-white', 'shadow-md');
  } else {
    const target = Array.from(document.querySelectorAll('.nav-btn, a')).find(x => {
      const oc = x.getAttribute && x.getAttribute('onclick');
      const href = x.getAttribute && x.getAttribute('href');
      if (oc && oc.includes(`showSection('${name}')`)) return true;
      if (href && href.endsWith('#' + name)) return true;
      return false;
    });
    if (target && target.classList) target.classList.add('bg-pink-500', 'text-white', 'shadow-md');
  }
}

function openFromHash() {
  const h = (location.hash || '').replace('#', '');
  if (h) {
    // Only open known sections
    const allowed = ['vote', 'message', 'gacha', 'collection'];
    if (allowed.includes(h)) {
      showSection(h);
    }
  }
}

function displayTeacher(idx) {
  const t = teachers[idx % teachers.length];
  document.getElementById('teacher-name').textContent = t.name;
  document.getElementById('teacher-subject').textContent = t.subject;
  document.getElementById('teacher-quote').textContent = t.quote;
  const votes = allData.filter(
  d => d.teacher_id === t.id && !d.message
).length || 0;
  document.getElementById('vote-count').textContent = votes;
  const card = document.getElementById('teacher-card');
  card.classList.remove('swipe-left', 'swipe-right');
}

function skipTeacher() {
  const card = document.getElementById('teacher-card');
  card.classList.add('swipe-left');
  setTimeout(() => { currentTeacherIdx++; displayTeacher(currentTeacherIdx); }, 400);
}

async function voteTeacher() {
  if (currentRecordCount >= 999) { showToast('ถึงจำนวนโหวตสูงสุดแล้ว'); return; }
  const card = document.getElementById('teacher-card');
  card.classList.add('swipe-right');
  const t = teachers[currentTeacherIdx % teachers.length];
  const result = await window.dataSdk.create({ teacher_id: t.id, vote_count: 1, message: '', student_name: '', created_at: new Date().toISOString() });
  if (!result.isOk) showToast('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
  setTimeout(() => { currentTeacherIdx++; displayTeacher(currentTeacherIdx); }, 400);
}

function shuffleTeacher() {
  currentTeacherIdx = Math.floor(Math.random() * teachers.length);
  const card = document.getElementById('teacher-card');
  card.style.transform = 'scale(0.9)';
  setTimeout(() => { card.style.transform = ''; displayTeacher(currentTeacherIdx); }, 200);
}

async function sendMessage() {
  const teacherId = document.getElementById('msg-teacher').value;
  const name = document.getElementById('msg-name').value || 'นักเรียนนิรนาม';
  const msg = document.getElementById('msg-text').value.trim();
  if (!msg) { showToast('กรุณาเขียนข้อความก่อนส่ง'); return; }
  if (currentRecordCount >= 999) { showToast('ถึงจำนวนข้อความสูงสุดแล้ว'); return; }
  const btn = document.getElementById('send-msg-btn');
  btn.disabled = true; btn.textContent = 'กำลังส่ง...';
  const result = await window.dataSdk.create({ teacher_id: teacherId, vote_count: 0, message: msg, student_name: name, created_at: new Date().toISOString() });
  btn.disabled = false; btn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i> ส่งข้อความ'; createLucideIcons();
  if (result.isOk) {
    document.getElementById('msg-success').classList.remove('hidden');
    document.getElementById('msg-text').value = '';
    setTimeout(() => document.getElementById('msg-success').classList.add('hidden'), 3000);
  } else { showToast('ส่งไม่สำเร็จ ลองใหม่'); }
}

function pullGacha() {
  const rarities = [{r:'N',w:50},{r:'R',w:30},{r:'SR',w:15},{r:'SSR',w:5}];
  const roll = Math.random() * 100;
  let cum = 0, rarity = 'N';
  for (const rv of rarities) { cum += rv.w; if (roll < cum) { rarity = rv.r; break; } }
  const t = teachers[Math.floor(Math.random() * teachers.length)];
  const card = { rarity, teacher: t };
  collection.push(card);
  localStorage.setItem('gacha_collection', JSON.stringify(collection));

  const gc = document.getElementById('gacha-card');
  gc.className = `mx-auto w-48 h-64 rounded-2xl border-4 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-pink-50 gacha-spin rarity-${rarity}`;
  document.getElementById('gacha-rarity').textContent = rarity;
  document.getElementById('gacha-rarity').className = `text-xs font-bold mb-1 ${rarity === 'SSR' ? 'text-yellow-500' : rarity === 'SR' ? 'text-purple-500' : rarity === 'R' ? 'text-blue-500' : 'text-gray-500'}`;
  document.getElementById('gacha-name').textContent = t.name;
  document.getElementById('gacha-subj').textContent = t.subject;
  document.getElementById('gacha-result').classList.remove('hidden');
  gc.style.animation = 'none'; gc.offsetHeight; gc.style.animation = '';
  renderCollection();
}

const lucideIconPaths = {
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  sparkles: 'M5 12l5 5L20 7M4 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7z',
  'flower-2': 'M9 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm-6 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z',
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z',
  gift: 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7M2 12h20M12 22V12M12 2v10M7 7h10',
  'layout-grid': 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  star: 'M12 2l3 7h7l-5.5 4.1L18 21l-6-3.9L6 21l1.5-7.9L2 9h7l3-7z',
  x: 'M18 6 6 18M6 6l12 12',
  shuffle: 'M16 3h5v5M8 21H3v-5M21 3 14 10m-4 4-7 7M21 14V9m-5 5h5',
  'pen-tool': 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z',
  'check-circle': 'M9 12l2 2 4-4M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
  inbox: 'M22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7M22 12l-6 8H8l-6-8M2 7h20'
};

function createFallbackIcon(name, classes = '') {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', `lucide ${classes}`.trim());
  const d = lucideIconPaths[name] || lucideIconPaths.star;
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  return svg;
}

function replaceIconElement(el) {
  const name = el.getAttribute('data-lucide');
  const classes = el.getAttribute('class') || '';
  const svg = createFallbackIcon(name, classes);
  el.replaceWith(svg);
}

function createLucideIcons() {
  const lucideApi = (typeof lucide !== 'undefined' && lucide) || window.lucide || window.Lucide;
  if (lucideApi && typeof lucideApi.createIcons === 'function') {
    lucideApi.createIcons();
  } else {
    document.querySelectorAll('[data-lucide]').forEach(el => {
      if (el.tagName.toLowerCase() === 'i') replaceIconElement(el);
    });
  }
}

function renderCollection() {
  const grid = document.getElementById('collection-grid');
  if (collection.length === 0) {
    grid.innerHTML = '<div class="text-center text-xs text-gray-400 col-span-3 py-8"><i data-lucide="inbox" class="w-8 h-8 mx-auto text-gray-300 mb-2"></i>ยังไม่มีการ์ดสะสม<br>ลองสุ่มกาชาดูสิ!</div>';
    createLucideIcons();
    return;
  }
  grid.innerHTML = collection.map((c, i) => `
    <div class="rounded-xl border-2 rarity-${c.rarity} p-2 text-center bg-gradient-to-b from-white to-pink-50">
      <div class="w-10 h-10 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-1"><i data-lucide="user" class="w-5 h-5 text-pink-400"></i></div>
      <p class="text-[10px] font-bold ${c.rarity === 'SSR' ? 'text-yellow-500' : c.rarity === 'SR' ? 'text-purple-500' : c.rarity === 'R' ? 'text-blue-500' : 'text-gray-500'}">${c.rarity}</p>
      <p class="text-[10px] text-gray-700 truncate">${c.teacher.name}</p>
    </div>
  `).join('');
  createLucideIcons();
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'toast'; toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-pink-600 text-white px-5 py-2 rounded-full text-sm shadow-lg z-50 transition-opacity'; document.body.appendChild(toast); }
  toast.textContent = msg; toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

const dataHandler = {
  onDataChanged(data) {
    allData = data;
    currentRecordCount = data.length;
    const t = teachers[currentTeacherIdx % teachers.length];
    const votes = data.filter(d => d.teacher_id === t.id && !d.message).length;
    document.getElementById('vote-count').textContent = votes;
  }
};

const defaultConfig = {
  site_title: 'โหวตครูดีในดวงใจ',
  tagline: 'ร่วมส่งความรักและความเคารพให้คุณครูที่คุณประทับใจ',
  background_color: '#FFF0F5',
  surface_color: '#FFFFFF',
  text_color: '#4A4A4A',
  primary_action_color: '#EC4899',
  secondary_action_color: '#F9A8D4'
};

window.elementSdk.init({
  defaultConfig,
  onConfigChange: async (config) => {
    document.getElementById('site-title').textContent = config.site_title || defaultConfig.site_title;
    document.getElementById('tagline').textContent = config.tagline || defaultConfig.tagline;
    const app = document.getElementById('app');
    app.style.background = `linear-gradient(135deg, ${config.background_color || defaultConfig.background_color} 0%, #FFE4E1 50%, #FFFAF0 100%)`;
    document.querySelectorAll('.bg-white').forEach(el => el.style.backgroundColor = config.surface_color || defaultConfig.surface_color);
    document.querySelectorAll('h1, h2, h3').forEach(el => el.style.color = config.text_color || defaultConfig.text_color);
  },
  mapToCapabilities: (config) => ({
    recolorables: [
      { get: () => config.background_color || defaultConfig.background_color, set: (v) => { config.background_color = v; window.elementSdk.setConfig({ background_color: v }); } },
      { get: () => config.surface_color || defaultConfig.surface_color, set: (v) => { config.surface_color = v; window.elementSdk.setConfig({ surface_color: v }); } },
      { get: () => config.text_color || defaultConfig.text_color, set: (v) => { config.text_color = v; window.elementSdk.setConfig({ text_color: v }); } },
      { get: () => config.primary_action_color || defaultConfig.primary_action_color, set: (v) => { config.primary_action_color = v; window.elementSdk.setConfig({ primary_action_color: v }); } },
      { get: () => config.secondary_action_color || defaultConfig.secondary_action_color, set: (v) => { config.secondary_action_color = v; window.elementSdk.setConfig({ secondary_action_color: v }); } },
    ],
    borderables: [],
    fontEditable: { get: () => config.font_family || 'Prompt', set: (v) => { config.font_family = v; window.elementSdk.setConfig({ font_family: v }); } },
    fontSizeable: { get: () => config.font_size || 16, set: (v) => { config.font_size = v; window.elementSdk.setConfig({ font_size: v }); } },
  }),
  mapToEditPanelValues: (config) => new Map([
    ['site_title', config.site_title || defaultConfig.site_title],
    ['tagline', config.tagline || defaultConfig.tagline],
  ])
});

(async () => {
  await window.dataSdk.init(dataHandler);
  displayTeacher(0);
  renderCollection();
  createLucideIcons();
})();

displayTeacher(currentTeacherIdx);
renderCollection();
createLucideIcons();

// ensure icons are created and open section if hash present
document.addEventListener('DOMContentLoaded', () => { createLucideIcons(); openFromHash(); });
window.addEventListener('load', () => { createLucideIcons(); openFromHash(); });
setTimeout(() => { createLucideIcons(); openFromHash(); }, 120);

let voting = false;

async function voteTeacher() {
  if (voting) return;
  voting = true;

  const t = teachers[currentTeacherIdx % teachers.length];

  const result = await window.dataSdk.create({
    teacher_id: t.id,
    vote_count: 1,
    message: '',
    student_name: '',
    created_at: new Date().toISOString()
  });

  if (!result.isOk) showToast('เกิดข้อผิดพลาด');
  
  setTimeout(() => {
    currentTeacherIdx++;
    displayTeacher(currentTeacherIdx);
    voting = false;
  }, 500);
}
