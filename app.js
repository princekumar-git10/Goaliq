/* ═══════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — GoalIQ AI PLATFORM
   app.js — All interactivity, simulations, AI chatbot, charts
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── STATE ──────────────────────────────────────────────────── */
const STATE = {
  currentSection: 'hero',
  currentRole: 'fan',
  chatOpen: false,
  chatLanguage: 'en',
  crowdData: { north: 94, south: 61, east: 78, west: 45 },
  transportData: { subway: 8, bus: 4, ride: 18, park: 12 },
  nextMatchTime: new Date(Date.now() + 3 * 60 * 60 * 1000 + 24 * 60 * 1000 + 38 * 1000),
  notifQueue: [],
  incidentCount: 3,
  attendanceTarget: 74230,
  currentAttendance: 0,
};

/* ─── TICKER DATA ────────────────────────────────────────────── */
const TICKER_MATCHES = [
  { home: '🇺🇸 USA', score: '2–1', away: 'Mexico 🇲🇽', status: 'LIVE 68\'' },
  { home: '🇩🇪 Germany', score: '3–2', away: 'France 🇫🇷', status: 'FT' },
  { home: '🇧🇷 Brazil', score: '0–0', away: 'Argentina 🇦🇷', status: 'Tonight 19:30' },
  { home: '🇪🇸 Spain', score: '1–0', away: 'Portugal 🇵🇹', status: 'LIVE 42\'' },
  { home: '🇬🇧 England', score: '2–2', away: 'Italy 🇮🇹', status: 'LIVE 81\'' },
  { home: '🇳🇱 Netherlands', score: '4–1', away: 'Belgium 🇧🇪', status: 'FT' },
  { home: '🇯🇵 Japan', score: '1–2', away: 'South Korea 🇰🇷', status: 'LIVE 55\'' },
  { home: '🇲🇦 Morocco', score: '2–0', away: 'Senegal 🇸🇳', status: 'Tomorrow 15:00' },
];

