(() => {
  'use strict';

  const { DAYS, CITIES, PLACE_TYPES, PLACES, SCHOOLS, INCLUDES } = window.DATA;
  const C = window.CONTENT;
  const P = window.PDD;

  /* ================= helpers ================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rub = n => Math.round(n).toLocaleString('ru-RU') + ' ₽';
  const plural = (n, one, few, many) => {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b === 1) return one;
    if (b >= 2 && b <= 4) return few;
    return many;
  };
  const fmtDate = (iso, opts = { day: 'numeric', month: 'long' }) => new Date(iso.length === 10 ? iso + 'T00:00:00' : iso).toLocaleDateString('ru-RU', opts);
  const fmtKm = d => (d < 1 ? Math.round(d * 1000 / 50) * 50 + ' м' : d.toFixed(1).replace('.', ',') + ' км');
  const fmtTimer = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dayLabel = Object.fromEntries(DAYS);
  const linkify = s => esc(s).replace(/\[([^\]]+)\]\((#[^)\s]+)\)/g, '<a href="$2">$1</a>');

  const store = {
    get(k, d) { try { const v = localStorage.getItem('ingo:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('ingo:' + k, JSON.stringify(v)); } catch (e) { /* storage недоступен */ } },
  };

  /* ================= icons ================= */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    compare: '<path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M12 2v20"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    send: '<path d="m22 2-11 11M22 2l-7 20-4-9-9-4z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    shieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    car: '<path d="M5 17H3v-4l2-5.5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5L21 13v4h-2M9 17h6M3 13h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    map: '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 14.5V21M9.5 12H3M14.5 12H21"/>',
    percent: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor" stroke="none"/>',
    umbrella: '<path d="M22 12a10 10 0 0 0-20 0z"/><path d="M12 12v7a2 2 0 0 0 4 0"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8M14.7 6.3 13 4.6a4 4 0 0 0-5.6 5.6L3 14.6V21h6.4"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  };
  const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  /* ================= labels ================= */
  const LBL = {
    theory: { offline: 'Очно в классе', online: 'Онлайн', mixed: 'Смешанный', none: 'Без теории' },
    trans: { manual: 'Механика (МКПП)', auto: 'Автомат (АКПП)' },
    transShort: { manual: 'МКПП', auto: 'АКПП' },
    time: { morning: 'Утро', day: 'День', evening: 'Вечер', weekend: 'Выходные' },
    timeHint: { morning: '7:00–12:00', day: '12:00–17:00', evening: '17:00–22:00', weekend: 'Сб, Вс' },
    pay: { card: 'Банковская карта', sbp: 'СБП', installment: 'Рассрочка' },
  };
  const HOURS = [['lt10', '< 10 ч'], ['gt10', '> 10 ч'], ['gt20', '> 20 ч'], ['gt30', '> 30 ч'], ['gt40', '> 40 ч'], ['gt50', '> 50 ч']];

  /* ================= derived data ================= */
  const TARIFFS = [];
  SCHOOLS.forEach(s => {
    s.full = `Автошкола «${s.name}»`;
    s.initials = s.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    s.tariffs.forEach(t => { t.schoolId = s.id; TARIFFS.push(t); });
    const full = s.tariffs.filter(t => t.theory !== 'none');
    s.minPrice = Math.min(...full.map(t => t.price));
    s.formats = [...new Set(full.map(t => t.theory))];
    s.trans = [...new Set(full.map(t => t.trans))];
    s.installment = s.tariffs.some(t => t.inst > 0);
    s.maxInst = Math.max(0, ...s.tariffs.map(t => t.inst));
    const instFull = full.filter(t => t.inst);
    s.minMonthly = instFull.length ? Math.min(...instFull.map(t => t.price / t.inst)) : null;
  });
  const schoolById = id => SCHOOLS.find(s => s.id === id);
  const tariffById = id => TARIFFS.find(t => t.id === id);
  const nearestGroup = s => [...s.groups].filter(g => g.seats > 0).sort((a, b) => a.start.localeCompare(b.start))[0];
  const daysText = days => days.length === 7 ? 'Ежедневно' : days.join() === 'mon,tue,wed,thu,fri' ? 'Пн–Пт' : days.map(d => dayLabel[d]).join(', ');
  const monthsText = m => `${m} ${plural(m, 'месяц', 'месяца', 'месяцев')}`;
  const hasClassTheory = t => t.theory === 'offline' || t.theory === 'mixed';
  const includesOf = t => [...(t.theory === 'none' ? INCLUDES.pack : INCLUDES.full), ...(t.extra || [])];

  function km(a, b) {
    const R = 6371, r = x => x * Math.PI / 180;
    const dLat = r(b.lat - a.lat), dLng = r(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /* ================= state ================= */
  const COMMON = ['city', 'district', 'place', 'radius'];
  const defaultSF = () => ({ formats: [], priceMin: '', priceMax: '', installment: false, sort: 'rating', view: 'list', q: '' });
  const defaultTF = () => ({ trans: [], formats: [], theoryTimes: [], days: [], ptimes: [], hours: '', priceMin: '', priceMax: '', installment: false, sort: 'price', q: '' });

  const state = {
    common: { city: 'Москва', district: '', place: '', radius: 0 },
    sf: defaultSF(),
    tf: defaultTF(),
    geo: null,
    user: store.get('user', null),
    compare: store.get('compare', { schools: [], tariffs: [] }),
    orders: store.get('orders', []),
    pdd: Object.assign({ answered: {}, mistakes: [], tickets: {} }, store.get('pdd', {})),
    cmpDiff: false,
  };
  const saveOrders = () => store.set('orders', state.orders);

  function origin() {
    const p = state.common.place;
    if (!p) return null;
    if (p === 'geo') return state.geo;
    return PLACES.find(x => x.id === p) || null;
  }

  /* ================= small UI pieces ================= */
  function toast(msg, type = '') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = msg;
    $('#toast').appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 300); }, 4200);
  }

  const crumbs = items => `<nav class="crumbs" aria-label="Хлебные крошки">${items.map(([t, h]) => h ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`).join('<span class="crumbs__sep">/</span>')}</nav>`;
  const stars = r => `<span class="rating">${ic('star')}<b>${r.toFixed(1)}</b></span>`;
  const ratingHTML = s => `<span class="rating">${ic('star')}<b>${s.rating.toFixed(1)}</b><small>${s.reviews} ${plural(s.reviews, 'отзыв', 'отзыва', 'отзывов')}</small></span>`;
  const mediaInner = s => `<span class="media__logo">${s.initials}</span><span class="media__car">${ic('car')}</span>`;
  const chip = (t, mod = '') => `<span class="chip ${mod}">${t}</span>`;

  function cmpBtn(kind, id, compact = false) {
    const on = state.compare[kind].includes(id);
    return `<button class="cmp-btn ${on ? 'is-on' : ''} ${compact ? 'cmp-btn--icon' : ''}" data-action="cmp" data-kind="${kind}" data-id="${id}" aria-pressed="${on}" title="${on ? 'Убрать из сравнения' : 'Добавить к сравнению'}">${ic(on ? 'check' : 'compare')}<span>${on ? 'В сравнении' : 'Сравнить'}</span></button>`;
  }

  const emptyState = (title, text, actions = '') => `<div class="empty"><div class="empty__ic">${ic('search')}</div><h3>${title}</h3><p>${text}</p>${actions}</div>`;

  function placeOptions(city, selected) {
    const list = PLACES.filter(p => p.city === city);
    return Object.entries(PLACE_TYPES).map(([type, label]) => {
      const items = list.filter(p => p.type === type);
      return items.length ? `<optgroup label="${label}">${items.map(p => `<option value="${p.id}" ${p.id === selected ? 'selected' : ''}>${p.name}</option>`).join('')}</optgroup>` : '';
    }).join('');
  }

  /* ================= cards ================= */
  function schoolTile(s) {
    const g = nearestGroup(s);
    return `<article class="tile">
      <a class="tile__media media" href="#/school/${s.id}" style="--h:${s.hue}">${mediaInner(s)}<span class="tile__rating">${stars(s.rating)}</span></a>
      <div class="tile__body">
        <a class="tile__name" href="#/school/${s.id}">${s.full}</a>
        <p class="muted small">${ic('pin')} ${s.near} · ${s.district}</p>
        <div class="chips">${s.formats.map(f => chip(LBL.theory[f])).join('')}${s.installment ? chip('Рассрочка', 'chip--green') : ''}</div>
        <div class="tile__foot">
          <div><div class="price"><small>от</small> ${rub(s.minPrice)}</div><div class="price-sub">Сдают с 1-го раза: <b>${s.pass}%</b></div></div>
          ${cmpBtn('schools', s.id, true)}
        </div>
        ${g ? `<p class="tile__group">${ic('calendar')} Ближайшая группа — ${fmtDate(g.start)}</p>` : `<p class="tile__group">${ic('zap')} Теория онлайн — старт в любой день</p>`}
      </div>
    </article>`;
  }

  function schoolRow(s, d) {
    const g = nearestGroup(s);
    return `<article class="srow">
      <a class="srow__media media" href="#/school/${s.id}" style="--h:${s.hue}">${mediaInner(s)}</a>
      <div class="srow__body">
        <div class="srow__head"><a class="srow__name" href="#/school/${s.id}">${s.full}</a>${ratingHTML(s)}</div>
        <p class="srow__addr">${ic('pin')} ${s.near} · ${s.address}${d != null ? ` · <b>${fmtKm(d)} от ${esc(origin().name)}</b>` : ''}</p>
        <div class="chips">${s.formats.map(f => chip(LBL.theory[f])).join('')}${s.trans.map(t => chip(LBL.transShort[t], 'chip--blue')).join('')}${s.installment ? chip('Рассрочка до ' + s.maxInst + ' мес', 'chip--green') : ''}</div>
        <dl class="stats-mini">
          <div><dt>Сдают с 1-го раза</dt><dd>${s.pass}%</dd></div>
          <div><dt>Автопарк</dt><dd>${s.fleet} авто</dd></div>
          <div><dt>Ближайшая группа</dt><dd>${g ? fmtDate(g.start) : 'онлайн'}</dd></div>
        </dl>
      </div>
      <div class="srow__aside">
        <div class="price"><small>от</small> ${rub(s.minPrice)}</div>
        <div class="price-sub">${s.minMonthly ? `или от ${rub(s.minMonthly)}/мес` : 'без рассрочки'}</div>
        <a class="btn btn-primary btn-block" href="#/school/${s.id}">${s.tariffs.length} ${plural(s.tariffs.length, 'тариф', 'тарифа', 'тарифов')}</a>
        ${cmpBtn('schools', s.id)}
      </div>
    </article>`;
  }

  function tariffCard(t, opt = {}) {
    const s = schoolById(t.schoolId);
    const o = origin();
    return `<article class="tcard">
      <div class="tcard__top">${t.badge ? `<span class="badge">${t.badge}</span>` : ''}${chip(LBL.transShort[t.trans], 'chip--blue')}${chip(LBL.theory[t.theory])}</div>
      <h3 class="tcard__name"><a href="#/tariff/${t.id}">${t.name}</a></h3>
      ${opt.school !== false ? `<a class="tcard__school" href="#/school/${s.id}">${s.full} ${stars(s.rating)}</a><p class="muted small">${ic('pin')} ${s.near}${o ? ` · ${fmtKm(km(o, s))}` : ''}</p>` : ''}
      <ul class="facts">
        <li>${ic('wheel')}<span><b>${t.hours} ч</b> вождения</span></li>
        <li>${ic('calendar')}<span>${daysText(t.days)}</span></li>
        <li>${ic('clock')}<span>${t.times.map(x => LBL.time[x].toLowerCase()).join(', ')}</span></li>
        <li>${ic('cap')}<span>${t.months ? monthsText(t.months) : 'Гибкий график'}</span></li>
      </ul>
      <div class="tcard__bottom">
        <div><div class="price">${rub(t.price)}</div><div class="price-sub">${t.inst ? `${rub(t.price / t.inst)} × ${t.inst} мес` : 'без рассрочки'}</div></div>
        <div class="tcard__btns">${cmpBtn('tariffs', t.id, true)}<a class="btn btn-primary btn-sm" href="#/tariff/${t.id}">Подробнее</a></div>
      </div>
    </article>`;
  }

  /* ================= map ================= */
  let mapState = null;
  function destroyMap() { if (mapState) { mapState.map.remove(); mapState = null; } }
  function drawMap(el, schools, o, opts = {}) {
    if (!window.L) { el.innerHTML = '<div class="map__empty">Карта недоступна — проверьте подключение к интернету</div>'; return; }
    if (!mapState || mapState.el !== el) {
      destroyMap();
      const map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
      mapState = { el, map, layer: L.layerGroup().addTo(map) };
    }
    const { map, layer } = mapState;
    layer.clearLayers();
    const pts = [];
    schools.forEach(s => {
      const icon = L.divIcon({ className: 'pin', html: `<span>${opts.label ? s.name : 'от ' + Math.round(s.minPrice / 1000) + ' тыс.'}</span>`, iconSize: [0, 0] });
      L.marker([s.lat, s.lng], { icon }).addTo(layer)
        .bindPopup(`<b>${s.full}</b><br>${s.address}<br>★ ${s.rating} · от ${rub(s.minPrice)}<br><a href="#/school/${s.id}">Открыть карточку →</a>`);
      pts.push([s.lat, s.lng]);
    });
    if (o) {
      L.circleMarker([o.lat, o.lng], { radius: 8, color: '#fff', weight: 3, fillColor: '#ff6b2c', fillOpacity: 1 }).addTo(layer).bindTooltip(o.name, { direction: 'top' });
      if (+state.common.radius) L.circle([o.lat, o.lng], { radius: +state.common.radius * 1000, color: '#ff6b2c', weight: 1, fillOpacity: .05 }).addTo(layer);
      pts.push([o.lat, o.lng]);
    }
    setTimeout(() => {
      map.invalidateSize();
      if (pts.length > 1) map.fitBounds(pts, { padding: [48, 48], maxZoom: 14 });
      else if (pts.length) map.setView(pts[0], 14);
      else map.setView([55.75, 37.62], 10);
    }, 0);
  }

  /* ================= filtering ================= */
  function filterSchools() {
    const c = state.common, f = state.sf, o = origin(), q = f.q.trim().toLowerCase();
    const items = SCHOOLS.filter(s =>
      s.city === c.city &&
      (!c.district || s.district === c.district) &&
      (!o || !+c.radius || km(o, s) <= +c.radius) &&
      (!f.formats.length || f.formats.some(x => s.formats.includes(x))) &&
      s.tariffs.some(t => t.theory !== 'none' && (!f.priceMin || t.price >= +f.priceMin) && (!f.priceMax || t.price <= +f.priceMax)) &&
      (!f.installment || s.installment) &&
      (!q || (s.name + ' ' + s.address + ' ' + s.near).toLowerCase().includes(q))
    ).map(s => ({ s, d: o ? km(o, s) : null }));
    const by = {
      rating: (a, b) => b.s.rating - a.s.rating,
      price: (a, b) => a.s.minPrice - b.s.minPrice,
      pass: (a, b) => b.s.pass - a.s.pass,
      distance: (a, b) => (a.d ?? 0) - (b.d ?? 0),
    };
    return items.sort(by[f.sort] || by.rating);
  }

  const groupFits = (g, tt) => tt === 'weekend'
    ? g.days.some(d => d === 'sat' || d === 'sun')
    : g.time === tt && g.days.some(d => d !== 'sat' && d !== 'sun');
  const hoursFit = (h, b) => b === 'lt10' ? h < 10 : h > +b.slice(2);

  function filterTariffs() {
    const c = state.common, f = state.tf, o = origin(), q = f.q.trim().toLowerCase();
    const items = TARIFFS.filter(t => {
      const s = schoolById(t.schoolId);
      if (s.city !== c.city) return false;
      if (c.district && s.district !== c.district) return false;
      if (o && +c.radius && km(o, s) > +c.radius) return false;
      if (f.trans.length && !f.trans.includes(t.trans)) return false;
      if (f.formats.length && !f.formats.includes(t.theory)) return false;
      if (f.theoryTimes.length && !(hasClassTheory(t) && s.groups.some(g => f.theoryTimes.some(tt => groupFits(g, tt))))) return false;
      if (f.days.length && !f.days.some(d => t.days.includes(d))) return false;
      if (f.ptimes.length && !f.ptimes.some(x => t.times.includes(x))) return false;
      if (f.hours && !hoursFit(t.hours, f.hours)) return false;
      if (f.priceMin && t.price < +f.priceMin) return false;
      if (f.priceMax && t.price > +f.priceMax) return false;
      if (f.installment && !t.inst) return false;
      if (q && !(t.name + ' ' + s.name + ' ' + s.near).toLowerCase().includes(q)) return false;
      return true;
    });
    const by = {
      price: (a, b) => a.price - b.price,
      hours: (a, b) => b.hours - a.hours,
      rating: (a, b) => schoolById(b.schoolId).rating - schoolById(a.schoolId).rating,
      distance: (a, b) => o ? km(o, schoolById(a.schoolId)) - km(o, schoolById(b.schoolId)) : 0,
    };
    return items.sort(by[f.sort] || by.price);
  }

  /* ================= filter panels ================= */
  const checks = (key, opts, sel) => `<div class="checks">${opts.map(([v, l, hint]) => `<label class="check"><input type="checkbox" data-f="${key}" value="${v}" ${sel.includes(v) ? 'checked' : ''}><span class="check__box">${ic('check')}</span><span>${l}${hint ? `<small>${hint}</small>` : ''}</span></label>`).join('')}</div>`;
  const pills = (key, opts, sel) => `<div class="pills">${opts.map(([v, l]) => `<label class="pill"><input type="checkbox" data-f="${key}" value="${v}" ${sel.includes(v) ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>`;

  function commonFilters() {
    const c = state.common;
    const city = CITIES.find(x => x.name === c.city);
    return `
      <fieldset class="fgroup"><legend>Город и район</legend>
        <select data-f="city" aria-label="Город">${CITIES.map(x => `<option ${x.name === c.city ? 'selected' : ''}>${x.name}</option>`).join('')}</select>
        <select data-f="district" aria-label="Район"><option value="">Все районы</option>${city.districts.map(d => `<option ${d === c.district ? 'selected' : ''}>${d}</option>`).join('')}</select>
      </fieldset>
      <fieldset class="fgroup"><legend>Рядом с домом или учёбой</legend>
        <select data-f="place" aria-label="Точка отсчёта"><option value="">Не важно</option><option value="geo" ${c.place === 'geo' ? 'selected' : ''}>📍 Моё местоположение</option>${placeOptions(c.city, c.place)}</select>
        <select data-f="radius" aria-label="Расстояние" ${c.place ? '' : 'disabled'}>${[[0, 'Любое расстояние'], [2, 'до 2 км'], [5, 'до 5 км'], [10, 'до 10 км']].map(([v, l]) => `<option value="${v}" ${+c.radius === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
      </fieldset>`;
  }

  function priceFilter(f) {
    return `<fieldset class="fgroup"><legend>Стоимость обучения, ₽</legend>
      <div class="range"><input type="number" inputmode="numeric" min="0" step="1000" placeholder="от" data-f="priceMin" value="${esc(f.priceMin)}" aria-label="Цена от"><span>—</span><input type="number" inputmode="numeric" min="0" step="1000" placeholder="до" data-f="priceMax" value="${esc(f.priceMax)}" aria-label="Цена до"></div>
      <div class="presets">${[50000, 60000, 75000].map(v => `<button type="button" class="preset ${+f.priceMax === v ? 'is-on' : ''}" data-action="price-preset" data-v="${v}">до ${v / 1000} тыс.</button>`).join('')}</div>
    </fieldset>`;
  }

  const switchRow = (key, label, on) => `<label class="switch"><input type="checkbox" data-f="${key}" ${on ? 'checked' : ''}><span class="switch__ui"></span><span>${label}</span></label>`;

  function schoolFilters() {
    const f = state.sf;
    return `<div class="filters__head"><b>Фильтры</b><button class="link" data-action="reset-filters">Сбросить</button><button class="icon-btn only-mobile" data-action="filters-close" aria-label="Закрыть фильтры">${ic('x')}</button></div>
      ${commonFilters()}
      <fieldset class="fgroup"><legend>Категория прав</legend>
        <div class="seg">${['B', 'A', 'C'].map(k => `<label class="seg__i ${k !== 'B' ? 'is-disabled' : ''}"><input type="radio" name="cat" ${k === 'B' ? 'checked' : 'disabled'}><span>${k}</span></label>`).join('')}</div>
        <p class="fhint">Категории A и C — скоро</p>
      </fieldset>
      <fieldset class="fgroup"><legend>Формат теории</legend>${checks('formats', [['offline', 'Очно в классе'], ['online', 'Онлайн'], ['mixed', 'Смешанный', 'онлайн-лекции + практика в классе']], f.formats)}</fieldset>
      ${priceFilter(f)}
      <fieldset class="fgroup">${switchRow('installment', 'Доступна рассрочка', f.installment)}</fieldset>
      <div class="filters__apply only-mobile"><button class="btn btn-primary btn-block" data-action="filters-close">Показать результаты</button></div>`;
  }

  function tariffFilters() {
    const f = state.tf;
    const classSel = f.formats.some(x => x === 'offline' || x === 'mixed');
    return `<div class="filters__head"><b>Фильтры</b><button class="link" data-action="reset-filters">Сбросить</button><button class="icon-btn only-mobile" data-action="filters-close" aria-label="Закрыть фильтры">${ic('x')}</button></div>
      ${commonFilters()}
      <fieldset class="fgroup"><legend>Коробка передач</legend>${pills('trans', [['manual', 'Механика'], ['auto', 'Автомат']], f.trans)}</fieldset>
      <fieldset class="fgroup"><legend>Формат теории</legend>${checks('formats', [['offline', 'Очно в классе'], ['online', 'Онлайн'], ['mixed', 'Смешанный'], ['none', 'Без теории', 'только вождение']], f.formats)}</fieldset>
      ${classSel ? `<fieldset class="fgroup fgroup--sub"><legend>Время теоретических занятий</legend>${checks('theoryTimes', ['morning', 'day', 'evening', 'weekend'].map(k => [k, LBL.time[k], LBL.timeHint[k]]), f.theoryTimes)}</fieldset>`
        : `<p class="fhint fhint--box">${ic('clock')} Выберите очный или смешанный формат, чтобы отфильтровать по времени теории</p>`}
      <fieldset class="fgroup"><legend>Практика: дни недели</legend>${pills('days', DAYS, f.days)}</fieldset>
      <fieldset class="fgroup"><legend>Практика: время</legend>${checks('ptimes', ['morning', 'day', 'evening'].map(k => [k, LBL.time[k], LBL.timeHint[k]]), f.ptimes)}</fieldset>
      <fieldset class="fgroup"><legend>Часов вождения</legend>
        <div class="pills">${[['', 'Любое'], ...HOURS].map(([v, l]) => `<label class="pill"><input type="radio" name="hours" data-f="hours" value="${v}" ${f.hours === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
      </fieldset>
      ${priceFilter(f)}
      <fieldset class="fgroup">${switchRow('installment', 'Доступна рассрочка', f.installment)}</fieldset>
      <div class="filters__apply only-mobile"><button class="btn btn-primary btn-block" data-action="filters-close">Показать результаты</button></div>`;
  }

  /* ================= views ================= */
  let catalogKind = null;

  function viewHome() {
    document.title = 'Инго Автошколы — маркетплейс автошкол от Ингосстраха';
    const top = [...SCHOOLS].sort((a, b) => b.rating - a.rating).slice(0, 3);
    const h = schoolById('autopilot'), h2 = schoolById('start');
    return {
      html: `
      <section class="hero">
        <div class="container hero__in">
          <div class="hero__text">
            <span class="eyebrow">${ic('shieldCheck')} Маркетплейс автошкол от Ингосстраха</span>
            <h1>Продаём не сертификаты, <span class="hl">а качественное обучение</span></h1>
            <p class="lead">Сравните проверенные автошколы Москвы и области по цене, расписанию и проценту сдачи — и оплатите обучение онлайн за пару минут.</p>
            <form class="qs" data-form="quick">
              <label class="qs__f"><span>Город</span><select name="city" id="qsCity">${CITIES.map(x => `<option>${x.name}</option>`).join('')}</select></label>
              <label class="qs__f"><span>Рядом с</span><select name="place" id="qsPlace"><option value="">Не важно</option>${placeOptions('Москва', '')}</select></label>
              <label class="qs__f"><span>Бюджет</span><select name="budget"><option value="">Любой</option>${[50000, 60000, 75000, 100000].map(v => `<option value="${v}">до ${v.toLocaleString('ru-RU')} ₽</option>`).join('')}</select></label>
              <button class="btn btn-primary btn-lg qs__btn">${ic('search')} Подобрать</button>
            </form>
            <ul class="usp">
              <li>${ic('zap')}<span><b>Быстро выбери</b> своё обучение</span></li>
              <li>${ic('percent')}<span><b>Без наценки:</b> цены напрямую от автошкол</span></li>
              <li>${ic('shieldCheck')}<span><b>Только проверенные</b> школы с лицензией</span></li>
            </ul>
          </div>
          <div class="hero__visual" aria-hidden="true">
            <div class="hv-card hv-card--main">
              <div class="hv-card__head"><div class="media media--xs" style="--h:${h.hue}">${mediaInner(h)}</div><div><b>${h.full}</b><span>${h.near}</span></div>${stars(h.rating)}</div>
              <div class="hv-stats"><div><span>Сдают с 1-го раза</span><b>${h.pass}%</b></div><div><span>Цена</span><b>${rub(h.minPrice)}</b></div></div>
              <div class="hv-bar"><i style="width:${h.pass}%"></i></div>
              <div class="hv-card__foot">${chip('Онлайн-теория')}${chip('Рассрочка 6 мес', 'chip--green')}</div>
            </div>
            <div class="hv-card hv-card--cmp">
              <div class="hv-cmp__title">${ic('compare')} Сравнение</div>
              <div class="hv-cmp__row"><span></span><b>${h.name}</b><b>${h2.name}</b></div>
              <div class="hv-cmp__row"><span>Цена</span><em class="best">${Math.round(h.minPrice / 1000)}к</em><em>${Math.round(h2.minPrice / 1000)}к</em></div>
              <div class="hv-cmp__row"><span>Рейтинг</span><em class="best">${h.rating}</em><em>${h2.rating}</em></div>
              <div class="hv-cmp__row"><span>Автопарк</span><em>${h.fleet}</em><em class="best">${h2.fleet}</em></div>
            </div>
            <div class="hv-pill">${ic('check')} Оплата прошла · место в группе закреплено</div>
          </div>
        </div>
      </section>

      <section class="strip"><div class="container strip__in">
        <div><b>${SCHOOLS.length}</b><span>автошкол-партнёров</span></div>
        <div><b>${TARIFFS.length}</b><span>тарифов с прозрачными ценами</span></div>
        <div><b>0 ₽</b><span>наценки — цены от автошкол</span></div>
        <div><b>5 мин</b><span>чтобы выбрать и оплатить</span></div>
      </div></section>

      <section class="section"><div class="container">
        <div class="section__head"><h2>Как это работает</h2><p>От выбора до первого занятия — без звонков и походов по офисам.</p></div>
        <ol class="steps">
          <li><span class="steps__n">1</span><h3>Выберите</h3><p>Фильтры по району, формату теории, расписанию, цене и рассрочке.</p></li>
          <li><span class="steps__n">2</span><h3>Сравните</h3><p>Отметьте «Сравнить» — и все условия будут в одной таблице.</p></li>
          <li><span class="steps__n">3</span><h3>Оплатите онлайн</h3><p>Зарегистрируйтесь по почте и телефону, выберите группу и оплатите.</p></li>
          <li><span class="steps__n">4</span><h3>Учитесь и сдавайте</h3><p>Тренируйтесь на билетах ПДД и получите права с первого раза.</p></li>
        </ol>
      </div></section>

      <section class="section section--alt"><div class="container">
        <div class="section__head section__head--row"><div><h2>Лучшие автошколы по оценкам учеников</h2><p>Рейтинг строится по отзывам и проценту сдачи с первого раза.</p></div><a class="btn btn-ghost" href="#/schools">Все автошколы ${ic('arrow')}</a></div>
        <div class="grid grid--3">${top.map(schoolTile).join('')}</div>
      </div></section>

      <section class="section"><div class="container">
        <div class="section__head"><h2>Всё для будущего водителя</h2></div>
        <div class="grid grid--4 sections">
          <a class="sec-card" href="#/schools"><span class="sec-card__ic" style="--c:#1a5cff">${ic('search')}</span><h3>Найти автошколу</h3><p>Каталог с фильтрами, картой и сравнением.</p><span class="sec-card__go">${ic('arrow')}</span></a>
          <a class="sec-card" href="#/pdd"><span class="sec-card__ic" style="--c:#12a150">${ic('doc')}</span><h3>Билеты ПДД 2026</h3><p>Билеты, темы и экзамен как в ГИБДД.</p><span class="sec-card__go">${ic('arrow')}</span></a>
          <a class="sec-card" href="#/insurance"><span class="sec-card__ic" style="--c:#ff6b2c">${ic('shield')}</span><h3>Страхование</h3><p>Авто, жизнь и здоровье — полисы для новичков.</p><span class="sec-card__go">${ic('arrow')}</span></a>
          <a class="sec-card" href="#/materials"><span class="sec-card__ic" style="--c:#8b5cf6">${ic('book')}</span><h3>Полезные материалы</h3><p>Гайд по получению прав и короткие ридинги.</p><span class="sec-card__go">${ic('arrow')}</span></a>
        </div>
      </div></section>

      <section class="section section--navy"><div class="container quality">
        <div><span class="eyebrow eyebrow--light">${ic('trophy')} Наш принцип</span><h2>Продаём не сертификаты, а качественное обучение</h2><p>Мы не берём в каталог школы, которые «продают корочку». Каждую автошколу проверяем по четырём критериям — и показываем эти данные вам.</p><a class="btn btn-accent" href="#/schools">Выбрать автошколу</a></div>
        <ul class="quality__list">
          <li>${ic('doc')}<div><b>Лицензия</b><span>Действующая образовательная лицензия</span></div></li>
          <li>${ic('target')}<div><b>Процент сдачи</b><span>Сколько учеников сдают в ГИБДД с первого раза</span></div></li>
          <li>${ic('car')}<div><b>Автопарк</b><span>Количество и возраст учебных автомобилей</span></div></li>
          <li>${ic('star')}<div><b>Отзывы</b><span>Только от учеников, оплативших обучение</span></div></li>
        </ul>
      </div></section>

      <section class="section"><div class="container">
        <a class="promo" href="#/insurance">
          <div><span class="eyebrow">${ic('shield')} Страхование</span><h2>Узнай, как страхование спасёт твои деньги за 5 минут</h2><p>Интерактивный разбор: сколько стоит ошибка на дороге без полиса и с ним.</p></div>
          <span class="btn btn-primary">Попробовать ${ic('arrow')}</span>
        </a>
      </div></section>

      <section class="section section--alt"><div class="container faq-teaser">
        <div class="section__head"><h2>Частые вопросы</h2><p>Не нашли ответ? <button class="linkish" data-action="chat-open">Напишите в чат</button> — ответим за пару минут.</p><a class="btn btn-ghost" href="#/faq">Все вопросы ${ic('arrow')}</a></div>
        <div class="faq">${C.FAQ.flatMap(g => g.items).slice(0, 5).map(faqItem).join('')}</div>
      </div></section>`,
      mount() {
        $('#qsCity').addEventListener('change', e => { $('#qsPlace').innerHTML = `<option value="">Не важно</option>${placeOptions(e.target.value, '')}`; });
      },
    };
  }

  const faqItem = ([q, a]) => `<details class="faq__i"><summary>${q}<span class="faq__pm"></span></summary><p>${a}</p></details>`;

  function catalogView(kind) {
    const isS = kind === 'schools';
    const F = isS ? state.sf : state.tf;
    catalogKind = kind;
    document.title = (isS ? 'Найти автошколу' : 'Тарифы автошкол') + ' — Инго Автошколы';
    const sorts = isS
      ? [['rating', 'По рейтингу'], ['price', 'Сначала дешевле'], ['pass', 'По проценту сдачи'], ['distance', 'Ближе ко мне']]
      : [['price', 'Сначала дешевле'], ['rating', 'По рейтингу школы'], ['hours', 'Больше часов вождения'], ['distance', 'Ближе ко мне']];
    return {
      html: `
      <section class="page-head"><div class="container">
        ${crumbs([['Главная', '#/'], [isS ? 'Автошколы' : 'Тарифы']])}
        <div class="page-head__row">
          <div><h1>Найти автошколу</h1><p class="lead">Цены напрямую от автошкол, без наценки. Отметьте «Сравнить» у нескольких вариантов, чтобы увидеть условия в одной таблице.</p></div>
        </div>
        <div class="tabs" role="tablist">
          <a href="#/schools" class="tab ${isS ? 'is-active' : ''}" role="tab" aria-selected="${isS}">${ic('cap')} Автошколы <span>${SCHOOLS.length}</span></a>
          <a href="#/tariffs" class="tab ${!isS ? 'is-active' : ''}" role="tab" aria-selected="${!isS}">${ic('wallet')} Тарифы <span>${TARIFFS.length}</span></a>
        </div>
      </div></section>
      <div class="container catalog" id="catalog">
        <aside class="filters" id="filters" aria-label="Фильтры"></aside>
        <div class="catalog__main">
          <div class="toolbar">
            <button class="btn btn-ghost btn-sm only-mobile" data-action="filters-open">${ic('filter')} Фильтры <b class="count" id="fCount" hidden></b></button>
            <div class="toolbar__count" id="count"></div>
            <label class="search">${ic('search')}<input type="search" placeholder="${isS ? 'Название, адрес или метро' : 'Тариф, школа или метро'}" data-f="q" value="${esc(F.q)}" aria-label="Поиск"></label>
            <select data-f="sort" aria-label="Сортировка">${sorts.map(([v, l]) => `<option value="${v}" ${F.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
            ${isS ? `<div class="seg seg--sm" role="group" aria-label="Вид"><button class="seg__b ${F.view === 'list' ? 'is-on' : ''}" data-action="view" data-v="list">${ic('list')}<span>Список</span></button><button class="seg__b ${F.view === 'map' ? 'is-on' : ''}" data-action="view" data-v="map">${ic('map')}<span>Карта</span></button></div>` : ''}
          </div>
          <div id="activeF" class="active-f"></div>
          ${isS ? '<div id="map" class="map" hidden></div>' : ''}
          <div id="results" class="${isS ? 'results' : 'grid grid--2 results'}"></div>
        </div>
      </div>`,
      mount() { mountCatalog(kind); },
    };
  }

  function mountCatalog(kind) {
    const root = $('#catalog');
    root.addEventListener('input', e => {
      const el = e.target, key = el.dataset.f;
      if (!key) return;
      const F = kind === 'schools' ? state.sf : state.tf; // объект меняется при сбросе — берём актуальный
      const target = COMMON.includes(key) ? state.common : F;
      if (el.type === 'checkbox' && Array.isArray(target[key])) {
        const set = new Set(target[key]);
        el.checked ? set.add(el.value) : set.delete(el.value);
        target[key] = [...set];
      } else if (el.type === 'checkbox') target[key] = el.checked;
      else target[key] = el.value;

      if (key === 'city') Object.assign(state.common, { district: '', place: '', radius: 0 });
      if (key === 'place') {
        state.common.radius = el.value ? (+state.common.radius || 5) : 0;
        if (el.value && (F.sort === 'rating' || F.sort === 'price')) F.sort = 'distance';
        if (!el.value && F.sort === 'distance') F.sort = kind === 'schools' ? 'rating' : 'price';
        if (el.value === 'geo' && !state.geo) { locate(() => refreshCatalog(true)); return; }
      }
      if (key === 'formats' && kind === 'tariffs' && !F.formats.some(x => x === 'offline' || x === 'mixed')) F.theoryTimes = [];
      refreshCatalog(['city', 'place', 'formats', 'radius'].includes(key));
    });
    refreshCatalog(true);
  }

  function refreshCatalog(sidebar) {
    const kind = catalogKind;
    if (!$('#catalog')) return;
    const F = kind === 'schools' ? state.sf : state.tf;
    if (sidebar) {
      $('#filters').innerHTML = kind === 'schools' ? schoolFilters() : tariffFilters();
      const sortSel = $('[data-f="sort"]');
      if (sortSel) sortSel.value = F.sort;
    }
    $$('.preset').forEach(b => b.classList.toggle('is-on', +F.priceMax === +b.dataset.v));
    renderActiveFilters(kind);
    const res = $('#results');
    if (kind === 'schools') {
      const items = filterSchools();
      $('#count').innerHTML = `Найдено <b>${items.length}</b> ${plural(items.length, 'автошкола', 'автошколы', 'автошкол')}`;
      res.innerHTML = items.length ? items.map(({ s, d }) => schoolRow(s, d)).join('') : emptyState('Ничего не нашлось', 'Попробуйте увеличить расстояние, выбрать другой район или сбросить фильтры.', '<button class="btn btn-primary" data-action="reset-filters">Сбросить фильтры</button>');
      const mapEl = $('#map');
      mapEl.hidden = state.sf.view !== 'map';
      if (state.sf.view === 'map') drawMap(mapEl, items.map(x => x.s), origin());
    } else {
      const items = filterTariffs();
      $('#count').innerHTML = `Найдено <b>${items.length}</b> ${plural(items.length, 'тариф', 'тарифа', 'тарифов')}`;
      res.innerHTML = items.length ? items.map(t => tariffCard(t)).join('') : emptyState('Подходящих тарифов нет', 'Ослабьте условия по расписанию или количеству часов — или сбросьте фильтры.', '<button class="btn btn-primary" data-action="reset-filters">Сбросить фильтры</button>');
    }
  }

  function renderActiveFilters(kind) {
    const c = state.common, F = kind === 'schools' ? state.sf : state.tf, tags = [];
    if (c.district) tags.push(['district', '', c.district]);
    const o = origin();
    if (o) tags.push(['place', '', `${o.name}${+c.radius ? ', до ' + c.radius + ' км' : ''}`]);
    F.formats.forEach(v => tags.push(['formats', v, LBL.theory[v]]));
    if (F.trans) F.trans.forEach(v => tags.push(['trans', v, LBL.transShort[v]]));
    if (F.theoryTimes) F.theoryTimes.forEach(v => tags.push(['theoryTimes', v, 'Теория: ' + LBL.time[v].toLowerCase()]));
    if (F.days) F.days.forEach(v => tags.push(['days', v, 'Вождение: ' + dayLabel[v]]));
    if (F.ptimes) F.ptimes.forEach(v => tags.push(['ptimes', v, 'Вождение: ' + LBL.time[v].toLowerCase()]));
    if (F.hours) tags.push(['hours', '', HOURS.find(h => h[0] === F.hours)[1]]);
    if (F.priceMin) tags.push(['priceMin', '', 'от ' + rub(F.priceMin)]);
    if (F.priceMax) tags.push(['priceMax', '', 'до ' + rub(F.priceMax)]);
    if (F.installment) tags.push(['installment', '', 'Рассрочка']);
    $('#activeF').innerHTML = tags.map(([k, v, l]) => `<button class="ftag" data-action="unset-f" data-k="${k}" data-v="${v}">${l}${ic('x')}</button>`).join('');
    const fc = $('#fCount');
    if (fc) { fc.textContent = tags.length; fc.hidden = !tags.length; }
  }

  function locate(cb) {
    const fail = msg => { toast(msg, 'is-warn'); Object.assign(state.common, { place: '', radius: 0 }); cb(); };
    if (!navigator.geolocation) return fail('Геолокация недоступна в этом браузере — выберите станцию или вуз');
    toast('Определяем ваше местоположение…');
    navigator.geolocation.getCurrentPosition(
      p => { state.geo = { lat: p.coords.latitude, lng: p.coords.longitude, name: 'Вы здесь' }; cb(); },
      () => fail('Не удалось определить местоположение — выберите станцию метро или вуз'),
      { timeout: 8000 }
    );
  }

  /* ---------- school page ---------- */
  function viewSchool(id) {
    const s = schoolById(id);
    if (!s) return notFound();
    document.title = `${s.full} — Инго Автошколы`;
    const o = origin();
    const d = o ? km(o, s) : null;
    const ratingAvg = s.reviewsList.reduce((a, r) => a + r.r, 0) / s.reviewsList.length;
    return {
      html: `
      <section class="page-head page-head--school"><div class="container">
        ${crumbs([['Главная', '#/'], ['Автошколы', '#/schools'], [s.full]])}
        <div class="school-head">
          <div class="media media--lg" style="--h:${s.hue}">${mediaInner(s)}</div>
          <div class="school-head__info">
            <h1>${s.full}</h1>
            <div class="school-head__meta">${ratingHTML(s)}<span>${ic('pin')} ${s.city}, ${s.address} · ${s.near}</span>${d != null ? `<span>${ic('target')} ${fmtKm(d)} от «${esc(o.name)}»</span>` : ''}</div>
            <div class="chips">${s.features.map(f => chip(f)).join('')}</div>
          </div>
          <div class="school-head__cta">
            <div class="price"><small>от</small> ${rub(s.minPrice)}</div>
            <div class="price-sub">${s.minMonthly ? `или от ${rub(s.minMonthly)}/мес` : 'оплата сразу'}</div>
            <button class="btn btn-primary btn-block" data-action="scroll" data-to="#tariffs">Выбрать тариф</button>
            ${cmpBtn('schools', s.id)}
          </div>
        </div>
        <nav class="subnav">${[['about', 'О школе'], ['tariffs', 'Тарифы'], ['groups', 'Группы теории'], ['reviews', 'Отзывы'], ['where', 'На карте']].map(([a, l]) => `<button data-action="scroll" data-to="#${a}">${l}</button>`).join('')}</nav>
      </div></section>
      <div class="container page-body">
        <section id="about" class="block">
          <div class="kpis">
            <div class="kpi"><span>Сдают с 1-го раза</span><b>${s.pass}%</b><i class="kpi__bar"><i style="width:${s.pass}%"></i></i></div>
            <div class="kpi"><span>Автопарк</span><b>${s.fleet}</b><small>учебных автомобилей</small></div>
            <div class="kpi"><span>Инструкторы</span><b>${s.instructors}</b><small>в штате</small></div>
            <div class="kpi"><span>Опыт</span><b>${2026 - s.founded} ${plural(2026 - s.founded, 'год', 'года', 'лет')}</b><small>с ${s.founded} года</small></div>
          </div>
          <div class="about">
            <div><h2>О школе</h2><p>${s.about}</p></div>
            <dl class="deflist">
              <div><dt>Категория</dt><dd>B</dd></div>
              <div><dt>Автомобили</dt><dd>${s.cars}</dd></div>
              <div><dt>Формат теории</dt><dd>${s.formats.map(f => LBL.theory[f]).join(', ')}</dd></div>
              <div><dt>Рассрочка</dt><dd>${s.installment ? 'до ' + s.maxInst + ' мес' : 'нет'}</dd></div>
              <div><dt>Лицензия</dt><dd class="ok">${ic('check')} Проверена Инго Автошколами</dd></div>
            </dl>
          </div>
        </section>

        <section id="tariffs" class="block">
          <div class="block__head"><h2>Тарифы <span class="muted">${s.tariffs.length}</span></h2>
            <div class="seg seg--sm" id="transTabs">${[['all', 'Все'], ['manual', 'МКПП'], ['auto', 'АКПП']].map(([v, l], i) => `<button class="seg__b ${i === 0 ? 'is-on' : ''}" data-action="trans-tab" data-v="${v}">${l}</button>`).join('')}</div>
          </div>
          <div class="grid grid--3" id="schoolTariffs">${s.tariffs.map(t => tariffCard(t, { school: false })).join('')}</div>
          <p class="note">${ic('percent')} Цены напрямую от автошколы — без наценки маркетплейса.</p>
        </section>

        <section id="groups" class="block">
          <h2>Группы теории</h2>
          ${s.groups.length ? groupsTable(s) : `<div class="info">${ic('zap')}<div><b>Теория полностью онлайн</b><p>Группы не нужны: доступ к урокам откроется сразу после оплаты, заниматься можно в удобное время.</p></div></div>`}
        </section>

        <section id="reviews" class="block">
          <div class="block__head"><h2>Отзывы учеников</h2>${ratingHTML(s)}</div>
          <div class="grid grid--2">${s.reviewsList.map(r => `<article class="review"><div class="review__head"><span class="review__ava" style="--h:${(r.n.charCodeAt(0) * 7) % 360}">${r.n[0]}</span><div><b>${r.n}</b><span>${fmtDate(r.d, { day: 'numeric', month: 'long', year: 'numeric' })}</span></div><span class="review__stars">${'★'.repeat(r.r)}<i>${'★'.repeat(5 - r.r)}</i></span></div><p>${r.t}</p><span class="review__tag">${ic('check')} Проходил(а) обучение</span></article>`).join('')}</div>
          <p class="muted small">Средняя оценка в последних отзывах: ${ratingAvg.toFixed(1)}</p>
        </section>

        <section id="where" class="block">
          <h2>Как добраться</h2>
          <p class="muted">${ic('pin')} ${s.city}, ${s.address} · ${s.near}</p>
          <div id="schoolMap" class="map map--sm"></div>
        </section>
      </div>`,
      mount() { drawMap($('#schoolMap'), [s], origin(), { label: true }); },
    };
  }

  function groupsTable(s, selectable = false, selected = '') {
    return `<div class="groups">${s.groups.map(g => {
      const low = g.seats > 0 && g.seats <= 3;
      const inner = `<div class="group__main"><b>${g.name}</b><span>${g.days.map(d => dayLabel[d]).join(', ')} · ${g.hours}</span></div>
        <div class="group__start">${ic('calendar')} Старт ${fmtDate(g.start)}</div>
        <div class="group__seats ${low ? 'is-low' : ''} ${g.seats === 0 ? 'is-full' : ''}">${g.seats === 0 ? 'Мест нет' : `${g.seats} ${plural(g.seats, 'место', 'места', 'мест')}`}</div>`;
      return selectable
        ? `<label class="group group--sel ${g.seats === 0 ? 'is-disabled' : ''}"><input type="radio" name="group" value="${g.id}" required ${g.seats === 0 ? 'disabled' : ''} ${g.id === selected ? 'checked' : ''}><span class="radio"></span>${inner}</label>`
        : `<div class="group">${inner}</div>`;
    }).join('')}</div>`;
  }

  /* ---------- tariff page ---------- */
  function viewTariff(id) {
    const t = tariffById(id);
    if (!t) return notFound();
    const s = schoolById(t.schoolId);
    document.title = `${t.name} — ${s.full}`;
    const others = s.tariffs.filter(x => x.id !== t.id);
    return `
      <section class="page-head"><div class="container">
        ${crumbs([['Главная', '#/'], ['Тарифы', '#/tariffs'], [s.full, '#/school/' + s.id], [t.name]])}
      </div></section>
      <div class="container page-body tariff">
        <div class="tariff__main">
          <div class="tariff__title">
            <div class="chips">${t.badge ? `<span class="badge">${t.badge}</span>` : ''}${chip('Категория B')}${chip(LBL.transShort[t.trans], 'chip--blue')}</div>
            <h1>${t.name}</h1>
            <a class="tariff__school" href="#/school/${s.id}"><span class="media media--xs" style="--h:${s.hue}">${mediaInner(s)}</span>${s.full} ${ratingHTML(s)}</a>
          </div>

          <div class="params">
            <div class="param">${ic('car')}<span>Коробка передач</span><b>${LBL.trans[t.trans]}</b></div>
            <div class="param">${ic('book')}<span>Теория</span><b>${LBL.theory[t.theory]}</b></div>
            <div class="param">${ic('wheel')}<span>Практика</span><b>${t.hours} ${plural(t.hours, 'час', 'часа', 'часов')}</b></div>
            <div class="param">${ic('cap')}<span>Срок обучения</span><b>${t.months ? monthsText(t.months) : 'Гибкий'}</b></div>
            <div class="param">${ic('target')}<span>Сдают с 1-го раза</span><b>${s.pass}%</b></div>
            <div class="param">${ic('wallet')}<span>Рассрочка</span><b>${t.inst ? `до ${t.inst} мес` : 'Нет'}</b></div>
          </div>

          <section class="block">
            <h2>Расписание вождения</h2>
            <div class="week">${DAYS.map(([k, l]) => `<span class="week__d ${t.days.includes(k) ? 'is-on' : ''}">${l}</span>`).join('')}</div>
            <div class="slots">${['morning', 'day', 'evening'].map(k => `<div class="slot ${t.times.includes(k) ? 'is-on' : ''}">${ic('clock')}<b>${LBL.time[k]}</b><span>${LBL.timeHint[k]}</span></div>`).join('')}</div>
            <p class="muted small">Время занятий выбираете сами в личном кабинете автошколы из свободных слотов.</p>
          </section>

          <section class="block">
            <h2>Теория</h2>
            ${hasClassTheory(t) && s.groups.length ? `<p class="muted">${t.theory === 'mixed' ? 'Лекции — онлайн, разборы и пробные экзамены — в классе. ' : ''}Группу выберете при оформлении:</p>${groupsTable(s)}`
              : t.theory === 'online' ? `<div class="info">${ic('zap')}<div><b>Онлайн-платформа автошколы</b><p>Видеоуроки, конспекты и тесты доступны 24/7. Начать можно сразу после оплаты — без привязки к группе.</p></div></div>`
              : `<div class="info">${ic('wheel')}<div><b>Тариф без теории</b><p>Только практика с инструктором. Подходит, если вы уже прошли теорию или хотите подтянуть навыки перед экзаменом.</p></div></div>`}
          </section>

          <section class="block">
            <h2>Что входит в стоимость</h2>
            <ul class="checklist">${includesOf(t).map(x => `<li>${ic('check')}${x}</li>`).join('')}</ul>
          </section>

          ${others.length ? `<section class="block"><h2>Другие тарифы школы</h2><div class="grid grid--2">${others.map(x => tariffCard(x, { school: false })).join('')}</div></section>` : ''}
        </div>

        <aside class="tariff__aside">
          <div class="buy">
            <div class="buy__price">${rub(t.price)}</div>
            ${t.inst ? `<div class="buy__inst">или <b>${rub(t.price / t.inst)}</b> × ${t.inst} мес в рассрочку</div>` : '<div class="buy__inst">Оплата одним платежом</div>'}
            <a class="btn btn-primary btn-lg btn-block" href="#/checkout/${t.id}">Выбрать и оплатить</a>
            ${cmpBtn('tariffs', t.id)}
            <ul class="buy__list">
              <li>${ic('percent')} Цена напрямую от автошколы — без наценки</li>
              <li>${ic('doc')} Договор с автошколой и чек — на e-mail</li>
              <li>${ic('lock')} Безопасная онлайн-оплата</li>
            </ul>
          </div>
        </aside>
      </div>`;
  }

  /* ---------- compare ---------- */
  function viewCompare(q) {
    document.title = 'Сравнение — Инго Автошколы';
    const cmp = state.compare;
    const tab = q.tab === 'tariffs' || q.tab === 'schools' ? q.tab : (cmp.schools.length || !cmp.tariffs.length ? 'schools' : 'tariffs');
    const isS = tab === 'schools';
    const items = isS ? cmp.schools.map(schoolById).filter(Boolean) : cmp.tariffs.map(tariffById).filter(Boolean);
    const o = origin();

    const rowsS = [
      { l: 'Рейтинг', v: s => s.rating, show: s => `★ ${s.rating.toFixed(1)} <small>(${s.reviews})</small>`, best: 'max' },
      { l: 'Цена обучения', v: s => s.minPrice, show: s => 'от ' + rub(s.minPrice), best: 'min' },
      { l: 'Платёж в рассрочку', v: s => s.minMonthly ?? Infinity, show: s => s.minMonthly ? 'от ' + rub(s.minMonthly) + '/мес' : '—', best: 'min' },
      { l: 'Рассрочка', v: s => s.maxInst, show: s => s.maxInst ? `до ${s.maxInst} мес` : 'нет', best: 'max' },
      { l: 'Сдают с 1-го раза', v: s => s.pass, show: s => s.pass + '%', best: 'max' },
      ...(o ? [{ l: 'Расстояние', v: s => km(o, s), show: s => fmtKm(km(o, s)) + ` <small>от «${esc(o.name)}»</small>`, best: 'min' }] : []),
      { l: 'Город, район', show: s => `${s.city}, ${s.district}` },
      { l: 'Адрес', show: s => `${s.address}<br><small>${s.near}</small>` },
      { l: 'Формат теории', show: s => s.formats.map(f => LBL.theory[f]).join('<br>') },
      { l: 'Коробка передач', show: s => s.trans.map(t => LBL.transShort[t]).join(', ') },
      { l: 'Ближайшая группа', v: s => { const g = nearestGroup(s); return g ? +new Date(g.start) : Infinity; }, show: s => { const g = nearestGroup(s); return g ? `${fmtDate(g.start)}<br><small>${g.name.toLowerCase()}</small>` : 'онлайн — в любой день'; }, best: 'min' },
      { l: 'Время групп', show: s => s.groups.length ? [...new Set(s.groups.map(g => g.days.some(d => d === 'sat' || d === 'sun') ? 'выходные' : LBL.time[g.time].toLowerCase()))].join(', ') : '—' },
      { l: 'Автопарк', v: s => s.fleet, show: s => `${s.fleet} авто<br><small>${s.cars}</small>`, best: 'max' },
      { l: 'Инструкторы', v: s => s.instructors, show: s => s.instructors, best: 'max' },
      { l: 'Опыт', v: s => 2026 - s.founded, show: s => `с ${s.founded} года`, best: 'max' },
      { l: 'Тарифов', v: s => s.tariffs.length, show: s => s.tariffs.length },
      { l: 'Особенности', show: s => s.features.join('<br>') },
    ];
    const rowsT = [
      { l: 'Автошкола', show: t => { const s = schoolById(t.schoolId); return `<a href="#/school/${s.id}">${s.full}</a><br><small>${s.near}</small>`; } },
      { l: 'Стоимость', v: t => t.price, show: t => rub(t.price), best: 'min' },
      { l: 'Рассрочка', v: t => t.inst, show: t => t.inst ? `${rub(t.price / t.inst)} × ${t.inst} мес` : 'нет', best: 'max' },
      { l: 'Коробка передач', show: t => LBL.trans[t.trans] },
      { l: 'Теория', show: t => LBL.theory[t.theory] },
      { l: 'Часов вождения', v: t => t.hours, show: t => t.hours + ' ч', best: 'max' },
      { l: 'Дни вождения', show: t => daysText(t.days) },
      { l: 'Время вождения', show: t => t.times.map(x => LBL.time[x]).join(', ') },
      { l: 'Срок обучения', show: t => t.months ? monthsText(t.months) : 'гибкий' },
      { l: 'Группы теории', show: t => { const s = schoolById(t.schoolId); return hasClassTheory(t) && s.groups.length ? s.groups.map(g => `${g.days.map(d => dayLabel[d]).join(', ')} ${g.hours}`).join('<br>') : '—'; } },
      { l: 'Рейтинг школы', v: t => schoolById(t.schoolId).rating, show: t => '★ ' + schoolById(t.schoolId).rating.toFixed(1), best: 'max' },
      { l: 'Сдают с 1-го раза', v: t => schoolById(t.schoolId).pass, show: t => schoolById(t.schoolId).pass + '%', best: 'max' },
      ...(o ? [{ l: 'Расстояние', v: t => km(o, schoolById(t.schoolId)), show: t => fmtKm(km(o, schoolById(t.schoolId))), best: 'min' }] : []),
      { l: 'Что входит', show: t => includesOf(t).join('<br>') },
    ];
    const rows = isS ? rowsS : rowsT;

    const head = isS
      ? s => `<div class="cmp-h"><button class="icon-btn cmp-h__rm" data-action="cmp-remove" data-kind="schools" data-id="${s.id}" aria-label="Убрать">${ic('x')}</button><div class="media media--sm" style="--h:${s.hue}">${mediaInner(s)}</div><a href="#/school/${s.id}">${s.full}</a><a class="btn btn-primary btn-sm" href="#/school/${s.id}">Тарифы</a></div>`
      : t => `<div class="cmp-h"><button class="icon-btn cmp-h__rm" data-action="cmp-remove" data-kind="tariffs" data-id="${t.id}" aria-label="Убрать">${ic('x')}</button><span class="chip chip--blue">${LBL.transShort[t.trans]}</span><a href="#/tariff/${t.id}">${t.name}</a><small class="muted">${schoolById(t.schoolId).full}</small><a class="btn btn-primary btn-sm" href="#/checkout/${t.id}">Выбрать</a></div>`;

    const body = rows.map(r => {
      const cells = items.map(it => r.show(it));
      const same = items.length > 1 && cells.every(c => c === cells[0]);
      let bestV = null;
      if (r.best && items.length > 1) {
        const vals = items.map(r.v).filter(v => isFinite(v));
        const b = r.best === 'max' ? Math.max(...vals) : Math.min(...vals);
        if (!vals.every(v => v === b)) bestV = b;
      }
      return `<tr class="${same ? 'is-same' : ''}"><th scope="row">${r.l}</th>${items.map((it, i) => `<td class="${bestV !== null && r.v(it) === bestV ? 'is-best' : ''}">${cells[i]}</td>`).join('')}</tr>`;
    }).join('');

    return `
      <section class="page-head"><div class="container">
        ${crumbs([['Главная', '#/'], ['Сравнение']])}
        <h1>Сравнение</h1>
        <div class="tabs">
          <a href="#/compare?tab=schools" class="tab ${isS ? 'is-active' : ''}">${ic('cap')} Автошколы <span>${cmp.schools.length}</span></a>
          <a href="#/compare?tab=tariffs" class="tab ${!isS ? 'is-active' : ''}">${ic('wallet')} Тарифы <span>${cmp.tariffs.length}</span></a>
        </div>
      </div></section>
      <div class="container page-body">
        ${items.length ? `
          <div class="cmp-tools">
            ${switchRow('cmpDiff', 'Показывать только различия', state.cmpDiff).replace('data-f="cmpDiff"', 'data-action="cmp-diff"')}
            <span class="legend"><i></i> лучшее значение</span>
            <button class="btn btn-ghost btn-sm" data-action="cmp-clear" data-kind="${tab}">${ic('trash')} Очистить</button>
            <a class="btn btn-ghost btn-sm" href="#/${tab}">${ic('plus')} Добавить ещё</a>
          </div>
          <div class="cmp-wrap ${state.cmpDiff ? 'diff-only' : ''}" id="cmpWrap"><table class="cmp" style="--n:${items.length}"><thead><tr><th></th>${items.map(it => `<th scope="col">${head(it)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>
          ${items.length === 1 ? `<p class="note">${ic('compare')} Добавьте ещё хотя бы один вариант, чтобы сравнение стало нагляднее.</p>` : ''}`
        : emptyState(isS ? 'Вы пока не выбрали автошколы' : 'Вы пока не выбрали тарифы', 'Нажмите «Сравнить» на карточках в каталоге — до 4 вариантов.', `<a class="btn btn-primary" href="#/${tab}">Перейти в каталог</a>`)}
      </div>`;
  }

  /* ---------- auth ---------- */
  let authDraft = null;
  function viewAuth(q) {
    document.title = 'Вход и регистрация — Инго Автошколы';
    const next = q.next || '/account';
    const t = next.startsWith('/checkout/') ? tariffById(next.split('/')[2]) : null;
    if (state.user) {
      return `<div class="container narrow page-body"><div class="card center"><div class="ok-ic">${ic('check')}</div><h1>Вы уже вошли</h1><p>${esc(state.user.name)} · ${esc(state.user.email)}</p><a class="btn btn-primary" href="#${esc(next)}">Продолжить</a></div></div>`;
    }
    const side = `<div class="auth__side">
      <h2>Зачем регистрироваться?</h2>
      <ul class="checklist">
        <li>${ic('check')} Закрепим за вами место в группе</li>
        <li>${ic('check')} Договор и чек придут на почту</li>
        <li>${ic('check')} Автошкола свяжется по телефону</li>
        <li>${ic('check')} Заказы и прогресс по билетам — в личном кабинете</li>
      </ul>
      ${t ? `<div class="auth__order"><span>Вы оформляете</span><b>${t.name}</b><small>${schoolById(t.schoolId).full} · ${rub(t.price)}</small></div>` : ''}
    </div>`;
    if (authDraft) {
      return `<div class="container page-body auth">
        <div class="card auth__card">
          ${crumbs([['Главная', '#/'], ['Регистрация']])}
          <h1>Подтвердите телефон</h1>
          <p class="muted">Мы отправили SMS с кодом на номер <b>${esc(authDraft.phone)}</b>.</p>
          <form data-form="auth-code" class="form" novalidate>
            <input type="hidden" name="next" value="${esc(next)}">
            <label class="field"><span>Код из SMS</span><input name="code" class="code-input" inputmode="numeric" maxlength="4" autocomplete="one-time-code" placeholder="••••" required autofocus></label>
            <p class="demo-hint">${ic('zap')} Демо-режим: код — <b>${authDraft.code}</b></p>
            <button class="btn btn-primary btn-lg btn-block">Подтвердить</button>
            <div class="form__row"><button type="button" class="link" data-action="auth-back">${ic('arrowL')} Изменить данные</button><button type="button" class="link" data-action="auth-resend">Отправить код ещё раз</button></div>
          </form>
        </div>
        ${side}
      </div>`;
    }
    return `<div class="container page-body auth">
      <div class="card auth__card">
        ${crumbs([['Главная', '#/'], ['Регистрация']])}
        <h1>Вход и регистрация</h1>
        <p class="muted">Чтобы оплатить тариф и выбрать группу, укажите почту и телефон.</p>
        <form data-form="auth" class="form" novalidate>
          <input type="hidden" name="next" value="${esc(next)}">
          <label class="field"><span>Имя и фамилия</span><input name="name" autocomplete="name" placeholder="Анна Иванова" required></label>
          <label class="field"><span>Электронная почта</span><div class="field__ic">${ic('mail')}<input name="email" type="email" autocomplete="email" placeholder="anna@example.ru" required></div></label>
          <label class="field"><span>Телефон</span><div class="field__ic">${ic('phone')}<input name="phone" type="tel" autocomplete="tel" data-mask="phone" placeholder="+7 (900) 000-00-00" required></div></label>
          <label class="check check--top"><input type="checkbox" name="agree" required><span class="check__box">${ic('check')}</span><span>Согласен(на) с условиями обработки персональных данных и получением SMS</span></label>
          <button class="btn btn-primary btn-lg btn-block">Получить код</button>
        </form>
      </div>
      ${side}
    </div>`;
  }

  /* ---------- checkout ---------- */
  function viewCheckout(id) {
    const t = tariffById(id);
    if (!t) return notFound();
    if (!state.user) { location.replace(`#/auth?next=/checkout/${id}`); return ''; }
    const s = schoolById(t.schoolId);
    document.title = 'Оформление — Инго Автошколы';
    const needGroup = hasClassTheory(t) && s.groups.length > 0;
    const firstFree = needGroup ? (nearestGroup(s) || {}).id : '';
    return {
      html: `
      <section class="page-head"><div class="container">
        ${crumbs([['Главная', '#/'], [s.full, '#/school/' + s.id], [t.name, '#/tariff/' + t.id], ['Оформление']])}
        <h1>Оформление обучения</h1>
        <ol class="progress-steps"><li class="is-done">${ic('check')} Регистрация</li><li class="is-cur">Группа и оплата</li><li>Оплата</li></ol>
      </div></section>
      <form class="container page-body checkout" data-form="checkout" novalidate>
        <input type="hidden" name="tariff" value="${t.id}">
        <div class="checkout__main">
          <section class="card">
            <h2><span class="num">1</span> ${needGroup ? 'Выберите группу теории' : 'Теория'}</h2>
            ${needGroup ? `<p class="muted">Дни и время занятий в классе. Вождение вы запишете отдельно в удобные слоты.</p>${groupsTable(s, true, firstFree)}`
              : t.theory === 'online' ? `<div class="info">${ic('zap')}<div><b>Теория онлайн</b><p>Группа не нужна — доступ к урокам откроется сразу после оплаты.</p></div></div>`
              : `<div class="info">${ic('wheel')}<div><b>Только вождение</b><p>В тарифе нет теории. Инструктор свяжется с вами, чтобы согласовать первое занятие.</p></div></div>`}
          </section>
          <section class="card">
            <h2><span class="num">2</span> Контактные данные</h2>
            <div class="contact"><div>${ic('user')}<b>${esc(state.user.name)}</b></div><div>${ic('mail')}${esc(state.user.email)}</div><div>${ic('phone')}${esc(state.user.phone)}</div></div>
            <p class="muted small">На почту придут договор с автошколой и чек. Менеджер школы позвонит, чтобы познакомиться.</p>
          </section>
          <section class="card">
            <h2><span class="num">3</span> Способ оплаты</h2>
            <div class="paymethods">
              <label class="pm"><input type="radio" name="pay" value="card" checked><span class="radio"></span>${ic('card')}<div><b>Банковская карта</b><span>Visa, Mastercard, МИР</span></div></label>
              <label class="pm"><input type="radio" name="pay" value="sbp"><span class="radio"></span>${ic('qr')}<div><b>СБП</b><span>Оплата по QR-коду в приложении банка</span></div></label>
              ${t.inst ? `<label class="pm"><input type="radio" name="pay" value="installment"><span class="radio"></span>${ic('calendar')}<div><b>Рассрочка на ${t.inst} мес</b><span>${rub(t.price / t.inst)} в месяц, без переплаты</span></div></label>` : ''}
            </div>
          </section>
        </div>
        <aside class="checkout__aside">
          <div class="card summary" id="summary">
            <h3>Ваш заказ</h3>
            <div class="summary__school"><span class="media media--xs" style="--h:${s.hue}">${mediaInner(s)}</span><div><b>${t.name}</b><span>${s.full}</span></div></div>
            <dl class="summary__dl">
              <div><dt>Коробка</dt><dd>${LBL.transShort[t.trans]}</dd></div>
              <div><dt>Вождение</dt><dd>${t.hours} ч</dd></div>
              <div><dt>Группа</dt><dd id="sumGroup">—</dd></div>
              <div><dt>Оплата</dt><dd id="sumPay">—</dd></div>
            </dl>
            <div class="summary__total"><span>Итого</span><b>${rub(t.price)}</b></div>
            <div class="summary__monthly" id="sumMonthly" hidden></div>
            <label class="check check--top"><input type="checkbox" name="offer" required><span class="check__box">${ic('check')}</span><span>Принимаю условия договора-оферты автошколы</span></label>
            <button class="btn btn-primary btn-lg btn-block">Перейти к оплате</button>
            <p class="summary__note">${ic('percent')} Цена напрямую от автошколы, без наценки</p>
          </div>
        </aside>
      </form>`,
      mount() {
        const f = $('[data-form="checkout"]');
        const upd = () => {
          const fd = new FormData(f);
          const g = s.groups.find(x => x.id === fd.get('group'));
          $('#sumGroup').textContent = needGroup ? (g ? `${g.days.map(d => dayLabel[d]).join(', ')}, с ${fmtDate(g.start)}` : 'не выбрана') : (t.theory === 'online' ? 'онлайн' : 'не требуется');
          const pay = fd.get('pay');
          $('#sumPay').textContent = pay === 'installment' ? `рассрочка ${t.inst} мес` : LBL.pay[pay];
          const m = $('#sumMonthly');
          m.hidden = pay !== 'installment';
          m.innerHTML = `${rub(t.price / t.inst)} × ${t.inst} платежей`;
        };
        f.addEventListener('change', upd);
        upd();
      },
    };
  }

  /* ---------- payment gateway (демо) ---------- */
  function viewPay(id) {
    const o = state.orders.find(x => x.id === id);
    if (!o) return notFound();
    if (o.status === 'paid') { location.replace('#/success/' + id); return ''; }
    const t = tariffById(o.tariffId), s = schoolById(t.schoolId);
    document.title = 'Оплата заказа ' + o.id;
    document.body.classList.add('is-gateway');
    const amount = o.method === 'installment' ? o.monthly : o.amount;
    const qr = Array.from({ length: 21 * 21 }, (_, i) => {
      const x = i % 21, y = Math.floor(i / 21);
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      const on = finder ? (x % 20 === 0 || y % 20 === 0 || x === 6 || y === 6 || x === 14 || y === 14 || (x > 1 && x < 5 && y > 1 && y < 5) || (x > 15 && x < 19 && y > 1 && y < 5) || (x > 1 && x < 5 && y > 15 && y < 19)) : ((x * 7 + y * 13 + x * y + id.charCodeAt(x % id.length)) % 3 === 0);
      return on ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : '';
    }).join('');
    return `
      <div class="gw">
        <div class="gw__bar"><div class="gw__brand">${ic('lock')} PayGate <span>тестовый режим</span></div><span class="gw__secure">${ic('shieldCheck')} Защищённое соединение</span></div>
        <div class="gw__card">
          <div class="gw__merchant"><span>Получатель</span><b>Инго Автошколы</b><small>${s.full}</small></div>
          <div class="gw__order">Заказ № ${o.id} · ${t.name}</div>
          <div class="gw__amount">${rub(amount)}${o.method === 'installment' ? `<small>первый платёж из ${t.inst}</small>` : ''}</div>
          ${o.method === 'card' ? `
            <div class="gw__cardform">
              <label class="field"><span>Номер карты</span><input value="2200 0000 0000 0004" readonly></label>
              <div class="form__row"><label class="field"><span>Срок</span><input value="12 / 29" readonly></label><label class="field"><span>CVC</span><input value="•••" readonly></label></div>
              <p class="demo-hint">${ic('zap')} Подставлена тестовая карта — деньги не списываются</p>
            </div>` : o.method === 'sbp' ? `
            <div class="gw__sbp"><svg viewBox="-1 -1 23 23" class="gw__qr" aria-label="QR-код для оплаты">${qr}</svg><p>Отсканируйте QR-код камерой телефона или в приложении банка</p></div>` : `
            <div class="gw__inst"><div><span>Срок</span><b>${t.inst} мес</b></div><div><span>Ежемесячно</span><b>${rub(o.monthly)}</b></div><div><span>Переплата</span><b>0 ₽</b></div><p class="demo-hint">${ic('zap')} Решение по рассрочке в тестовом режиме — мгновенно</p></div>`}
          <button class="btn btn-primary btn-lg btn-block" data-action="pay-confirm" data-id="${o.id}">${o.method === 'sbp' ? 'Я оплатил(а) в приложении банка' : o.method === 'installment' ? 'Оформить рассрочку' : 'Оплатить ' + rub(amount)}</button>
          <a href="#/checkout/${t.id}" class="gw__cancel">Отменить и вернуться в магазин</a>
        </div>
        <p class="gw__foot">Демонстрационная страница платёжного сервиса. Реальные платежи не проводятся.</p>
      </div>`;
  }

  function viewSuccess(id) {
    const o = state.orders.find(x => x.id === id);
    if (!o) return notFound();
    if (o.status !== 'paid') { location.replace('#/pay/' + id); return ''; }
    const t = tariffById(o.tariffId), s = schoolById(t.schoolId), g = s.groups.find(x => x.id === o.groupId);
    document.title = 'Оплата прошла — Инго Автошколы';
    return `
      <div class="container narrow page-body">
        <div class="card success">
          <div class="ok-ic ok-ic--lg">${ic('check')}</div>
          <h1>Оплата прошла успешно</h1>
          <p class="lead">Вы записаны на обучение в ${s.full}. Заказ № ${o.id}.</p>
          <dl class="summary__dl summary__dl--wide">
            <div><dt>Тариф</dt><dd>${t.name} · ${LBL.transShort[t.trans]}, ${t.hours} ч вождения</dd></div>
            <div><dt>Группа</dt><dd>${g ? `${g.name}: ${g.days.map(d => dayLabel[d]).join(', ')} ${g.hours}, старт ${fmtDate(g.start)}` : t.theory === 'online' ? 'Онлайн-теория — доступ открыт' : 'Не требуется'}</dd></div>
            <div><dt>Оплачено</dt><dd>${o.method === 'installment' ? `${rub(o.monthly)} — первый платёж из ${t.inst}` : rub(o.amount)} · ${LBL.pay[o.method]}</dd></div>
          </dl>
          <h2>Что дальше</h2>
          <ol class="next-steps">
            <li><b>Договор и чек</b> — уже на ${esc(state.user ? state.user.email : 'вашей почте')}.</li>
            <li><b>Звонок менеджера школы</b> в течение рабочего дня — познакомиться и ответить на вопросы.</li>
            <li><b>${g ? 'Первое занятие ' + fmtDate(g.start) : 'Первое занятие'}</b> — не забудьте паспорт и медицинскую справку.</li>
            <li><b>Начните решать билеты</b> уже сегодня — так теория пойдёт легче.</li>
          </ol>
          <div class="btn-row"><a class="btn btn-primary" href="#/pdd">Решать билеты ПДД</a><a class="btn btn-ghost" href="#/account">Мои заказы</a></div>
        </div>
        <a class="promo promo--sm" href="#/materials/novice-money"><div><span class="eyebrow">${ic('shield')} Скоро за руль</span><h3>Какая страховка нужна начинающему водителю?</h3><p>Разбор за 4 минуты: ОСАГО, КАСКО и как не платить за ошибки из своего кармана.</p></div><span class="btn btn-accent">Читать ${ic('arrow')}</span></a>
      </div>`;
  }

  function viewAccount() {
    if (!state.user) { location.replace('#/auth?next=/account'); return ''; }
    document.title = 'Личный кабинет — Инго Автошколы';
    const u = state.user, pd = state.pdd;
    const answered = Object.keys(pd.answered).length, right = Object.values(pd.answered).filter(Boolean).length;
    return `
      <section class="page-head"><div class="container">${crumbs([['Главная', '#/'], ['Личный кабинет']])}<h1>Личный кабинет</h1></div></section>
      <div class="container page-body account">
        <aside class="card profile">
          <div class="profile__ava">${esc(u.name[0] || '?')}</div>
          <b>${esc(u.name)}</b>
          <span>${ic('mail')} ${esc(u.email)}</span>
          <span>${ic('phone')} ${esc(u.phone)}</span>
          <button class="btn btn-ghost btn-sm" data-action="logout">Выйти</button>
        </aside>
        <div class="account__main">
          <section class="card">
            <h2>Мои заказы</h2>
            ${state.orders.length ? `<div class="orders">${state.orders.map(o => {
              const t = tariffById(o.tariffId), s = schoolById(t.schoolId), g = s.groups.find(x => x.id === o.groupId);
              return `<div class="order"><span class="media media--xs" style="--h:${s.hue}">${mediaInner(s)}</span><div class="order__main"><b>${t.name}</b><span>${s.full}${g ? ' · ' + g.name.toLowerCase() + ', старт ' + fmtDate(g.start) : ''}</span><small>№ ${o.id} от ${fmtDate(o.created)}</small></div><div class="order__side"><b>${rub(o.amount)}</b>${o.status === 'paid' ? `<span class="status status--ok">Оплачен</span>` : `<a class="status status--wait" href="#/pay/${o.id}">Ожидает оплаты →</a>`}</div></div>`;
            }).join('')}</div>` : emptyState('Заказов пока нет', 'Выберите автошколу и тариф — оплаченные заказы появятся здесь.', '<a class="btn btn-primary" href="#/schools">Найти автошколу</a>')}
          </section>
          <section class="card">
            <h2>Подготовка к экзамену</h2>
            <div class="kpis kpis--3">
              <div class="kpi"><span>Решено вопросов</span><b>${answered}</b><small>из ${P.QUESTIONS.length}</small></div>
              <div class="kpi"><span>Верных ответов</span><b>${answered ? Math.round(right / answered * 100) : 0}%</b></div>
              <div class="kpi"><span>Ошибок в работе</span><b>${pd.mistakes.length}</b></div>
            </div>
            <a class="btn btn-ghost" href="#/pdd">К билетам ${ic('arrow')}</a>
          </section>
        </div>
      </div>`;
  }

  /* ---------- PDD ---------- */
  const QMAP = Object.fromEntries(P.QUESTIONS.map(q => [q.id, q]));
  const TICKETS = Math.floor(P.QUESTIONS.length / 20);
  const topicName = id => (P.TOPICS.find(t => t.id === id) || {}).name || '';
  let quiz = null, quizTimer = null;

  function viewPdd() {
    document.title = 'Билеты ПДД 2026 — Инго Автошколы';
    const pd = state.pdd;
    const answered = Object.keys(pd.answered).length, right = Object.values(pd.answered).filter(Boolean).length;
    return `
      <section class="page-head page-head--pdd"><div class="container">
        ${crumbs([['Главная', '#/'], ['Билеты ПДД']])}
        <div class="pdd-hero">
          <div><h1>Билеты ПДД 2026</h1><p class="lead">Категории A, B, M. Тренируйтесь в формате настоящего экзамена в ГИБДД: 20 вопросов, 20 минут, не больше двух ошибок.</p></div>
          <div class="pdd-stats">
            <div><b>${answered}<small>/${P.QUESTIONS.length}</small></b><span>решено вопросов</span></div>
            <div><b>${answered ? Math.round(right / answered * 100) : 0}%</b><span>верных ответов</span></div>
            <div><b>${pd.mistakes.length}</b><span>ошибок в работе</span></div>
          </div>
        </div>
      </div></section>
      <div class="container page-body">
        <div class="modes">
          <a class="mode mode--main" href="#/pdd/exam">${ic('trophy')}<div><b>Экзамен как в ГИБДД</b><span>20 случайных вопросов за 20 минут. За ошибку — +5 вопросов.</span></div><span class="btn btn-accent">Начать</span></a>
          <a class="mode" href="#/pdd/ticket/${1 + Math.floor(Math.random() * TICKETS)}">${ic('shuffle')}<div><b>Случайный билет</b><span>20 вопросов с подсказками</span></div></a>
          <a class="mode" href="#/pdd/marathon">${ic('zap')}<div><b>Марафон</b><span>Все ${P.QUESTIONS.length} вопросов подряд</span></div></a>
          <a class="mode" href="#/pdd/mistakes">${ic('refresh')}<div><b>Мои ошибки</b><span>${pd.mistakes.length ? pd.mistakes.length + ' ' + plural(pd.mistakes.length, 'вопрос', 'вопроса', 'вопросов') + ' на повторение' : 'Пока ошибок нет'}</span></div></a>
        </div>

        <section class="block">
          <div class="block__head"><h2>Решать по билетам</h2><span class="muted small">В демо-версии доступно ${TICKETS} ${plural(TICKETS, 'билет', 'билета', 'билетов')} из 40</span></div>
          <div class="tickets">${Array.from({ length: 40 }, (_, i) => {
            const n = i + 1, st = pd.tickets[n];
            if (n > TICKETS) return `<span class="ticket is-locked" title="Скоро">${n}</span>`;
            return `<a class="ticket ${st ? (st.passed ? 'is-ok' : 'is-bad') : ''}" href="#/pdd/ticket/${n}" title="${st ? `Последний результат: ${st.correct}/${st.total}` : 'Ещё не решали'}">${n}${st ? `<small>${st.correct}/${st.total}</small>` : ''}</a>`;
          }).join('')}</div>
        </section>

        <section class="block">
          <h2>Вопросы по темам</h2>
          <div class="topics">${P.TOPICS.map(t => {
            const ids = P.QUESTIONS.filter(q => q.topic === t.id).map(q => q.id);
            if (!ids.length) return '';
            const done = ids.filter(id => pd.answered[id] === true).length;
            return `<a class="topic" href="#/pdd/topic/${t.id}"><span>${t.name}</span><small>${ids.length} ${plural(ids.length, 'вопрос', 'вопроса', 'вопросов')}</small><i class="topic__bar"><i style="width:${done / ids.length * 100}%"></i></i></a>`;
          }).join('')}</div>
        </section>

        <section class="block rules">
          <h2>Как проходит теоретический экзамен в ГИБДД</h2>
          <div class="grid grid--4">
            <div class="rule"><b>20</b><span>вопросов из разных тематических блоков</span></div>
            <div class="rule"><b>20 мин</b><span>на все ответы</span></div>
            <div class="rule"><b>≤ 2</b><span>ошибки — и то в разных блоках</span></div>
            <div class="rule"><b>+5</b><span>дополнительных вопросов и 5 минут за каждую ошибку</span></div>
          </div>
          <p class="muted small">Ошибка в дополнительных вопросах — экзамен не сдан. Пересдача — не ранее чем через 7 дней.</p>
        </section>
      </div>`;
  }

  function quizIds(mode, arg) {
    const all = P.QUESTIONS.map(q => q.id);
    switch (mode) {
      case 'ticket': { const n = +arg; return n >= 1 && n <= TICKETS ? all.slice((n - 1) * 20, n * 20) : null; }
      case 'topic': return P.TOPICS.some(t => t.id === arg) ? P.QUESTIONS.filter(q => q.topic === arg).map(q => q.id) : null;
      case 'exam': return shuffle(all).slice(0, 20);
      case 'marathon': return shuffle(all);
      case 'mistakes': return state.pdd.mistakes.filter(id => QMAP[id]);
      default: return null;
    }
  }

  function viewQuiz(mode, arg) {
    const ids = quizIds(mode, arg);
    if (!ids) return notFound();
    const title = { ticket: `Билет ${arg}`, exam: 'Экзамен как в ГИБДД', marathon: 'Марафон', mistakes: 'Работа над ошибками', topic: topicName(arg) }[mode];
    document.title = `${title} — Билеты ПДД 2026`;
    const head = `<section class="page-head page-head--slim"><div class="container">${crumbs([['Главная', '#/'], ['Билеты ПДД', '#/pdd'], [title]])}</div></section>`;
    if (!ids.length) {
      return head + `<div class="container page-body">${emptyState('Ошибок нет — отлично!', 'Здесь появятся вопросы, на которые вы ответили неверно. Решите пару билетов.', '<a class="btn btn-primary" href="#/pdd/ticket/1">Решать билет 1</a>')}</div>`;
    }
    quiz = { mode, arg, title, ids, ans: ids.map(() => null), cur: 0, start: Date.now(), limit: mode === 'exam' ? 20 * 60 : 0, base: ids.length, extra: 0, done: false };
    return {
      html: head + '<div class="container page-body"><div id="quiz" class="quiz"></div></div>',
      mount() { renderQuiz(); if (quiz.limit) quizTimer = setInterval(tick, 1000); },
    };
  }

  const remaining = () => quiz.limit - Math.floor((Date.now() - quiz.start) / 1000);
  const allAnswered = () => quiz.ans.every(a => a !== null);
  const nextIndex = () => {
    for (let k = 1; k <= quiz.ids.length; k++) { const i = (quiz.cur + k) % quiz.ids.length; if (quiz.ans[i] === null) return i; }
    return Math.min(quiz.cur + 1, quiz.ids.length - 1);
  };

  function tick() {
    if (!quiz || quiz.done) return;
    const r = remaining(), el = $('#qtimer');
    if (el) { el.textContent = fmtTimer(Math.max(0, r)); el.classList.toggle('is-low', r < 60); }
    if (r <= 0) finishQuiz(false, 'Время вышло');
  }

  function renderQuiz() {
    const el = $('#quiz');
    if (!el || !quiz) return;
    if (quiz.done) { el.innerHTML = quizResult(); return; }
    const exam = quiz.mode === 'exam';
    const q = QMAP[quiz.ids[quiz.cur]], chosen = quiz.ans[quiz.cur], answered = chosen !== null;
    const done = quiz.ans.filter(a => a !== null).length;
    const nav = quiz.ids.map((id, i) => {
      const a = quiz.ans[i];
      let c = a === null ? '' : exam ? 'is-done' : a === QMAP[id].c ? 'is-ok' : 'is-bad';
      if (i === quiz.cur) c += ' is-cur';
      return `${i === quiz.base ? '<span class="qnav__sep">Доп.</span>' : ''}<button class="qnav__i ${c}" data-action="qgo" data-i="${i}" aria-label="Вопрос ${i + 1}">${i + 1}</button>`;
    }).join('');
    const lastAndAnswered = !exam && allAnswered();
    el.innerHTML = `
      <div class="quiz__head">
        <div><h1 class="quiz__title">${quiz.title}</h1><p class="muted">Вопрос ${quiz.cur + 1} из ${quiz.ids.length} · ${topicName(q.topic)}</p></div>
        <div class="quiz__side">${quiz.limit ? `<div class="timer" id="qtimer">${ic('clock')}<span>${fmtTimer(Math.max(0, remaining()))}</span></div>` : ''}<button class="btn btn-ghost btn-sm" data-action="qfinish">Завершить</button></div>
      </div>
      <div class="progress"><i style="width:${done / quiz.ids.length * 100}%"></i></div>
      <div class="qnav">${nav}</div>
      <div class="qcard ${q.svg ? 'has-img' : ''}">
        ${q.svg ? `<div class="qcard__img">${P.SIGNS[q.svg]}</div>` : ''}
        <div class="qcard__body">
          <p class="qcard__q">${q.q}</p>
          <div class="answers">${q.a.map((t, i) => {
            let c = '';
            if (answered) c = exam ? (i === chosen ? 'is-picked' : '') : (i === q.c ? 'is-ok' : i === chosen ? 'is-bad' : '');
            return `<button class="ans ${c}" data-action="qans" data-i="${i}" ${answered ? 'disabled' : ''}><span class="ans__n">${i + 1}</span><span>${t}</span></button>`;
          }).join('')}</div>
          ${answered && !exam ? `<div class="explain ${chosen === q.c ? 'is-ok' : 'is-bad'}"><b>${ic(chosen === q.c ? 'check' : 'x')} ${chosen === q.c ? 'Правильно!' : 'Неправильно'}</b><p>${q.e}</p>${q.p ? `<span class="explain__ref">Основание: ${q.p}</span>` : ''}</div>` : ''}
        </div>
      </div>
      <div class="quiz__foot">
        <button class="btn btn-ghost" data-action="qgo" data-i="${quiz.cur - 1}" ${quiz.cur === 0 ? 'disabled' : ''}>${ic('arrowL')} Назад</button>
        <span class="muted small hide-sm">Клавиши 1–${q.a.length} — ответ, ← → — навигация</span>
        ${lastAndAnswered ? `<button class="btn btn-primary" data-action="qfinish">Результат ${ic('arrow')}</button>`
          : `<button class="btn btn-primary" data-action="qgo" data-i="${nextIndex()}">${exam && !answered ? 'Пропустить' : 'Далее'} ${ic('arrow')}</button>`}
      </div>`;
  }

  function answer(i) {
    if (!quiz || quiz.done) return;
    const idx = quiz.cur;
    if (quiz.ans[idx] !== null) return;
    const id = quiz.ids[idx], ok = i === QMAP[id].c, pd = state.pdd;
    quiz.ans[idx] = i;
    pd.answered[id] = ok;
    if (!ok && !pd.mistakes.includes(id)) pd.mistakes.push(id);
    if (ok && quiz.mode === 'mistakes') pd.mistakes = pd.mistakes.filter(x => x !== id);
    store.set('pdd', pd);
    if (quiz.mode === 'exam') {
      if (allAnswered()) return examCheck();
      quiz.cur = nextIndex();
    }
    renderQuiz();
  }

  function examCheck() {
    const wrong = (from, to) => quiz.ids.slice(from, to).filter((id, k) => quiz.ans[from + k] !== QMAP[id].c).length;
    if (!quiz.extra) {
      const w = wrong(0, quiz.base);
      if (w === 0) return finishQuiz(true, 'Ни одной ошибки — так держать!');
      if (w > 2) return finishQuiz(false, `Допущено ${w} ${plural(w, 'ошибка', 'ошибки', 'ошибок')} — больше двух`);
      const pool = shuffle(P.QUESTIONS.map(q => q.id).filter(id => !quiz.ids.includes(id))).slice(0, 5 * w);
      quiz.ids.push(...pool);
      quiz.ans.push(...pool.map(() => null));
      quiz.extra = pool.length;
      quiz.limit += 5 * 60 * w;
      quiz.cur = quiz.base;
      toast(`${w === 1 ? 'Одна ошибка' : 'Две ошибки'} — добавлено ${pool.length} дополнительных вопросов и ${5 * w} минут`, 'is-warn');
      return renderQuiz();
    }
    const we = wrong(quiz.base, quiz.ids.length);
    finishQuiz(we === 0, we ? 'Ошибка в дополнительных вопросах' : 'Дополнительные вопросы решены без ошибок');
  }

  function finishQuiz(passed, reason = '') {
    clearInterval(quizTimer);
    quizTimer = null;
    const total = quiz.ids.length;
    const correct = quiz.ids.filter((id, i) => quiz.ans[i] === QMAP[id].c).length;
    if (passed === undefined) passed = total - correct <= 2;
    quiz.done = true;
    quiz.result = { passed, reason, correct, total, time: Math.round((Date.now() - quiz.start) / 1000) };
    if (quiz.mode === 'ticket') { state.pdd.tickets[quiz.arg] = { correct, total, passed, at: Date.now() }; store.set('pdd', state.pdd); }
    renderQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function quizResult() {
    const r = quiz.result, wrongIdx = quiz.ids.map((id, i) => i).filter(i => quiz.ans[i] !== QMAP[quiz.ids[i]].c);
    const verdict = quiz.mode === 'exam' ? (r.passed ? 'Экзамен сдан' : 'Экзамен не сдан')
      : quiz.mode === 'ticket' ? (r.passed ? 'Билет решён' : 'Билет не решён')
      : r.correct / r.total >= 0.9 ? 'Отличный результат' : 'Есть над чем поработать';
    const ok = quiz.mode === 'exam' || quiz.mode === 'ticket' ? r.passed : r.correct / r.total >= 0.9;
    return `
      <div class="qres ${ok ? 'is-ok' : 'is-bad'}">
        <div class="qres__ic">${ic(ok ? 'trophy' : 'refresh')}</div>
        <h1>${verdict}</h1>
        <p class="lead">${r.reason || (quiz.mode === 'ticket' ? 'Чтобы билет считался решённым, допускается не более двух ошибок.' : quiz.title)}</p>
        <div class="qres__stats">
          <div><b>${r.correct}/${r.total}</b><span>верных ответов</span></div>
          <div><b>${r.total - r.correct}</b><span>${plural(r.total - r.correct, 'ошибка', 'ошибки', 'ошибок')}</span></div>
          <div><b>${fmtTimer(r.time)}</b><span>время</span></div>
        </div>
        <div class="btn-row"><button class="btn btn-primary" data-action="qrestart">${ic('refresh')} Пройти ещё раз</button><a class="btn btn-ghost" href="#/pdd">Ко всем билетам</a>${wrongIdx.length ? '<a class="btn btn-ghost" href="#/pdd/mistakes">Работа над ошибками</a>' : ''}</div>
      </div>
      ${wrongIdx.length ? `<h2 class="qres__h">Разбор ошибок</h2><div class="review-list">${wrongIdx.map(i => {
        const q = QMAP[quiz.ids[i]], a = quiz.ans[i];
        return `<article class="rq">${q.svg ? `<div class="rq__img">${P.SIGNS[q.svg]}</div>` : ''}<div><span class="muted small">Вопрос ${i + 1} · ${topicName(q.topic)}</span><p class="rq__q">${q.q}</p>${a !== null ? `<p class="rq__a is-bad">${ic('x')} Ваш ответ: ${q.a[a]}</p>` : '<p class="rq__a is-bad">' + ic('x') + ' Нет ответа</p>'}<p class="rq__a is-ok">${ic('check')} Верно: ${q.a[q.c]}</p><p class="muted small">${q.e}</p></div></article>`;
      }).join('')}</div>` : ''}`;
  }

  /* ---------- insurance ---------- */
  function viewInsurance(q) {
    document.title = 'Страхование для водителей — Инго Автошколы';
    const cat = q.cat === 'life' || q.cat === 'auto' ? q.cat : 'all';
    return {
      html: `
      <section class="page-head page-head--ins"><div class="container">
        ${crumbs([['Главная', '#/'], ['Страхование']])}
        <h1>Страхование для начинающих водителей</h1>
        <p class="lead">Полисы автострахования и страхования жизни от Ингосстраха. Разберитесь, что действительно нужно новичку — и не платите за ошибки на дороге из своего кармана.</p>
      </div></section>
      <div class="container page-body">
        ${riskWidget()}
        <section class="block" id="catalogIns">
          <div class="block__head"><h2>Каталог полисов</h2>
            <div class="seg seg--sm" id="insTabs">${[['all', 'Все'], ['auto', 'Автострахование'], ['life', 'Жизнь и здоровье']].map(([v, l]) => `<button class="seg__b ${cat === v ? 'is-on' : ''}" data-action="ins-cat" data-v="${v}">${l}</button>`).join('')}</div>
          </div>
          <div class="grid grid--3" id="insGrid">${insCards(cat)}</div>
        </section>
        <section class="block">
          <div class="ins-help">
            <div><h2>Не знаете, что выбрать?</h2><p>Прочитайте короткие ридинги о видах страхования — каждый занимает 3–4 минуты.</p></div>
            <div class="btn-row"><a class="btn btn-primary" href="#/materials?topic=insurance">Читать ридинги</a><button class="btn btn-ghost" data-action="chat-open">${ic('chat')} Спросить в чате</button></div>
          </div>
        </section>
      </div>`,
      mount() { if (q.cat) setTimeout(() => $('#catalogIns').scrollIntoView({ behavior: 'smooth' }), 50); },
    };
  }

  function insCards(cat) {
    return C.INSURANCE.filter(p => cat === 'all' || p.cat === cat).map(p => `
      <article class="pcard">
        <div class="pcard__top"><span class="pcard__ic ${p.cat === 'life' ? 'is-life' : ''}">${ic(p.icon)}</span><span class="badge ${p.tag === 'Обязательный' ? 'badge--red' : 'badge--soft'}">${p.tag}</span></div>
        <h3>${p.name}</h3>
        <p>${p.short}</p>
        <ul class="checklist checklist--sm">${p.covers.map(c => `<li>${ic('check')}${c}</li>`).join('')}</ul>
        <p class="pcard__who"><b>Кому:</b> ${p.who}</p>
        ${p.minus ? `<p class="pcard__minus">${ic('alert')} ${p.minus}</p>` : ''}
        <div class="pcard__btns"><a class="btn btn-primary btn-sm" href="${p.link}" target="_blank" rel="noopener">Оформить на ingos.ru ${ic('ext')}</a><a class="btn btn-ghost btn-sm" href="#/materials/${p.article}">Подробнее</a></div>
      </article>`).join('');
  }

  function riskWidget() {
    return `<section class="risk" id="risk">
      <div class="risk__intro">
        <span class="eyebrow eyebrow--light">${ic('clock')} 5 минут</span>
        <h2>Узнай, как страхование спасёт твои деньги за 5 минут</h2>
        <p>Выберите ситуацию — и посмотрите, сколько придётся заплатить без полиса и с ним.</p>
        <div class="risk__opts">${C.RISKS.map((r, i) => `<button class="risk__opt ${i === 0 ? 'is-on' : ''}" data-action="risk" data-i="${i}">${ic(r.icon)}<span>${r.title}</span></button>`).join('')}</div>
      </div>
      <div class="risk__out" id="riskOut">${riskOut(C.RISKS[0])}</div>
    </section>`;
  }

  function riskOut(r) {
    const pct = v => Math.max(1.5, v / r.without * 100);
    return `<div class="risk__card">
      <div class="risk__dmg"><span>Ущерб в этой ситуации</span><b>${rub(r.damage)}</b></div>
      <div class="bar"><span>Без страховки</span><div class="bar__track"><i class="bar--red" style="width:100%"></i></div><b>${rub(r.without)}</b></div>
      ${r.partial ? `<div class="bar"><span>${r.partial.label}</span><div class="bar__track"><i class="bar--amber" style="width:${pct(r.partial.value)}%"></i></div><b>${rub(r.partial.value)}</b></div>` : ''}
      <div class="bar"><span>С полисом ${r.policy}</span><div class="bar__track"><i class="bar--green" style="width:${pct(r.withP)}%"></i></div><b>${rub(r.withP)}</b></div>
      <p class="risk__note">${r.note}</p>
      <div class="risk__foot">
        <div class="risk__save"><span>Вы сохраните</span><b>${rub(r.without - r.withP)}</b></div>
        <a class="btn btn-accent" href="#/materials?topic=insurance">Узнать за 5 минут ${ic('arrow')}</a>
      </div>
      <p class="risk__disc">Суммы примерные и приведены для иллюстрации.</p>
    </div>`;
  }

  /* ---------- materials ---------- */
  function viewMaterials(q) {
    document.title = 'Полезные материалы для автолюбителей — Инго Автошколы';
    const G = C.GUIDE;
    return {
      html: `
      <section class="page-head"><div class="container">
        ${crumbs([['Главная', '#/'], ['Полезные материалы']])}
        <h1>Полезные материалы для автолюбителей</h1>
        <p class="lead">Пошаговый гайд по получению прав и короткие ридинги о страховании — всё, что нужно знать новичку.</p>
      </div></section>
      <div class="container page-body">
        <a class="guide-card" href="#/materials/guide">
          <div class="guide-card__text"><span class="eyebrow eyebrow--light">${ic('cap')} Гайд · 8 шагов</span><h2>${G.title}</h2><p>${G.lead}</p><span class="btn btn-accent">Открыть гайд ${ic('arrow')}</span></div>
          <ol class="guide-card__steps">${G.steps.map((s, i) => `<li><span>${i + 1}</span>${s.title}</li>`).join('')}</ol>
        </a>
        <section class="block" id="reads">
          <div class="block__head"><h2>Короткие ридинги</h2><span class="muted small">по 3–4 минуты</span></div>
          <div class="grid grid--3">${C.ARTICLES.map(articleCard).join('')}</div>
        </section>
        <section class="block">
          <div class="ins-help">
            <div><h2>Готовы выбрать автошколу?</h2><p>Сравните школы и тарифы — цены напрямую от автошкол.</p></div>
            <div class="btn-row"><a class="btn btn-primary" href="#/schools">Найти автошколу</a><a class="btn btn-ghost" href="#/pdd">Решать билеты</a></div>
          </div>
        </section>
      </div>`,
      mount() { if (q.topic) setTimeout(() => $('#reads').scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); },
    };
  }

  const articleCard = a => `<a class="acard" href="#/materials/${a.slug}"><span class="acard__ic">${ic(a.icon)}</span><span class="acard__tag">${a.tag} · ${a.time} мин</span><h3>${a.title}</h3><p>${a.lead}</p><span class="acard__go">Читать ${ic('arrow')}</span></a>`;

  function viewArticle(slug) {
    if (slug === 'guide') return viewGuide();
    const a = C.ARTICLES.find(x => x.slug === slug);
    if (!a) return notFound();
    document.title = a.title + ' — Инго Автошколы';
    const idx = C.ARTICLES.indexOf(a), next = C.ARTICLES[(idx + 1) % C.ARTICLES.length];
    const block = ([t, x]) => t === 'p' ? `<p>${x}</p>` : t === 'h' ? `<h2>${x}</h2>` : t === 'ul' ? `<ul>${x.map(i => `<li>${i}</li>`).join('')}</ul>` : t === 'ol' ? `<ol>${x.map(i => `<li>${i}</li>`).join('')}</ol>` : `<div class="callout">${ic('zap')}<p>${x}</p></div>`;
    return `
      <section class="page-head"><div class="container narrow">
        ${crumbs([['Главная', '#/'], ['Полезные материалы', '#/materials'], [a.tag]])}
        <span class="acard__tag">${a.tag} · ${a.time} мин чтения</span>
        <h1>${a.title}</h1>
        <p class="lead">${a.lead}</p>
      </div></section>
      <div class="container page-body article-wrap">
        <article class="article">${a.body.map(block).join('')}
          <div class="article__cta">${a.group === 'insurance' ? `<div><b>Подберите полис</b><p>Полисы автострахования и жизни от Ингосстраха.</p></div><a class="btn btn-primary" href="#/insurance">К каталогу полисов</a>` : `<div><b>Готовьтесь к экзамену</b><p>Билеты ПДД 2026 в формате ГИБДД.</p></div><a class="btn btn-primary" href="#/pdd">Решать билеты</a>`}</div>
          <a class="next-read" href="#/materials/${next.slug}"><span>Следующий ридинг</span><b>${next.title}</b>${ic('arrow')}</a>
        </article>
        <aside class="article-aside">
          <h3>Ещё почитать</h3>
          <a href="#/materials/guide" class="aside-link aside-link--guide">${ic('cap')}<span>Гайд: как получить права</span></a>
          ${C.ARTICLES.filter(x => x !== a).map(x => `<a href="#/materials/${x.slug}" class="aside-link">${ic(x.icon)}<span>${x.title}</span></a>`).join('')}
        </aside>
      </div>`;
  }

  function viewGuide() {
    const G = C.GUIDE;
    document.title = G.title + ' — Инго Автошколы';
    return `
      <section class="page-head page-head--guide"><div class="container">
        ${crumbs([['Главная', '#/'], ['Полезные материалы', '#/materials'], ['Гайд']])}
        <span class="eyebrow">${ic('cap')} Гайд получающего права</span>
        <h1>${G.title}</h1>
        <p class="lead">${G.lead}</p>
        <div class="guide-nav">${G.steps.map((s, i) => `<button data-action="scroll" data-to="#step${i + 1}"><span>${i + 1}</span>${s.title}</button>`).join('')}</div>
      </div></section>
      <div class="container page-body">
        <ol class="timeline">${G.steps.map((s, i) => `
          <li class="tl" id="step${i + 1}">
            <span class="tl__n">${i + 1}</span>
            <div class="tl__card">
              <h2>${s.title}</h2>
              <div class="chips">${chip(ic('clock') + ' ' + s.time)}${chip(ic('wallet') + ' ' + s.cost, 'chip--blue')}</div>
              <p>${s.text}</p>
              ${s.list ? `<ul class="checklist checklist--sm">${s.list.map(x => `<li>${ic('check')}${x}</li>`).join('')}</ul>` : ''}
              ${s.tip ? `<div class="callout">${ic('zap')}<p>${s.tip}</p></div>` : ''}
              ${s.link ? `<a class="btn btn-primary btn-sm" href="${s.link[1]}">${s.link[0]} ${ic('arrow')}</a>` : ''}
            </div>
          </li>`).join('')}
        </ol>
        <p class="note">${ic('alert')} ${G.note}</p>
      </div>`;
  }

  /* ---------- FAQ ---------- */
  function viewFaq() {
    document.title = 'Частые вопросы — Инго Автошколы';
    return {
      html: `
      <section class="page-head"><div class="container narrow">
        ${crumbs([['Главная', '#/'], ['Частые вопросы']])}
        <h1>Частые вопросы</h1>
        <label class="search search--lg">${ic('search')}<input type="search" id="faqQ" placeholder="Например: рассрочка, возврат, группа" aria-label="Поиск по вопросам"></label>
      </div></section>
      <div class="container narrow page-body" id="faqBody">
        ${C.FAQ.map(g => `<section class="faq-group"><h2>${g.group}</h2><div class="faq">${g.items.map(faqItem).join('')}</div></section>`).join('')}
        <div class="empty" id="faqEmpty" hidden><h3>Ничего не нашлось</h3><p>Попробуйте другую формулировку или спросите в чате.</p></div>
        <div class="ask"><div><h2>Не нашли ответ?</h2><p>Поддержка отвечает в чате в среднем за 2 минуты.</p></div><button class="btn btn-primary" data-action="chat-open">${ic('chat')} Написать в чат</button></div>
      </div>`,
      mount() {
        $('#faqQ').addEventListener('input', e => {
          const v = e.target.value.trim().toLowerCase();
          let any = false;
          $$('.faq-group').forEach(g => {
            let vis = 0;
            $$('.faq__i', g).forEach(d => { const m = !v || d.textContent.toLowerCase().includes(v); d.hidden = !m; if (m) vis++; if (v && m) d.open = true; });
            g.hidden = !vis;
            any = any || vis > 0;
          });
          $('#faqEmpty').hidden = any;
        });
      },
    };
  }

  function notFound() {
    document.title = 'Страница не найдена — Инго Автошколы';
    return `<div class="container narrow page-body">${emptyState('Страница не найдена', 'Возможно, ссылка устарела. Начните с главной или каталога автошкол.', '<div class="btn-row"><a class="btn btn-primary" href="#/">На главную</a><a class="btn btn-ghost" href="#/schools">Каталог автошкол</a></div>')}</div>`;
  }

  /* ================= compare state ================= */
  function toggleCompare(kind, id) {
    const list = state.compare[kind];
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else {
      if (list.length >= 4) { toast('Можно сравнить не больше 4 вариантов — уберите один из списка', 'is-warn'); return; }
      list.push(id);
    }
    store.set('compare', state.compare);
    $$(`[data-action="cmp"][data-kind="${kind}"][data-id="${id}"]`).forEach(b => {
      const compact = b.classList.contains('cmp-btn--icon');
      b.outerHTML = cmpBtn(kind, id, compact);
    });
    renderCompareBar();
  }

  function renderCompareBar() {
    const { schools, tariffs } = state.compare, n = schools.length + tariffs.length;
    const path = parseHash().path;
    const bar = $('#compareBar');
    const cnt = $('#cmpCount');
    cnt.textContent = n;
    cnt.hidden = !n;
    const hide = !n || path === '/compare' || path.startsWith('/pay') || path.startsWith('/checkout') || path.startsWith('/pdd/');
    bar.hidden = hide;
    document.body.classList.toggle('has-cmpbar', !hide);
    if (hide) return;
    const tab = schools.length ? 'schools' : 'tariffs';
    bar.innerHTML = `<div class="cmpbar__in">
      <div class="cmpbar__items">${ic('compare')}<span>В сравнении: ${schools.length ? `<b>${schools.length}</b> ${plural(schools.length, 'автошкола', 'автошколы', 'автошкол')}` : ''}${schools.length && tariffs.length ? ' и ' : ''}${tariffs.length ? `<b>${tariffs.length}</b> ${plural(tariffs.length, 'тариф', 'тарифа', 'тарифов')}` : ''}</span></div>
      <a class="btn btn-accent btn-sm" href="#/compare?tab=${tab}">Сравнить</a>
      <button class="icon-btn icon-btn--light" data-action="cmp-clear" data-kind="all" aria-label="Очистить сравнение">${ic('x')}</button>
    </div>`;
  }

  /* ================= chat ================= */
  const chat = { msgs: store.get('chat', null) || [{ from: 'bot', text: C.BOT.greeting }], typing: false };
  function mountChat() {
    $('#chat').innerHTML = `
      <button class="chat-fab" data-action="chat-toggle" aria-label="Открыть чат поддержки">${ic('chat')}<span>Чат поддержки</span></button>
      <section class="chat" id="chatBox" hidden aria-label="Чат поддержки">
        <header class="chat__head"><span class="chat__ava">${ic('users')}</span><div><b>Поддержка Инго Автошколы</b><span><i class="dot"></i> онлайн · отвечаем за 2 минуты</span></div><button class="icon-btn icon-btn--light" data-action="chat-toggle" aria-label="Закрыть чат">${ic('x')}</button></header>
        <div class="chat__msgs" id="chatMsgs" aria-live="polite"></div>
        <div class="chat__quick">${C.BOT.quick.map(q => `<button data-action="chat-quick" data-q="${esc(q)}">${q}</button>`).join('')}</div>
        <form class="chat__form" data-form="chat"><input name="m" autocomplete="off" placeholder="Напишите сообщение…" aria-label="Сообщение"><button class="icon-btn icon-btn--primary" aria-label="Отправить">${ic('send')}</button></form>
      </section>`;
    renderChat();
  }
  function renderChat() {
    const box = $('#chatMsgs');
    box.innerHTML = chat.msgs.map(m => `<div class="msg msg--${m.from}">${m.from === 'op' ? '<span class="msg__who">Анна, поддержка</span>' : ''}<p>${linkify(m.text)}</p></div>`).join('')
      + (chat.typing ? '<div class="msg msg--bot msg--typing"><i></i><i></i><i></i></div>' : '');
    box.scrollTop = box.scrollHeight;
  }
  function chatToggle(open) {
    const box = $('#chatBox');
    const willOpen = open ?? box.hidden;
    box.hidden = !willOpen;
    document.body.classList.toggle('chat-open', willOpen);
    if (willOpen) { renderChat(); setTimeout(() => $('[name="m"]', box).focus(), 50); }
  }
  function chatSend(text) {
    text = text.trim();
    if (!text) return;
    chat.msgs.push({ from: 'me', text });
    chat.typing = true;
    renderChat();
    setTimeout(() => {
      chat.typing = false;
      const t = text.toLowerCase();
      if (/оператор|человек|живой|менеджер/.test(t)) chat.msgs.push({ from: 'op', text: C.BOT.operator });
      else {
        const rule = C.BOT.rules.find(r => r.k.some(k => t.includes(k)));
        chat.msgs.push({ from: 'bot', text: rule ? rule.a : C.BOT.fallback });
      }
      store.set('chat', chat.msgs.slice(-40));
      renderChat();
    }, 650 + Math.random() * 500);
  }

  /* ================= actions ================= */
  const actions = {
    'cmp': el => toggleCompare(el.dataset.kind, el.dataset.id),
    'cmp-remove': el => { toggleCompare(el.dataset.kind, el.dataset.id); router(); },
    'cmp-clear': el => {
      const k = el.dataset.kind;
      if (k === 'all') state.compare = { schools: [], tariffs: [] };
      else state.compare[k] = [];
      store.set('compare', state.compare);
      if (parseHash().path === '/compare') return router();
      $$('[data-action="cmp"]').forEach(b => { b.outerHTML = cmpBtn(b.dataset.kind, b.dataset.id, b.classList.contains('cmp-btn--icon')); });
      renderCompareBar();
    },
    'cmp-diff': el => { state.cmpDiff = el.checked; $('#cmpWrap').classList.toggle('diff-only', state.cmpDiff); },
    'reset-filters': () => {
      if (catalogKind === 'schools') state.sf = Object.assign(defaultSF(), { view: state.sf.view }); else state.tf = defaultTF();
      Object.assign(state.common, { district: '', place: '', radius: 0 });
      const s = $('.toolbar [data-f="q"]'); if (s) s.value = '';
      refreshCatalog(true);
    },
    'unset-f': el => {
      const k = el.dataset.k, v = el.dataset.v, F = catalogKind === 'schools' ? state.sf : state.tf;
      if (COMMON.includes(k)) {
        state.common[k] = k === 'radius' ? 0 : '';
        if (k === 'place') { state.common.radius = 0; if (F.sort === 'distance') F.sort = catalogKind === 'schools' ? 'rating' : 'price'; }
      }
      else if (Array.isArray(F[k])) { F[k] = F[k].filter(x => x !== v); if (k === 'formats' && catalogKind === 'tariffs' && !F.formats.some(x => x === 'offline' || x === 'mixed')) F.theoryTimes = []; }
      else F[k] = typeof F[k] === 'boolean' ? false : '';
      refreshCatalog(true);
    },
    'price-preset': el => { const F = catalogKind === 'schools' ? state.sf : state.tf; F.priceMax = +F.priceMax === +el.dataset.v ? '' : el.dataset.v; refreshCatalog(true); },
    'view': el => { state.sf.view = el.dataset.v; $$('[data-action="view"]').forEach(b => b.classList.toggle('is-on', b === el)); if (state.sf.view === 'list') destroyMap(); refreshCatalog(false); },
    'filters-open': () => { $('#filters').classList.add('is-open'); document.body.classList.add('no-scroll'); },
    'filters-close': () => { $('#filters').classList.remove('is-open'); document.body.classList.remove('no-scroll'); },
    'scroll': el => { const t = $(el.dataset.to); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 84, behavior: 'smooth' }); },
    'trans-tab': el => {
      $$('#transTabs .seg__b').forEach(b => b.classList.toggle('is-on', b === el));
      const s = schoolById(parseHash().path.split('/')[2]);
      const list = s.tariffs.filter(t => el.dataset.v === 'all' || t.trans === el.dataset.v);
      $('#schoolTariffs').innerHTML = list.map(t => tariffCard(t, { school: false })).join('');
    },
    'nav-toggle': el => { const open = $('#header').classList.toggle('is-open'); el.setAttribute('aria-expanded', open); },
    'logout': () => { state.user = null; store.set('user', null); updateHeader(); toast('Вы вышли из аккаунта'); location.hash = '#/'; },
    'auth-back': () => { authDraft = null; router(); },
    'auth-resend': () => { authDraft.code = String(1000 + Math.floor(Math.random() * 9000)); toast(`Новый код отправлен. Демо-код: <b>${authDraft.code}</b>`); router(); },
    'pay-confirm': el => {
      const o = state.orders.find(x => x.id === el.dataset.id);
      el.disabled = true;
      el.innerHTML = '<span class="spinner"></span> Обрабатываем платёж…';
      setTimeout(() => {
        o.status = 'paid';
        o.paidAt = new Date().toISOString();
        const s = schoolById(o.schoolId), g = s.groups.find(x => x.id === o.groupId);
        if (g && g.seats > 0) g.seats--;
        saveOrders();
        location.hash = '#/success/' + o.id;
      }, 1400);
    },
    'qans': el => answer(+el.dataset.i),
    'qgo': el => { const i = +el.dataset.i; if (i >= 0 && i < quiz.ids.length) { quiz.cur = i; renderQuiz(); } },
    'qfinish': () => {
      const left = quiz.ans.filter(a => a === null).length;
      if (left && !confirm(`Осталось ${left} ${plural(left, 'вопрос', 'вопроса', 'вопросов')} без ответа. Завершить?`)) return;
      if (quiz.mode === 'exam') finishQuiz(false, 'Экзамен завершён досрочно');
      else finishQuiz();
    },
    'qrestart': () => router(),
    'ins-cat': el => { $$('#insTabs .seg__b').forEach(b => b.classList.toggle('is-on', b === el)); $('#insGrid').innerHTML = insCards(el.dataset.v); },
    'risk': el => { $$('.risk__opt').forEach(b => b.classList.toggle('is-on', b === el)); $('#riskOut').innerHTML = riskOut(C.RISKS[+el.dataset.i]); },
    'chat-toggle': () => chatToggle(),
    'chat-open': () => chatToggle(true),
    'chat-quick': el => chatSend(el.dataset.q),
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const fn = actions[el.dataset.action];
    if (!fn) return;
    if (el.dataset.action !== 'cmp-diff') e.preventDefault();
    fn(el, e);
  });

  /* ================= forms ================= */
  const fieldError = (input, msg) => {
    const f = input.closest('.field') || input.closest('.check');
    f.classList.add('is-error');
    let m = f.querySelector('.field__err');
    if (!m) { m = document.createElement('span'); m.className = 'field__err'; f.appendChild(m); }
    m.textContent = msg;
  };
  const clearErrors = form => $$('.is-error', form).forEach(f => { f.classList.remove('is-error'); const m = f.querySelector('.field__err'); if (m) m.remove(); });

  const forms = {
    quick(f) {
      const fd = new FormData(f);
      Object.assign(state.common, { city: fd.get('city'), district: '', place: fd.get('place'), radius: fd.get('place') ? 5 : 0 });
      state.sf = Object.assign(defaultSF(), { priceMax: fd.get('budget'), sort: fd.get('place') ? 'distance' : 'rating' });
      location.hash = '#/schools';
    },
    auth(f) {
      clearErrors(f);
      const el = f.elements, fd = new FormData(f), name = fd.get('name').trim(), email = fd.get('email').trim(), phone = fd.get('phone').trim();
      let ok = true;
      if (name.length < 2) { fieldError(el['name'], 'Укажите имя'); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { fieldError(el['email'], 'Проверьте адрес почты'); ok = false; }
      if (phone.replace(/\D/g, '').length !== 11) { fieldError(el['phone'], 'Введите номер полностью'); ok = false; }
      if (!el['agree'].checked) { fieldError(el['agree'], 'Нужно согласие'); ok = false; }
      if (!ok) return;
      authDraft = { name, email, phone, code: String(1000 + Math.floor(Math.random() * 9000)) };
      toast(`SMS отправлено на ${esc(phone)}. Демо-код: <b>${authDraft.code}</b>`);
      router();
    },
    'auth-code'(f) {
      clearErrors(f);
      const code = f.elements['code'];
      if (code.value.trim() !== authDraft.code) { fieldError(code, 'Неверный код'); return; }
      const { name, email, phone } = authDraft;
      state.user = { name, email, phone, created: new Date().toISOString() };
      store.set('user', state.user);
      authDraft = null;
      updateHeader();
      toast(`${ic('check')} Аккаунт создан. Добро пожаловать, ${esc(name.split(' ')[0])}!`, 'is-ok');
      location.hash = '#' + (f.elements['next'].value || '/account');
    },
    checkout(f) {
      clearErrors(f);
      const fd = new FormData(f), t = tariffById(fd.get('tariff')), s = schoolById(t.schoolId);
      const needGroup = hasClassTheory(t) && s.groups.length > 0;
      if (needGroup && !fd.get('group')) { toast('Выберите группу теории', 'is-warn'); return; }
      const offer = f.elements['offer'];
      if (!offer.checked) { fieldError(offer, 'Подтвердите согласие с офертой'); return; }
      const method = fd.get('pay');
      const order = {
        id: 'IA-' + Date.now().toString(36).toUpperCase().slice(-6),
        tariffId: t.id, schoolId: s.id, groupId: needGroup ? fd.get('group') : null,
        method, amount: t.price, monthly: method === 'installment' ? t.price / t.inst : null,
        status: 'pending', created: new Date().toISOString(),
      };
      state.orders.unshift(order);
      saveOrders();
      location.hash = '#/pay/' + order.id;
    },
    chat(f) { const m = f.elements['m']; chatSend(m.value); m.value = ''; },
  };

  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    const fn = forms[f.dataset.form];
    if (fn) fn(f, e);
  });

  // маска телефона +7 (XXX) XXX-XX-XX
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.mask !== 'phone') return;
    let d = el.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    el.value = '+7' + (p[0] ? ` (${p[0]}` : '') + (p[0].length === 3 ? ')' : '') + (p[1] ? ` ${p[1]}` : '') + (p[2] ? `-${p[2]}` : '') + (p[3] ? `-${p[3]}` : '');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!$('#chatBox').hidden) chatToggle(false); actions['filters-close'] && $('#filters') && actions['filters-close'](); }
    if (!quiz || quiz.done || !$('#quiz')) return;
    if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) return;
    const q = QMAP[quiz.ids[quiz.cur]], n = parseInt(e.key, 10);
    if (n >= 1 && n <= q.a.length) answer(n - 1);
    else if (e.key === 'ArrowRight' && quiz.cur < quiz.ids.length - 1) { quiz.cur++; renderQuiz(); }
    else if (e.key === 'ArrowLeft' && quiz.cur > 0) { quiz.cur--; renderQuiz(); }
  });

  /* ================= router ================= */
  const routes = [
    [/^\/$/, viewHome],
    [/^\/schools$/, () => catalogView('schools')],
    [/^\/tariffs$/, () => catalogView('tariffs')],
    [/^\/school\/([\w-]+)$/, viewSchool],
    [/^\/tariff\/([\w-]+)$/, viewTariff],
    [/^\/compare$/, (q) => viewCompare(q)],
    [/^\/auth$/, (q) => viewAuth(q)],
    [/^\/checkout\/([\w-]+)$/, viewCheckout],
    [/^\/pay\/([\w-]+)$/, viewPay],
    [/^\/success\/([\w-]+)$/, viewSuccess],
    [/^\/account$/, viewAccount],
    [/^\/pdd$/, viewPdd],
    [/^\/pdd\/(ticket|topic)\/([\w-]+)$/, viewQuiz],
    [/^\/pdd\/(exam|marathon|mistakes)$/, m => viewQuiz(m)],
    [/^\/insurance$/, (q) => viewInsurance(q)],
    [/^\/materials$/, (q) => viewMaterials(q)],
    [/^\/materials\/([\w-]+)$/, viewArticle],
    [/^\/faq$/, viewFaq],
  ];

  function parseHash() {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = h.split('?');
    return { path: path || '/', query: Object.fromEntries(new URLSearchParams(qs || '')) };
  }

  function cleanup() {
    clearInterval(quizTimer);
    quizTimer = null;
    quiz = null;
    catalogKind = null;
    destroyMap();
    document.body.classList.remove('is-gateway', 'no-scroll');
    $('#header').classList.remove('is-open');
  }

  function router() {
    cleanup();
    const { path, query } = parseHash();
    let out = null;
    for (const [re, fn] of routes) {
      const m = path.match(re);
      if (m) { out = m.length > 1 ? fn(...m.slice(1), query) : fn(query); break; }
    }
    if (out === null) out = notFound();
    const { html, mount } = typeof out === 'string' ? { html: out } : out;
    const app = $('#app');
    app.innerHTML = html;
    if (mount) mount();
    window.scrollTo(0, 0);
    $$('[data-match]').forEach(a => a.classList.toggle('is-active', a.dataset.match.split(' ').some(m => path === m || path.startsWith(m.endsWith('/') ? m : m + '/') || path === m.replace(/\/$/, ''))));
    renderCompareBar();
    updateHeader();
  }

  function updateHeader() {
    const a = $('#hdrUser');
    if (state.user) { a.href = '#/account'; a.querySelector('span').textContent = state.user.name.split(' ')[0]; a.setAttribute('aria-label', 'Личный кабинет'); }
    else { a.href = '#/auth'; a.querySelector('span').textContent = 'Войти'; a.setAttribute('aria-label', 'Войти'); }
  }

  /* ================= init ================= */
  $$('[data-ic]').forEach(el => { el.outerHTML = ic(el.dataset.ic); });
  mountChat();
  window.addEventListener('hashchange', router);
  router();
})();
