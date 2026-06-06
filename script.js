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

function showSection(name) {
  document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));
  document.getElementById('section-' + name).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.className = b.className.replace('bg-pink-500 text-white shadow-md', 'bg-white text-pink-500 border border-pink-200');
  });
  event.currentTarget.className = event.currentTarget.className.replace('bg-white text-pink-500 border border-pink-200', 'bg-pink-500 text-white shadow-md');
}

function displayTeacher(idx) {
  const t = teachers[idx % teachers.length];
  document.getElementById('teacher-name').textContent = t.name;
  document.getElementById('teacher-subject').textContent = t.subject;
  document.getElementById('teacher-quote').textContent = t.quote;
  const votes = allData.filter(d => d.teacher_id === t.id && !d.message).length;
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
  btn.disabled = false; btn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i> ส่งข้อความ'; lucide.createIcons();
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

function renderCollection() {
  const grid = document.getElementById('collection-grid');
  if (collection.length === 0) {
    grid.innerHTML = '<div class="text-center text-xs text-gray-400 col-span-3 py-8"><i data-lucide="inbox" class="w-8 h-8 mx-auto text-gray-300 mb-2"></i>ยังไม่มีการ์ดสะสม<br>ลองสุ่มกาชาดูสิ!</div>';
    lucide.createIcons();
    return;
  }
  grid.innerHTML = collection.map((c, i) => `
    <div class="rounded-xl border-2 rarity-${c.rarity} p-2 text-center bg-gradient-to-b from-white to-pink-50">
      <div class="w-10 h-10 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-1"><i data-lucide="user" class="w-5 h-5 text-pink-400"></i></div>
      <p class="text-[10px] font-bold ${c.rarity === 'SSR' ? 'text-yellow-500' : c.rarity === 'SR' ? 'text-purple-500' : c.rarity === 'R' ? 'text-blue-500' : 'text-gray-500'}">${c.rarity}</p>
      <p class="text-[10px] text-gray-700 truncate">${c.teacher.name}</p>
    </div>
  `).join('');
  lucide.createIcons();
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
  lucide.createIcons();
})();