/* ─── AI RESPONSES ───────────────────────────────────────────── */
const AI_RESPONSES = {
  en: {
    welcome: "Hello! I'm GoalIQ, your AI assistant for FIFA World Cup 2026 🏆 I can help you with navigation, match info, transport, accessibility services, and more. What can I help you with?",
    quickReplies: ['Find my seat 🗺️', 'Nearest restroom 🚻', 'Food courts 🍔', 'Transport options 🚇', 'Accessibility help ♿'],
    seat: "Your seat is **Section 113, Row F, Seat 22** in the North Stand. 🎫\n\nTo get there from Gate B:\n1. Enter Gate B (est. wait: 8 min — consider Gate D instead, only 2 min wait!)\n2. Take elevator to Level 3\n3. Follow blue signage to Section 113\n\nEstimated walk time: **4 minutes** from Gate B.\n\n🤖 *AI Tip: Gate D (South) is currently less congested!*",
    restroom: "Nearest restrooms to your seat (Section 113):\n\n🚻 **Level 3, Corridor C** — 90m away (closest)\n🚻 **Level 2, Gate B area** — 150m away\n♿ **Accessible restroom** — Level 3, near elevator bank\n\nAll restrooms have real-time queue tracking. Current wait: ~2 minutes.",
    food: "🍔 Food options near you:\n\n**Food Court 1 (North Level 2)** — 11 min queue ❌\n**Food Court 2 (South Level 1)** — 3 min queue ✅ *AI Recommended*\n**Concession Stand C-5** — 5 min · Hot dogs, pretzels, drinks\n**Premium Lounge L3** — VIP only · no queue\n\n💡 Order via the app to skip the queue entirely!",
    transport: "🚇 Current transport options from MetLife Stadium:\n\n**Subway Line 4** — 8 min wait 🟡 (minor delays)\n**Shuttle Bus A** — 4 min wait ✅ (on schedule)\n**Rideshare Zone** — 18 min wait 🔴 (high demand, surge pricing)\n**Parking** — Lots B & C full, Lot D has spaces 🟡\n\n🤖 *AI recommends Shuttle Bus A for fastest exit!*",
    access: "♿ Accessibility services available right now:\n\n• Wheelchair Assistance: **2 min wait** ✅\n• Sign Language Interpreter: **Available now** ✅  \n• Audio Description: **Streaming now** ✅\n• Sensory-Friendly Zone: **Open on Level 2** ✅\n\nShall I request any of these services for you? Just say 'request wheelchair' or similar!",
    default: "I'm checking that for you... 🤔\n\nBased on real-time data from GoalIQ sensors across MetLife Stadium, here's what I found:\n\n• **Stadium capacity**: 78% full (74,230 fans)\n• **Next match event**: Halftime in ~17 minutes\n• **AI Alert**: North Stand congested — Gate D recommended\n\nIs there something more specific I can help you with?"
  },
  es: {
    welcome: "¡Hola! Soy GoalIQ, tu asistente de IA para la Copa Mundial FIFA 2026 🏆 Puedo ayudarte con navegación, información de partidos, transporte y más. ¿En qué puedo ayudarte?",
    quickReplies: ['Encontrar mi asiento 🗺️', 'Baño más cercano 🚻', 'Comida 🍔', 'Transporte 🚇', 'Accesibilidad ♿'],
    default: "Estoy revisando eso para ti... 🤔\n\nSegún los datos en tiempo real del Estadio MetLife:\n\n• **Capacidad**: 78% lleno (74,230 aficionados)\n• **Próximo evento**: Medio tiempo en ~17 minutos\n• **Alerta IA**: Norte congestionado — se recomienda Puerta D\n\n¿En qué más puedo ayudarte?"
  },
  fr: {
    welcome: "Bonjour! Je suis GoalIQ, votre assistant IA pour la Coupe du Monde FIFA 2026 🏆 Comment puis-je vous aider?",
    quickReplies: ['Trouver mon siège 🗺️', 'Toilettes 🚻', 'Restauration 🍔', 'Transport 🚇', 'Accessibilité ♿'],
    default: "Je vérifie cela pour vous... 🤔\n\nSelon les données en temps réel du Stade MetLife:\n\n• **Capacité**: 78% (74 230 fans)\n• **Alerte IA**: Tribune Nord encombrée — utilisez la Porte D\n\nQue puis-je faire d'autre pour vous?"
  },
  pt: {
    welcome: "Olá! Sou GoalIQ, seu assistente de IA para a Copa do Mundo FIFA 2026 🏆 Como posso ajudar você?",
    quickReplies: ['Encontrar meu assento 🗺️', 'Banheiro 🚻', 'Comida 🍔', 'Transporte 🚇', 'Acessibilidade ♿'],
    default: "Estou verificando isso para você... 🤔\n\nCom base nos dados em tempo real do MetLife Stadium:\n\n• **Capacidade**: 78% (74.230 fãs)\n• **Alerta IA**: Stand Norte congestionado — use o Portão D\n\nPosso ajudar com mais alguma coisa?"
  },
  de: {
    welcome: "Hallo! Ich bin GoalIQ, Ihr KI-Assistent für die FIFA Weltmeisterschaft 2026 🏆 Wie kann ich Ihnen helfen?",
    quickReplies: ['Meinen Platz finden 🗺️', 'Toiletten 🚻', 'Essen 🍔', 'Transport 🚇', 'Barrierefreiheit ♿'],
    default: "Ich überprüfe das für Sie... 🤔\n\nBasierend auf Echtzeit-Daten des MetLife Stadions:\n\n• **Kapazität**: 78% (74.230 Fans)\n• **KI-Warnung**: Nordtribüne überfüllt — Eingang D empfohlen\n\nKann ich Ihnen sonst noch helfen?"
  },
  ar: {
    welcome: "مرحباً! أنا GoalIQ، مساعدك الذكي لكأس العالم FIFA 2026 🏆 كيف يمكنني مساعدتك؟",
    quickReplies: ['إيجاد مقعدي 🗺️', 'دورة المياه 🚻', 'الطعام 🍔', 'المواصلات 🚇', 'إمكانية الوصول ♿'],
    default: "أتحقق من ذلك الآن... 🤔\n\nبناءً على البيانات اللحظية:\n\n• **الطاقة**: 78% ممتلئ (74,230 مشجع)\n• **تنبيه الذكاء الاصطناعي**: المدرج الشمالي مزدحم — يُنصح باستخدام البوابة D\n\nهل يمكنني مساعدتك في شيء آخر؟"
  },
  zh: {
    welcome: "你好！我是GoalIQ，2026年FIFA世界杯AI助手 🏆 我可以帮助您导航、查询赛事信息、交通选择等。有什么可以帮助您的？",
    quickReplies: ['找到我的座位 🗺️', '最近的卫生间 🚻', '餐厅 🍔', '交通 🚇', '无障碍服务 ♿'],
    default: "正在为您查询... 🤔\n\n根据MetLife体育场实时数据：\n\n• **上座率**：78%（74,230名球迷）\n• **AI提醒**：北看台拥挤 — 建议使用D号入口\n\n还有什么可以帮到您？"
  },
  ja: {
    welcome: "こんにちは！私はGoalIQ、FIFA ワールドカップ2026のAIアシスタントです 🏆 ナビゲーション、試合情報、交通など何でもお聞きください！",
    quickReplies: ['席を探す 🗺️', 'トイレ 🚻', 'フード 🍔', '交通 🚇', 'アクセシビリティ ♿'],
    default: "確認しています... 🤔\n\nメットライフスタジアムのリアルタイムデータ：\n\n• **収容率**：78%（74,230名）\n• **AIアラート**：北スタンド混雑 — ゲートD推奨\n\n他にご質問はありますか？"
  },
  ko: {
    welcome: "안녕하세요! 저는 GoalIQ, FIFA 월드컵 2026 AI 어시스턴트입니다 🏆 무엇이든 도와드릴게요!",
    quickReplies: ['좌석 찾기 🗺️', '화장실 🚻', '음식점 🍔', '교통 🚇', '접근성 ♿'],
    default: "확인 중입니다... 🤔\n\n메트라이프 스타디움 실시간 데이터:\n\n• **수용률**: 78% (74,230명)\n• **AI 알림**: 북쪽 스탠드 혼잡 — D게이트 추천\n\n다른 도움이 필요하신가요?"
  },
  hi: {
    welcome: "नमस्ते! मैं GoalIQ हूं, FIFA विश्व कप 2026 के लिए आपका AI सहायक 🏆 मैं नेविगेशन, मैच जानकारी, परिवहन और अधिक में मदद कर सकता हूं!",
    quickReplies: ['मेरी सीट खोजें 🗺️', 'शौचालय 🚻', 'खाना 🍔', 'परिवहन 🚇', 'पहुंच सहायता ♿'],
    default: "मैं आपके लिए जांच कर रहा हूं... 🤔\n\nMetLife Stadium के रियल-टाइम डेटा के अनुसार:\n\n• **क्षमता**: 78% भरा (74,230 प्रशंसक)\n• **AI अलर्ट**: उत्तरी स्टैंड भीड़भाड़ — Gate D की सिफारिश\n\nमैं और कैसे मदद कर सकता हूं?"
  }
};

const ECO_TIPS = [
  { icon: '🚌', text: '<strong>Take a shuttle!</strong> Stadium shuttles tonight run every 8 minutes and save an avg of <strong>3.1 kg CO₂</strong> per fan compared to driving.' },
  { icon: '🌱', text: '<strong>Plant a tree!</strong> Every fan today is contributing to the GoalIQ Forest Initiative — <strong>74,230 trees</strong> to be planted after this match.' },
  { icon: '♻️', text: 'Yellow bins are for <strong>recyclables</strong>, blue for <strong>compost</strong>. AI-sorting stations at every exit help achieve our <strong>90% diversion goal</strong>.' },
  { icon: '💡', text: 'The stadium\'s <strong>LED lighting system</strong> uses 60% less energy than traditional fixtures — saving 240,000 kWh per match night.' },
  { icon: '💧', text: 'Refill stations are on every level. Today, fans have already prevented <strong>14,200 single-use plastic bottles</strong> from entering the waste stream.' },
  { icon: '🌞', text: 'MetLife Stadium\'s <strong>solar canopy</strong> generated 1.8 MWh this afternoon — enough to power 600 homes for a day!' },
  { icon: '🍃', text: 'All food vendors use <strong>compostable packaging</strong> today. The carbon saved equals driving a car <strong>18,400 fewer miles</strong>.' },
];

const NOTIFICATIONS = [
  { type: 'warning', icon: '⚠️', title: 'North Stand Congestion', msg: 'Gate C at 94% capacity. AI redirecting fans to Gate D.', delay: 6000 },
  { type: 'info', icon: '⚽', title: 'Goal Alert!', msg: 'USA scores at minute 68! MetLife Stadium erupts!', delay: 14000 },
  { type: 'success', icon: '🚇', title: 'Transport Update', msg: 'Shuttle Bus A now running every 5 minutes. 4 min wait.', delay: 22000 },
  { type: 'critical', icon: '🚨', title: 'AI Crowd Alert', msg: 'Halftime surge predicted in 14 min. 6 extra staff deployed.', delay: 32000 },
  { type: 'info', icon: '🌱', title: 'Sustainability Win!', msg: '78% of fans today used public transport. New record!', delay: 42000 },
  { type: 'warning', icon: '🔧', title: 'Maintenance Alert', msg: 'Turnstile B-7 under maintenance. 2 lanes restored shortly.', delay: 55000 },
  { type: 'success', icon: '♿', title: 'Accessibility Service', msg: 'Wheelchair assistance requested at Gate D — en route (2 min).', delay: 68000 },
];

/* ─── ZONE DATA ──────────────────────────────────────────────── */
const ZONE_DATA = {
  north: { icon: '🔴', title: 'North Stand — Gates A, B, C', body: 'CONGESTED · 94% capacity · 12,680/13,500 fans · AI recommends entering via Gate D (South Stand, 61% capacity, 2 min wait)' },
  south: { icon: '🟢', title: 'South Stand — Gates D, E, F', body: 'OPEN · 61% capacity · 8,235/13,500 fans · 2 min average entry wait · Nearest food court: Level 1 (3 min queue)' },
  east:  { icon: '🟡', title: 'East Stand — Gates G, H', body: 'BUSY · 78% capacity · 10,530/13,500 fans · 5 min average entry wait · Premium matchday hospitality on Level 4' },
  west:  { icon: '🟣', title: 'West Stand — VIP & Press', body: 'VIP ACCESS ONLY · 45% capacity · Credential scan required · Suite level above · Press box at Level 5' },
  vip:   { icon: '⭐', title: 'VIP / Press Box', body: 'Restricted zone · Valid media/VIP credential required · Complimentary catering · Dedicated elevator access' },
  food:  { icon: '🍔', title: 'Food Courts', body: 'Food Court 1 (North): 11 min wait · Food Court 2 (South): 3 min wait ✅ · AI recommends Food Court 2 today! · 22 vendor options' },
  firstaid: { icon: '🏥', title: 'First Aid Stations', body: '2 stations: North Level 2 & South Level 2 · Open 24/7 · Paramedics on duty · AED defibrillators at all stations · Call 555-WC26 for emergencies' },
  accessible: { icon: '♿', title: 'Accessible Zones', body: 'Step-free access available at all entry points · Dedicated seating in Section 113A, 201A · Elevator banks at Gates B, D, G · Request assistance via GoalIQ AI' },
};

/* ─── SECTION NAVIGATION ─────────────────────────────────────── */
function showSection(name) {
  // Hide all sections (hero is not a .section, handle separately)
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-hero').style.display = 'none';

  if (name === 'hero') {
    document.getElementById('section-hero').style.display = '';
  } else {
    const el = document.getElementById('section-' + name);
    if (el) el.classList.add('active');
  }

  STATE.currentSection = name;
  updateNavActive(name);

  // Trigger chart renders on first show
  if (name === 'crowd' && !STATE.crowdChartDrawn) {
    setTimeout(() => { drawCrowdFlowChart(); STATE.crowdChartDrawn = true; }, 100);
  }
  if (name === 'analytics' && !STATE.analyticsChartDrawn) {
    setTimeout(() => { drawAnalyticsChart(); drawTransportForecastChart(); STATE.analyticsChartDrawn = true; }, 100);
  }
  if (name === 'sustainability' && !STATE.sustainChartsDrawn) {
    setTimeout(() => { drawRingGauges(); STATE.sustainChartsDrawn = true; }, 100);
  }
  if (name === 'crowd' && !STATE.gaugesDrawn) {
    setTimeout(() => { drawCrowdGauges(); STATE.gaugesDrawn = true; }, 100);
  }
}

function updateNavActive(name) {
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('nav-' + name);
  if (btn) btn.classList.add('active');
}

/* ─── ROLE SWITCHER ──────────────────────────────────────────── */
function switchRole(role) {
  STATE.currentRole = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('role-' + role).classList.add('active');

  const roleDisplay = document.getElementById('userRoleDisplay');
  if (roleDisplay) {
    const labels = { fan: '⚽ Fan Mode', volunteer: '🦺 Volunteer Mode', staff: '👷 Staff Mode', organizer: '🛡️ Organizer Mode' };
    roleDisplay.textContent = labels[role] || '⚽ Fan Mode';
  }

  // Auto-navigate to command center for staff/organizer
  if ((role === 'staff' || role === 'organizer') && STATE.currentSection === 'hero') {
    showNotification('info', '🛡️', `${role.charAt(0).toUpperCase() + role.slice(1)} Mode`, 'Command Center and full operational tools are now unlocked.');
  }
}

/* ─── COUNTDOWN TIMER ────────────────────────────────────────── */
function updateCountdown() {
  const now = new Date();
  const diff = Math.max(0, STATE.nextMatchTime - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = n => String(n).padStart(2, '0');
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = pad(val); };
  setEl('cd-hours', h);
  setEl('cd-mins', m);
  setEl('cd-secs', s);
}

/* ─── TICKER ─────────────────────────────────────────────────── */
function buildTicker() {
  const container = document.getElementById('tickerItems');
  if (!container) return;
  const items = [...TICKER_MATCHES, ...TICKER_MATCHES]; // duplicate for seamless loop
  container.innerHTML = items.map(m =>
    `<div class="ticker-item">
      <div class="live-dot" ${m.status.startsWith('LIVE') ? '' : 'style="background:rgba(255,255,255,0.4);animation:none;"'}></div>
      <span>${m.home}</span>
      <span class="score">${m.score}</span>
      <span>${m.away}</span>
      <span style="color:rgba(255,255,255,0.5);font-size:11px;">${m.status}</span>
    </div>`
  ).join('');
}

/* ─── HERO ATTENDANCE COUNTER ────────────────────────────────── */
function animateCounter(elementId, target, duration = 2000) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.floor(eased * target);
    el.textContent = val.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ─── STADIUM MAP LAYER ──────────────────────────────────────── */
function setMapLayer(layer) {
  // Update buttons
  document.querySelectorAll('.map-toggle-btn').forEach(b => b.classList.remove('active'));
  const idMap = { normal: 'mapBtnNormal', heat: 'mapBtnHeat', access: 'mapBtnAccess', route: 'mapBtnRoute' };
  const btn = document.getElementById(idMap[layer]);
  if (btn) btn.classList.add('active');

  // Toggle SVG layers
  const heatEl   = document.getElementById('heatmapOverlay');
  const accessEl = document.getElementById('accessOverlay');
  const routeEl  = document.getElementById('aiRoute');

  if (heatEl)   heatEl.style.display   = layer === 'heat'   ? 'block' : 'none';
  if (accessEl) accessEl.style.display = layer === 'access' ? 'block' : 'none';
  if (routeEl)  routeEl.style.display  = layer === 'route'  ? 'block' : 'none';
}

/* ─── ZONE SELECTION ─────────────────────────────────────────── */
function selectZone(zone) {
  const data = ZONE_DATA[zone];
  if (!data) return;

  const panel = document.getElementById('zoneDetail');
  const icon  = document.getElementById('zoneDetailIcon');
  const title = document.getElementById('zoneDetailTitle');
  const body  = document.getElementById('zoneDetailBody');

  if (panel && icon && title && body) {
    icon.textContent  = data.icon;
    title.textContent = data.title;
    body.textContent  = data.body;
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Highlight zone in SVG
  document.querySelectorAll('.zone-path').forEach(p => {
    p.style.opacity = '0.4';
    p.style.transition = 'opacity 0.3s';
  });
  const selectedZoneEl = document.getElementById('zone-' + zone);
  if (selectedZoneEl) {
    const path = selectedZoneEl.querySelector('.zone-path');
    if (path) { path.style.opacity = '1'; }
    setTimeout(() => {
      document.querySelectorAll('.zone-path').forEach(p => p.style.opacity = '1');
    }, 3000);
  }
}

/* ─── CROWD GAUGE CHARTS (Canvas) ───────────────────────────── */
function drawArcGauge(canvasId, value, color, bgColor) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 60, cy = 60, r = 48;
  ctx.clearRect(0, 0, 120, 120);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
  ctx.strokeStyle = bgColor || 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value arc
  const startAngle = Math.PI * 0.75;
  const endAngle   = startAngle + (value / 100) * Math.PI * 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Glow effect
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawCrowdGauges() {
  drawArcGauge('gauge-north', STATE.crowdData.north, '#EF4444');
  drawArcGauge('gauge-south', STATE.crowdData.south, '#22C55E');
  drawArcGauge('gauge-east',  STATE.crowdData.east,  '#F59E0B');
}

/* ─── CROWD FLOW LINE CHART (Canvas) ────────────────────────── */
function drawCrowdFlowChart() {
  const canvas = document.getElementById('crowdFlowChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 900;
  const H = 200;
  canvas.width  = W;
  canvas.height = H;

  const dataPoints = [12, 18, 28, 42, 55, 64, 70, 78, 82, 88, 94, 91, 85, 78, 72, 68, 65];
  const labels    = ['15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00'];
  const pad = { top: 20, right: 20, bottom: 40, left: 40 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top  - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (ph / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + pw, y); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(`${100 - i * 25}%`, pad.left - 6, y + 4);
  }

  // Gradient fill
  const pts = dataPoints.map((v, i) => ({
    x: pad.left + (i / (dataPoints.length - 1)) * pw,
    y: pad.top  + (1 - v / 100) * ph
  }));

  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ph);
  grad.addColorStop(0,   'rgba(232,0,28,0.4)');
  grad.addColorStop(1,   'rgba(232,0,28,0)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pad.top + ph);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, pad.top + ph);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Main line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#E8001C';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Data dots
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#E8001C';
    ctx.fill();
    ctx.strokeStyle = '#060914';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Labels (every other)
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '9px Inter';
  ctx.textAlign = 'center';
  pts.forEach((p, i) => {
    if (i % 2 === 0) ctx.fillText(labels[i], p.x, H - pad.bottom + 14);
  });

  // Now marker
  const nowIdx = Math.round(dataPoints.length * 0.65);
  const nowPt  = pts[nowIdx];
  ctx.strokeStyle = 'rgba(255,215,0,0.6)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(nowPt.x, pad.top);
  ctx.lineTo(nowPt.x, pad.top + ph);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 10px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('NOW', nowPt.x, pad.top - 4);
}

/* ─── ANALYTICS CHART ────────────────────────────────────────── */
function drawAnalyticsChart() {
  const canvas = document.getElementById('analyticsChart');
  if (!canvas) return;
  const W = canvas.offsetWidth || 900;
  const H = 260;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const todayData = [5, 10, 18, 32, 48, 62, 74, 82, 88, 94, 90, 85, 80, 75, 70, 68, 65, 60, 48, 30, 18, 10, 5];
  const histData  = [8, 12, 20, 35, 50, 60, 68, 75, 80, 85, 82, 78, 74, 70, 66, 62, 58, 52, 44, 32, 20, 12, 8];
  const labels    = Array.from({length: 23}, (_, i) => `${String(i + 10).padStart(2,'0')}:00`);
  const pad = { top: 30, right: 30, bottom: 50, left: 50 };
  const pw = W - pad.left - pad.right;
  const ph = H - pad.top  - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  // Grid
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + (ph / 5) * i;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + pw, y); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(`${100 - i * 20}%`, pad.left - 8, y + 4);
  }

  const makePts = (data) => data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * pw,
    y: pad.top  + (1 - v / 100) * ph
  }));

  const todayPts = makePts(todayData);
  const histPts  = makePts(histData);

  // Historical area
  const hGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ph);
  hGrad.addColorStop(0, 'rgba(0,212,170,0.1)');
  hGrad.addColorStop(1, 'rgba(0,212,170,0)');
  ctx.beginPath();
  ctx.moveTo(histPts[0].x, pad.top + ph);
  histPts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(histPts[histPts.length-1].x, pad.top + ph);
  ctx.fillStyle = hGrad; ctx.fill();

  // Historical line (dashed)
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  histPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#00D4AA'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.setLineDash([]);

  // Today area
  const tGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ph);
  tGrad.addColorStop(0, 'rgba(232,0,28,0.3)');
  tGrad.addColorStop(1, 'rgba(232,0,28,0)');
  ctx.beginPath();
  ctx.moveTo(todayPts[0].x, pad.top + ph);
  todayPts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(todayPts[todayPts.length-1].x, pad.top + ph);
  ctx.fillStyle = tGrad; ctx.fill();

  // Today line
  ctx.beginPath();
  todayPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#E8001C'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();

  // Dot on current time
  const nowIdx  = Math.round(todayPts.length * 0.55);
  const nowPt   = todayPts[nowIdx];
  ctx.beginPath(); ctx.arc(nowPt.x, nowPt.y, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700'; ctx.fill();
  ctx.strokeStyle = '#060914'; ctx.lineWidth = 2; ctx.stroke();

  // X-axis labels
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '9px Inter';
  ctx.textAlign = 'center';
  todayPts.forEach((p, i) => {
    if (i % 4 === 0) ctx.fillText(labels[i], p.x, H - pad.bottom + 16);
  });
}

/* ─── TRANSPORT FORECAST CHART ───────────────────────────────── */
function drawTransportForecastChart() {
  const canvas = document.getElementById('transportForecastChart');
  if (!canvas) return;
  const W = canvas.offsetWidth || 400;
  const H = 200;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bars  = [
    { label: 'Subway', value: 65, color: '#3B82F6' },
    { label: 'Bus', value: 40, color: '#22C55E' },
    { label: 'Rideshare', value: 88, color: '#EF4444' },
    { label: 'Parking', value: 75, color: '#F59E0B' },
  ];
  const pad = { top: 20, right: 20, bottom: 40, left: 20 };
  const pw  = W - pad.left - pad.right;
  const ph  = H - pad.top  - pad.bottom;
  const bw  = (pw / bars.length) * 0.55;
  const gap  = pw / bars.length;

  ctx.clearRect(0, 0, W, H);

  bars.forEach((b, i) => {
    const x  = pad.left + gap * i + (gap - bw) / 2;
    const bh = (b.value / 100) * ph;
    const y  = pad.top + ph - bh;

    // Background bar
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    roundRect(ctx, x, pad.top, bw, ph, 6);
    ctx.fill();

    // Value bar
    const grad = ctx.createLinearGradient(0, y, 0, y + bh);
    grad.addColorStop(0, b.color);
    grad.addColorStop(1, b.color + '60');
    ctx.fillStyle = grad;
    ctx.beginPath();
    roundRect(ctx, x, y, bw, bh, 6);
    ctx.fill();

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(b.label, x + bw / 2, H - pad.bottom + 16);
    ctx.fillStyle = b.color;
    ctx.font = 'bold 11px Inter';
    ctx.fillText(b.value + '%', x + bw / 2, y - 6);
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

/* ─── SUSTAINABILITY RING GAUGES ─────────────────────────────── */
function drawRingGauge(canvasId, value, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 50, cy = 50, r = 38;
  ctx.clearRect(0, 0, 100, 100);

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 8;
  ctx.stroke();

  const endAngle = -Math.PI / 2 + (value / 100) * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawRingGauges() {
  drawRingGauge('ring-carbon',  42, '#00D4AA');
  drawRingGauge('ring-solar',   62, '#FFD700');
  drawRingGauge('ring-recycle', 78, '#00D4AA');
  drawRingGauge('ring-water',   31, '#3B82F6');
}

/* ─── CHATBOT ────────────────────────────────────────────────── */
function toggleChatbot() {
  STATE.chatOpen = !STATE.chatOpen;
  const panel = document.getElementById('chatbotPanel');
  if (panel) panel.classList.toggle('open', STATE.chatOpen);

  if (STATE.chatOpen && document.getElementById('chatMessages').children.length === 0) {
    initChatbot();
  }
}

function initChatbot() {
  const lang     = STATE.chatLanguage;
  const responses = AI_RESPONSES[lang] || AI_RESPONSES['en'];
  const messages  = document.getElementById('chatMessages');
  messages.innerHTML = '';

  addBotMessage(responses.welcome);
  setTimeout(() => {
    addQuickReplies(responses.quickReplies);
  }, 600);
}

function changeLanguage(lang) {
  STATE.chatLanguage = lang;
  const messages = document.getElementById('chatMessages');
  if (messages) messages.innerHTML = '';
  setTimeout(initChatbot, 200);
}

function addBotMessage(text) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;

  // Show typing first
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg bot';
  typingEl.innerHTML = `
    <div class="chat-bubble" style="padding:12px;">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  messages.appendChild(typingEl);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    typingEl.remove();
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot';
    // Convert **bold** and \n to formatted HTML
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    msgEl.innerHTML = `<div class="chat-bubble">${formatted}</div>`;
    messages.appendChild(msgEl);
    messages.scrollTop = messages.scrollHeight;
  }, 900 + Math.random() * 400);
}

function addQuickReplies(replies) {
  const messages = document.getElementById('chatMessages');
  if (!messages || !replies) return;
  const el = document.createElement('div');
  el.className = 'chat-quick-replies';
  el.innerHTML = replies.map(r =>
    `<button class="chat-quick-btn" onclick="quickReply(this, '${r}')">${r}</button>`
  ).join('');
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function quickReply(btn, text) {
  const displayText = text.replace(/ [^\x00-\x7F]+$/, '').trim().replace(/\s+[^\x00-\x7F]$/, '');
  sendChatMessage(text);
  // Remove quick replies
  btn.closest('.chat-quick-replies').remove();
}

function sendChatMessage(overrideText) {
  const input   = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  const text    = overrideText || (input ? input.value.trim() : '');
  if (!text) return;
  if (input && !overrideText) input.value = '';

  // Add user message
  const userEl = document.createElement('div');
  userEl.className = 'chat-msg user';
  userEl.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
  messages.appendChild(userEl);
  messages.scrollTop = messages.scrollHeight;

  // Get AI response
  const lang      = STATE.chatLanguage;
  const responses = AI_RESPONSES[lang] || AI_RESPONSES['en'];
  const lc = text.toLowerCase();
  let reply;
  if (lc.includes('seat') || lc.includes('asiento') || lc.includes('siège') || lc.includes('assento') || lc.includes('sitz') || lc.includes('座位') || lc.includes('席')) {
    reply = responses.seat || responses.default;
  } else if (lc.includes('restroom') || lc.includes('toilet') || lc.includes('bathroom') || lc.includes('baño') || lc.includes('toilette') || lc.includes('banheiro') || lc.includes('wc') || lc.includes('🚻')) {
    reply = responses.restroom || responses.default;
  } else if (lc.includes('food') || lc.includes('eat') || lc.includes('comida') || lc.includes('manger') || lc.includes('comida') || lc.includes('🍔') || lc.includes('essen')) {
    reply = responses.food || responses.default;
  } else if (lc.includes('transport') || lc.includes('train') || lc.includes('bus') || lc.includes('subway') || lc.includes('🚇') || lc.includes('metro')) {
    reply = responses.transport || responses.default;
  } else if (lc.includes('access') || lc.includes('wheelchair') || lc.includes('♿') || lc.includes('disability') || lc.includes('sign language')) {
    reply = responses.access || responses.default;
  } else {
    reply = responses.default;
  }

  addBotMessage(reply);
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ─── NOTIFICATIONS ──────────────────────────────────────────── */
function showNotification(type, icon, title, msg) {
  const panel = document.getElementById('notifPanel');
  if (!panel) return;

  const toast = document.createElement('div');
  toast.className = `notif-toast ${type}`;
  const time  = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
      <div class="toast-time">${time}</div>
    </div>
    <div class="toast-close" onclick="this.closest('.notif-toast').remove()">✕</div>`;

  panel.appendChild(toast);

  // Auto dismiss
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s var(--ease-smooth) forwards';
    setTimeout(() => toast.remove(), 400);
  }, 7000);
}

function toggleNotifications() {
  const panel = document.getElementById('notifPanel');
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'flex';
  }
}

/* ─── SCHEDULED NOTIFICATIONS ────────────────────────────────── */
function scheduleNotifications() {
  NOTIFICATIONS.forEach(n => {
    setTimeout(() => showNotification(n.type, n.icon, n.title, n.msg), n.delay);
  });
}

/* ─── REAL-TIME DATA SIMULATION ──────────────────────────────── */
function simulateRealTimeData() {
  setInterval(() => {
    // Fluctuate crowd data
    const jitter = () => (Math.random() - 0.5) * 3;
    STATE.crowdData.north = Math.max(80, Math.min(100, STATE.crowdData.north + jitter()));
    STATE.crowdData.south = Math.max(40, Math.min(75,  STATE.crowdData.south + jitter()));
    STATE.crowdData.east  = Math.max(60, Math.min(88,  STATE.crowdData.east  + jitter()));

    // Update gauge texts
    const setGaugeText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.childNodes[0].textContent = Math.round(val) + '%';
    };
    setGaugeText('gauge-north-text', STATE.crowdData.north);
    setGaugeText('gauge-south-text', STATE.crowdData.south);
    setGaugeText('gauge-east-text',  STATE.crowdData.east);

    // Redraw gauges if visible
    if (STATE.currentSection === 'crowd' && STATE.gaugesDrawn) {
      drawCrowdGauges();
    }

    // Update stat card
    const statCard = document.getElementById('statCrowdLevel');
    if (statCard) statCard.textContent = Math.round(STATE.crowdData.north) + '%';

    // Fluctuate transport wait times
    const transportJitter = () => Math.floor((Math.random() - 0.5) * 4);
    STATE.transportData.subway = Math.max(3, Math.min(20, STATE.transportData.subway + transportJitter()));
    STATE.transportData.bus    = Math.max(2, Math.min(12, STATE.transportData.bus    + transportJitter()));
    STATE.transportData.ride   = Math.max(10, Math.min(30, STATE.transportData.ride  + transportJitter()));
    STATE.transportData.park   = Math.max(5, Math.min(20,  STATE.transportData.park  + transportJitter()));

    ['subway', 'bus', 'ride', 'park'].forEach(key => {
      const el = document.getElementById(`wait-${key}`);
      if (el) el.textContent = STATE.transportData[key];
    });

    const statTransit = document.getElementById('statTransitWait');
    if (statTransit) statTransit.textContent = STATE.transportData.bus + ' min';

  }, 3000);
}

/* ─── TRANSPORT REFRESH ──────────────────────────────────────── */
function refreshTransport() {
  const btn = document.getElementById('refreshTransportBtn');
  if (btn) {
    btn.textContent = '⏳ Refreshing...';
    btn.disabled    = true;
  }
  setTimeout(() => {
    STATE.transportData.subway = Math.floor(Math.random() * 10) + 4;
    STATE.transportData.bus    = Math.floor(Math.random() * 6)  + 2;
    STATE.transportData.ride   = Math.floor(Math.random() * 15) + 10;
    STATE.transportData.park   = Math.floor(Math.random() * 10) + 8;

    ['subway', 'bus', 'ride', 'park'].forEach(key => {
      const el = document.getElementById(`wait-${key}`);
      if (el) el.textContent = STATE.transportData[key];
    });
    if (btn) { btn.textContent = '✅ Updated!'; }
    setTimeout(() => { if (btn) { btn.textContent = '🔄 Refresh'; btn.disabled = false; } }, 2000);
    showNotification('success', '🚇', 'Transport Updated', 'Real-time transport data refreshed successfully.');
  }, 1200);
}

/* ─── ACCESSIBILITY SERVICE REQUEST ─────────────────────────── */
function requestService(service) {
  const panel = document.getElementById('accessRequestPanel');
  const title = document.getElementById('accessRequestTitle');
  const body  = document.getElementById('accessRequestBody');

  if (panel && title && body) {
    title.textContent = `✅ ${service} Requested`;
    body.textContent  = `A trained staff member is on their way to assist you with ${service}. Estimated arrival: 2-3 minutes. Your request ID: ACC-${Math.floor(Math.random() * 9000) + 1000}.`;
    panel.style.display = 'flex';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showNotification('success', '♿', 'Service Requested', `${service} confirmed. Staff en route (2-3 min).`);
  }
}

/* ─── ECO TIPS REFRESH ───────────────────────────────────────── */
let ecoTipIndex = 0;
function refreshEcoTips() {
  const list = document.getElementById('ecoTipsList');
  if (!list) return;

  const nextTips = [];
  for (let i = 0; i < 3; i++) {
    nextTips.push(ECO_TIPS[(ecoTipIndex + i) % ECO_TIPS.length]);
  }
  ecoTipIndex = (ecoTipIndex + 3) % ECO_TIPS.length;

  list.innerHTML = nextTips.map(t => `
    <div class="eco-tip">
      <div class="eco-tip-icon">${t.icon}</div>
      <div class="eco-tip-text">${t.text}</div>
    </div>`
  ).join('');
}

/* ─── INCIDENT REPORTING ─────────────────────────────────────── */
const INCIDENT_TEMPLATES = [
  { priority: 'medium', icon: '🔊', title: 'Noise Complaint — Section 204', meta: 'Fan dispute reported · Security dispatched' },
  { priority: 'low',    icon: '🧹', title: 'Cleaning Required — Concourse B', meta: 'Spill reported at Gate B-12 · Cleaning crew notified' },
  { priority: 'high',   icon: '🚑', title: 'Medical Emergency — Parking Lot D', meta: 'Fan reported chest pain · Ambulance en route' },
  { priority: 'medium', icon: '🔒', title: 'Unauthorized Entry Attempt — VIP Zone', meta: 'Security engaged · Badge scan failed x3' },
];
let incidentTemplateIdx = 0;

function addIncident() {
  const list = document.getElementById('incidentList');
  if (!list) return;
  const t    = INCIDENT_TEMPLATES[incidentTemplateIdx % INCIDENT_TEMPLATES.length];
  incidentTemplateIdx++;
  STATE.incidentCount++;

  const el = document.createElement('div');
  el.className = `incident-item ${t.priority}`;
  const badgeClass = { high: 'danger', medium: 'warning', low: 'info' }[t.priority];
  const badgeText  = { high: 'HIGH', medium: 'MED', low: 'LOW' }[t.priority];
  el.innerHTML = `
    <div class="incident-icon">${t.icon}</div>
    <div class="incident-body">
      <div class="incident-title">${t.title}</div>
      <div class="incident-meta">${t.meta}</div>
    </div>
    <div>
      <div class="incident-time">Just now</div>
      <span class="badge ${badgeClass}">${badgeText}</span>
    </div>`;
  list.prepend(el);

  const kpi = document.getElementById('kpiIncidents');
  if (kpi) kpi.textContent = STATE.incidentCount;
  showNotification(t.priority === 'high' ? 'critical' : 'warning', t.icon, 'New Incident', t.title);
}

/* ─── EMERGENCY BROADCAST ────────────────────────────────────── */
function triggerEmergency() {
  const btn = document.getElementById('emergencyBtn');
  if (!btn) return;

  if (btn.dataset.confirmed !== 'true') {
    btn.textContent = '⚠️ CONFIRM BROADCAST — CLICK AGAIN';
    btn.dataset.confirmed = 'true';
    setTimeout(() => {
      btn.textContent = '🚨 EMERGENCY BROADCAST';
      btn.dataset.confirmed = 'false';
    }, 4000);
    return;
  }

  btn.textContent = '📡 BROADCASTING...';
  btn.disabled    = true;
  showNotification('critical', '🚨', 'EMERGENCY BROADCAST', 'Emergency protocol activated. All staff notified. PA system engaged.');
  setTimeout(() => {
    btn.textContent = '✅ BROADCAST SENT';
    setTimeout(() => {
      btn.textContent = '🚨 EMERGENCY BROADCAST';
      btn.disabled    = false;
      btn.dataset.confirmed = 'false';
    }, 3000);
  }, 2000);
}

/* ─── CROWD FLOW CHART LIVE UPDATE ──────────────────────────── */
function startChartLiveUpdate() {
  setInterval(() => {
    if (STATE.currentSection === 'crowd' && STATE.crowdChartDrawn) {
      drawCrowdFlowChart();
    }
    if (STATE.currentSection === 'analytics' && STATE.analyticsChartDrawn) {
      drawAnalyticsChart();
    }
  }, 8000);
}

/* ─── RESIZE HANDLER ─────────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (STATE.crowdChartDrawn)    drawCrowdFlowChart();
    if (STATE.analyticsChartDrawn) { drawAnalyticsChart(); drawTransportForecastChart(); }
    if (STATE.sustainChartsDrawn) drawRingGauges();
  }, 300);
});

/* ─── SOCIAL SENTIMENT ANIMATION ────────────────────────────── */
function animateSentiment() {
  setInterval(() => {
    const pos = Math.floor(60 + Math.random() * 15);
    const neg = Math.floor(10 + Math.random() * 10);
    const neu = 100 - pos - neg;
    const bar = document.getElementById('sentimentBar');
    if (!bar) return;
    const segs = bar.children;
    if (segs[0]) segs[0].style.width = pos + '%';
    if (segs[1]) segs[1].style.width = neu + '%';
    if (segs[2]) segs[2].style.width = neg + '%';
  }, 5000);
}

/* ─── HERO SECTION ───────────────────────────────────────────── */
function initHero() {
  // Show hero on load
  document.getElementById('section-hero').style.display = '';

  // Animate attendance counter after 500ms
  setTimeout(() => animateCounter('heroAttendance', STATE.attendanceTarget), 500);
}

/* ─── INITIAL SECTION VISIBILITY FIX ────────────────────────── */
function initSections() {
  // All .section should be display:none, hero is separately managed
  document.querySelectorAll('.section').forEach(s => {
    s.style.display = 'none';
  });
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
  });
}

/* ─── MAIN INIT ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSections();
  buildTicker();
  initHero();
  scheduleNotifications();
  simulateRealTimeData();
  animateSentiment();
  startChartLiveUpdate();

  // Start countdown
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Initial welcome notification
  setTimeout(() => {
    showNotification('info', '🤖', 'GoalIQ AI Ready', 'Your AI platform is online. Real-time data streaming from 42 stadium sensors.');
  }, 2000);

  // Fix CSS section display — sections use class toggle
  const style = document.createElement('style');
  style.textContent = `.section { display: none; } .section.active { display: block; }`;
  document.head.appendChild(style);
});
