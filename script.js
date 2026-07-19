/* ==========================================================================
   Mirrativ チアランク早見表 — データ & ロジック
   ========================================================================== */

/* ---- ランク定義（開始レベル・終了レベル・階層カテゴリ・チアボーナス） ----
   tier / bonus は公式のランク一覧画像を参照
---------------------------------------------------------------------- */
const RANKS = [
  { name: null,                     short: 'ランク前',        start: 1,  end: 2,  tier: 'none',     bonus: null },
  { name: 'チアルーキー 1',          short: 'ルーキー 1',       start: 3,  end: 4,  tier: 'rookie1',  bonus: null },
  { name: 'チアルーキー 2',          short: 'ルーキー 2',       start: 5,  end: 9,  tier: 'rookie2',  bonus: null },
  { name: 'チアリーダー 1',          short: 'リーダー 1',       start: 10, end: 14, tier: 'leader1',  bonus: '6%' },
  { name: 'チアリーダー 2',          short: 'リーダー 2',       start: 15, end: 19, tier: 'leader2',  bonus: '8%' },
  { name: 'チアリーダー 3',          short: 'リーダー 3',       start: 20, end: 24, tier: 'leader3',  bonus: '10%' },
  { name: 'チアリーダー 4',          short: 'リーダー 4',       start: 25, end: 29, tier: 'leader4',  bonus: '12%' },
  { name: 'チアリーダー[ゴールド]',   short: 'ゴールド',         start: 30, end: 34, tier: 'gold',     bonus: '14%' },
  { name: 'チアリーダー[プラチナ]',   short: 'プラチナ',         start: 35, end: 39, tier: 'platinum', bonus: '16%' },
  { name: 'チアリーダー[ダイヤ]',     short: 'ダイヤ',           start: 40, end: 49, tier: 'diamond',  bonus: '18%' },
  { name: 'チアレジェンド',          short: 'レジェンド',       start: 50, end: 55, tier: 'legend',   bonus: '20%', openEnded: true },
];

/* 階層ごとのアイコン種別（公式アイコンに準拠: 王冠 / ダイヤ / 星 / メガホン） */
const TIER_ICON_TYPE = {
  none: null,
  rookie1: 'megaphone', rookie2: 'megaphone',
  leader1: 'star', leader2: 'star', leader3: 'star', leader4: 'star',
  gold: 'diamond', platinum: 'diamond', diamond: 'diamond',
  legend: 'crown',
};

/* ---- レベル別データ ----
   a: レベルアップ条件A（ギフト・コメント・視聴時間・視聴日数）
   b: レベルアップ条件B（ギフト・コメント・視聴時間）
   c: レベルアップ条件C（ギフトのみ）
   値が null のものはそのレベル・条件では対象外（未設定）
---------------------------------------------------------------- */
const LEVELS = [
  { level: 1,  a: { gift: null,   comment: 3,   time: '6分',      days: null }, b: { gift: 5,       comment: null, time: null }, c: { gift: null } },
  { level: 2,  a: { gift: 50,     comment: 4,   time: '30分',     days: null }, b: { gift: 100,     comment: null, time: null }, c: { gift: null } },
  { level: 3,  a: { gift: 100,    comment: 4,   time: '1時間',     days: '1日' }, b: { gift: 300,     comment: null, time: null }, c: { gift: null } },
  { level: 4,  a: { gift: 200,    comment: 6,   time: '2時間',     days: '1日' }, b: { gift: 500,     comment: null, time: null }, c: { gift: null } },
  { level: 5,  a: { gift: 400,    comment: 10,  time: '2時間30分', days: '2日' }, b: { gift: 800,     comment: 1,   time: '6分' },  c: { gift: null } },
  { level: 6,  a: { gift: 600,    comment: 15,  time: '3時間',     days: '2日' }, b: { gift: 1200,    comment: 2,   time: '18分' }, c: { gift: null } },
  { level: 7,  a: { gift: 800,    comment: 20,  time: '3時間30分', days: '3日' }, b: { gift: 1600,    comment: 3,   time: '30分' }, c: { gift: null } },
  { level: 8,  a: { gift: 1000,   comment: 25,  time: '4時間',     days: '3日' }, b: { gift: 2000,    comment: 4,   time: '48分' }, c: { gift: null } },
  { level: 9,  a: { gift: 1200,   comment: 35,  time: '4時間30分', days: '4日' }, b: { gift: 2500,    comment: 5,   time: '1時間30分' }, c: { gift: null } },
  { level: 10, a: { gift: 1500,   comment: 40,  time: '5時間',     days: '5日' }, b: { gift: 3000,    comment: 10,  time: '2時間' }, c: { gift: 5000 } },
  { level: 11, a: { gift: 1800,   comment: 45,  time: '5時間30分', days: '5日' }, b: { gift: 4000,    comment: 15,  time: '2時間12分' }, c: { gift: 6000 } },
  { level: 12, a: { gift: 2200,   comment: 50,  time: '6時間',     days: '5日' }, b: { gift: 5500,    comment: 20,  time: '2時間24分' }, c: { gift: 8250 } },
  { level: 13, a: { gift: 3000,   comment: 55,  time: '6時間30分', days: '6日' }, b: { gift: 7000,    comment: 25,  time: '2時間36分' }, c: { gift: 10500 } },
  { level: 14, a: { gift: 4000,   comment: 60,  time: '7時間',     days: '7日' }, b: { gift: 8500,    comment: 30,  time: '2時間48分' }, c: { gift: 12750 } },
  { level: 15, a: { gift: 5000,   comment: 70,  time: '7時間30分', days: '7日' }, b: { gift: 10000,   comment: 35,  time: '3時間' }, c: { gift: 15000 } },
  { level: 16, a: { gift: 6000,   comment: 80,  time: '8時間30分', days: '7日' }, b: { gift: 12000,   comment: 40,  time: '3時間12分' }, c: { gift: 18000 } },
  { level: 17, a: { gift: 7000,   comment: 90,  time: '9時間',     days: '8日' }, b: { gift: 14000,   comment: 45,  time: '3時間24分' }, c: { gift: 21000 } },
  { level: 18, a: { gift: 8000,   comment: 100, time: '9時間30分', days: '8日' }, b: { gift: 16000,   comment: 50,  time: '3時間36分' }, c: { gift: 24000 } },
  { level: 19, a: { gift: 9000,   comment: 110, time: '10時間',    days: '9日' }, b: { gift: 20000,   comment: 55,  time: '3時間48分' }, c: { gift: 30000 } },
  { level: 20, a: { gift: 10000,  comment: 120, time: '11時間',    days: '9日' }, b: { gift: 24000,   comment: 60,  time: '4時間' }, c: { gift: 36000 } },
  { level: 21, a: { gift: 12000,  comment: 130, time: '12時間',    days: '9日' }, b: { gift: 28000,   comment: 65,  time: '4時間12分' }, c: { gift: 42000 } },
  { level: 22, a: { gift: 14000,  comment: 140, time: '13時間',    days: '10日' }, b: { gift: 32000,  comment: 70,  time: '4時間24分' }, c: { gift: 48000 } },
  { level: 23, a: { gift: 16000,  comment: 150, time: '14時間',    days: '10日' }, b: { gift: 36000,  comment: 75,  time: '4時間36分' }, c: { gift: 54000 } },
  { level: 24, a: { gift: 18000,  comment: 160, time: '15時間',    days: '10日' }, b: { gift: 40000,  comment: 80,  time: '4時間48分' }, c: { gift: 60000 } },
  { level: 25, a: { gift: 20000,  comment: 170, time: '16時間',    days: '11日' }, b: { gift: 44000,  comment: 100, time: '5時間' }, c: { gift: 66000 } },
  { level: 26, a: { gift: 22500,  comment: 180, time: '17時間',    days: '11日' }, b: { gift: 50000,  comment: 100, time: '5時間24分' }, c: { gift: 76000 } },
  { level: 27, a: { gift: 25000,  comment: 190, time: '18時間',    days: '11日' }, b: { gift: 56000,  comment: 100, time: '5時間48分' }, c: { gift: 86000 } },
  { level: 28, a: { gift: 27500,  comment: 200, time: '19時間',    days: '12日' }, b: { gift: 62000,  comment: 100, time: '6時間12分' }, c: { gift: 96000 } },
  { level: 29, a: { gift: 30000,  comment: 210, time: '20時間',    days: '12日' }, b: { gift: 70000,  comment: 100, time: '6時間24分' }, c: { gift: 108000 } },
  { level: 30, a: { gift: 34000,  comment: 220, time: '21時間',    days: '12日' }, b: { gift: 78000,  comment: 100, time: '7時間12分' }, c: { gift: 120000 } },
  { level: 31, a: { gift: 38000,  comment: 230, time: '22時間',    days: '12日' }, b: { gift: 86000,  comment: 100, time: '7時間24分' }, c: { gift: 132000 } },
  { level: 32, a: { gift: 42000,  comment: 240, time: '24時間',    days: '13日' }, b: { gift: 94000,  comment: 100, time: '7時間36分' }, c: { gift: 144000 } },
  { level: 33, a: { gift: 46000,  comment: 250, time: '26時間',    days: '13日' }, b: { gift: 102000, comment: 100, time: '7時間48分' }, c: { gift: 156000 } },
  { level: 34, a: { gift: 50000,  comment: 260, time: '28時間',    days: '13日' }, b: { gift: 110000, comment: 100, time: '8時間' }, c: { gift: 170000 } },
  { level: 35, a: { gift: 55000,  comment: 270, time: '30時間',    days: '14日' }, b: { gift: 120000, comment: 100, time: '8時間12分' }, c: { gift: 185000 } },
  { level: 36, a: { gift: 60000,  comment: 280, time: '32時間',    days: '14日' }, b: { gift: 130000, comment: 100, time: '8時間24分' }, c: { gift: 200000 } },
  { level: 37, a: { gift: 65000,  comment: 290, time: '34時間',    days: '14日' }, b: { gift: 140000, comment: 100, time: '8時間48分' }, c: { gift: 220000 } },
  { level: 38, a: { gift: 70000,  comment: 300, time: '36時間',    days: '15日' }, b: { gift: 160000, comment: 100, time: '9時間12分' }, c: { gift: 240000 } },
  { level: 39, a: { gift: 75000,  comment: 320, time: '38時間',    days: '15日' }, b: { gift: 180000, comment: 100, time: '9時間36分' }, c: { gift: 270000 } },
  { level: 40, a: { gift: 80000,  comment: 340, time: '40時間',    days: '15日' }, b: { gift: 200000, comment: 100, time: '10時間' }, c: { gift: 300000 } },
  { level: 41, a: { gift: 100000, comment: 340, time: '40時間',    days: '15日' }, b: { gift: 220000, comment: 100, time: '10時間' }, c: { gift: 330000 } },
  { level: 42, a: { gift: 120000, comment: 340, time: '40時間',    days: '15日' }, b: { gift: 240000, comment: 100, time: '10時間' }, c: { gift: 360000 } },
  { level: 43, a: { gift: 140000, comment: 340, time: '40時間',    days: '15日' }, b: { gift: 260000, comment: 100, time: '10時間' }, c: { gift: 400000 } },
  { level: 44, a: { gift: 160000, comment: 340, time: '40時間',    days: '15日' }, b: { gift: 300000, comment: 100, time: '10時間' }, c: { gift: 440000 } },
  { level: 45, a: { gift: 200000, comment: 340, time: '40時間',    days: '15日' }, b: { gift: 350000, comment: 100, time: '10時間' }, c: { gift: 500000 } },
  { level: 46, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 450000,  comment: 100, time: '10時間' }, c: { gift: 620000 } },
  { level: 47, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 550000,  comment: 100, time: '10時間' }, c: { gift: 740000 } },
  { level: 48, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 700000,  comment: 100, time: '10時間' }, c: { gift: 900000 } },
  { level: 49, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 850000,  comment: 100, time: '10時間' }, c: { gift: 1060000 } },
  { level: 50, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 1000000, comment: 100, time: '10時間' }, c: { gift: 1250000 } },
  { level: 51, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 1150000, comment: 100, time: '10時間' }, c: { gift: 1400000 } },
  { level: 52, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 1400000, comment: 100, time: '10時間' }, c: { gift: 1650000 } },
  { level: 53, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 1650000, comment: 100, time: '10時間' }, c: { gift: 1900000 } },
  { level: 54, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 2000000, comment: 100, time: '10時間' }, c: { gift: 2250000 } },
  { level: 55, a: { gift: null,   comment: null, time: null,      days: null }, b: { gift: 2450000, comment: 100, time: '10時間' }, c: { gift: 2700000 } },
];

/* ---- ユーティリティ ---- */
function formatNumber(n) {
  return n.toLocaleString('ja-JP');
}

function getRankForLevel(level) {
  return RANKS.find(r => level >= r.start && level <= r.end) || null;
}

function getLevelData(level) {
  return LEVELS.find(l => l.level === level) || null;
}

/* アイコン（線画・統一スタイル） */
const ICONS = {
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 8.2v7.6M8.7 10.1c0-1.1 1-1.9 2.2-1.9 1.3 0 2.3.7 2.3 1.7 0 2.3-4.5 1.6-4.5 3.9 0 1 1 1.8 2.3 1.8 1.2 0 2.2-.8 2.2-1.9"/></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5h16v10.5H9.8L5.5 19.5V16H4z"/></svg>',
  time: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/></svg>',
  days: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="14" rx="1.8"/><path d="M4 9.5h16M8 3.5v3.5M16 3.5v3.5"/><path d="M9 13.3l2 2 4-4.2"/></svg>',
};

const METRIC_LABEL = { gift: 'ギフト', comment: 'コメント', time: '視聴時間', days: '視聴日数' };
const METRIC_UNIT  = { gift: 'コイン以上', comment: '件以上' };

/* 早見表 — 条件ごとに表示する指標の並びと見出し文言 */
const COND_METRICS = {
  a: ['gift', 'comment', 'time', 'days'],
  b: ['gift', 'comment', 'time'],
  c: ['gift'],
};
const COND_LABEL = {
  a: 'レベルアップ条件A',
  b: 'レベルアップ条件B',
  c: 'レベルアップ条件C',
};

/* ランクバッジ用アイコン（公式アイコンの意匠を線画で再構成） */
const TIER_ICONS = {
  crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 2.2L12 5l5.5 5.7 3-2.2-1.6 9H5.1z"/><path d="M6 18.5h12"/></svg>',
  diamond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h16L12 20 4 9.5z"/><path d="M8 9.5L12 4l4 5.5M4 9.5l4 0M16 9.5l4 0M9.3 9.5L12 20M14.7 9.5L12 20"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.2l2.4 5 5.4.6-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.6z"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10v4h3l6 4V6l-6 4z"/><path d="M16 9.2a3.2 3.2 0 010 5.6M18.4 7a6.4 6.4 0 010 10"/></svg>',
};

/* 条件オブジェクトから、値のある指標だけを配列で返す */
function buildMetricRows(cond) {
  const order = ['gift', 'comment', 'time', 'days'];
  const rows = [];
  order.forEach(key => {
    if (!(key in cond)) return;
    const val = cond[key];
    if (val === null || val === undefined) return;
    let display;
    if (key === 'gift') display = formatNumber(val) + ' ' + METRIC_UNIT.gift;
    else if (key === 'comment') display = formatNumber(val) + ' ' + METRIC_UNIT.comment;
    else display = val + '以上';
    rows.push({ key, label: METRIC_LABEL[key], display, icon: ICONS[key] });
  });
  return rows;
}

/* 指定レベルの条件A/B/Cのうち、有効なものだけをラベル付きで返す */
function getAvailableConditions(levelData) {
  const conds = [];
  if (levelData.a && buildMetricRows(levelData.a).length) conds.push({ id: 'A', rows: buildMetricRows(levelData.a) });
  if (levelData.b && buildMetricRows(levelData.b).length) conds.push({ id: 'B', rows: buildMetricRows(levelData.b) });
  if (levelData.c && buildMetricRows(levelData.c).length) conds.push({ id: 'C', rows: buildMetricRows(levelData.c) });
  return conds;
}

/* ==========================================================================
   レンダリング — ランク階段（ヒーロー内シグネチャー要素）
   ========================================================================== */
function renderLadder() {
  const track = document.getElementById('ladderTrack');
  const named = RANKS.filter(r => r.name);
  track.innerHTML = named.map(r => {
    const iconType = TIER_ICON_TYPE[r.tier];
    const icon = iconType ? `<span class="ladder-badge__icon">${TIER_ICONS[iconType]}</span>` : '';
    return `
    <button class="ladder-badge tier-${r.tier}" data-rank="${r.name}" type="button">
      ${icon}
      <span class="ladder-badge__name">${r.short}</span>
      <span class="ladder-badge__range">Lv.${r.start}${r.openEnded ? '〜' : '–' + r.end}</span>
      ${r.bonus ? `<span class="ladder-badge__bonus">ボーナス ${r.bonus}</span>` : ''}
    </button>
  `;
  }).join('');

  track.querySelectorAll('.ladder-badge').forEach(btn => {
    btn.addEventListener('click', () => {
      const rankName = btn.getAttribute('data-rank');
      setMode('rank');
      document.getElementById('rankSelect').value = rankName;
      handleRankSearch();
      document.getElementById('search').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ==========================================================================
   レンダリング — 全レベル早見表
   ========================================================================== */
/* 選択中の条件（a/b/c）の見出し行を生成 */
function renderTableHead(condId) {
  const metrics = COND_METRICS[condId];
  const thead = document.getElementById('tableHead');
  thead.innerHTML = `
    <tr>
      <th class="col-lv" rowspan="2" scope="col">Lv</th>
      <th class="group-${condId}" colspan="${metrics.length}" scope="colgroup">${COND_LABEL[condId]}</th>
    </tr>
    <tr>
      ${metrics.map(k => `<th class="group-${condId}" scope="col">${METRIC_LABEL[k]}</th>`).join('')}
    </tr>
  `;
}

/* 選択中の条件（a/b/c）のみを表示するテーブル本体を生成 */
function renderTable(condId) {
  renderTableHead(condId);
  const metrics = COND_METRICS[condId];
  const tbody = document.getElementById('tableBody');
  const rowsHtml = [];

  RANKS.forEach(rankBlock => {
    for (let lv = rankBlock.start; lv <= rankBlock.end; lv++) {
      const d = getLevelData(lv);
      const cells = metrics.map(k => tableCell(d[condId], k, condId)).join('');

      rowsHtml.push(`
        <tr id="row-lv-${lv}" data-level="${lv}" class="tier-${rankBlock.tier}">
          <td class="lv-cell">${lv}</td>
          ${cells}
        </tr>
      `);
    }
  });

  tbody.innerHTML = rowsHtml.join('');
}

function tableCell(cond, key, group) {
  const val = cond ? cond[key] : null;
  const cls = `group-${group}` + (val === null || val === undefined ? ' na' : '');
  if (val === null || val === undefined) return `<td class="${cls}">ー</td>`;
  if (key === 'gift' || key === 'comment') return `<td class="${cls}">${formatNumber(val)}</td>`;
  return `<td class="${cls}">${val}</td>`;
}

/* ==========================================================================
   検索ツール
   ========================================================================== */
function setMode(mode) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('is-active', b.dataset.mode === mode));
  document.getElementById('rankPane').hidden = mode !== 'rank';
  document.getElementById('levelPane').hidden = mode !== 'level';
}

function renderResult({ heading, rankChip, levelData, note }) {
  const el = document.getElementById('resultArea');
  const conds = getAvailableConditions(levelData);

  const condCards = conds.map(c => `
    <div class="cond-card cond-${c.id}">
      <div class="cond-card__head">
        <span class="cond-card__badge">条件${c.id}</span>
      </div>
      <ul class="cond-card__list">
        ${c.rows.map(r => `
          <li>
            <span class="metric-icon">${r.icon}</span>
            <span class="metric-label">${r.label}</span>
            <span class="metric-value">${r.display}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('<div class="cond-or">または</div>');

  el.innerHTML = `
    <div class="result-head">
      <h3>${heading}</h3>
      ${rankChip ? `<span class="rank-chip tier-${rankChip.tier}">${rankChip.label}</span>` : ''}
    </div>
    ${rankChip && rankChip.bonus ? `<p class="result-bonus">チアボーナス <strong>${rankChip.bonus}</strong></p>` : ''}
    ${note ? `<p class="result-note">${note}</p>` : ''}
    <div class="cond-cards">${condCards || '<p class="result-note">このレベルの条件データはありません。</p>'}</div>
  `;
  el.hidden = false;
}

function handleLevelSearch() {
  const input = document.getElementById('levelInput');
  let lv = parseInt(input.value, 10);
  if (isNaN(lv)) return;
  lv = Math.min(55, Math.max(1, lv));
  input.value = lv;

  const d = getLevelData(lv);
  const rank = getRankForLevel(lv);
  renderResult({
    heading: `レベル ${lv} の到達条件`,
    rankChip: rank && rank.name ? { label: rank.name, tier: rank.tier, bonus: rank.bonus } : { label: 'ランク前', tier: 'none', bonus: null },
    levelData: d,
    note: '条件A・B・Cのいずれか1つを満たせばレベルアップします。',
  });
}

function handleRankSearch() {
  const select = document.getElementById('rankSelect');
  const rankName = select.value;
  const rank = RANKS.find(r => r.name === rankName);
  if (!rank) return;
  const d = getLevelData(rank.start);

  renderResult({
    heading: `${rank.name} の獲得条件（Lv.${rank.start}）`,
    rankChip: { label: `Lv.${rank.start}${rank.openEnded ? '〜' : '–' + rank.end}`, tier: rank.tier, bonus: rank.bonus },
    levelData: d,
    note: `レベル${rank.start}に到達すると「${rank.name}」が付与されます。条件A・B・Cのいずれか1つを満たせばレベルアップします。`,
  });
  document.getElementById('levelInput').value = rank.start;
}

function initSearch() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });

  const rankSelect = document.getElementById('rankSelect');
  rankSelect.innerHTML = RANKS.filter(r => r.name).map(r => `<option value="${r.name}">${r.name}</option>`).join('');
  rankSelect.addEventListener('change', handleRankSearch);

  const levelInput = document.getElementById('levelInput');
  levelInput.addEventListener('input', handleLevelSearch);

  document.getElementById('levelDown').addEventListener('click', () => {
    levelInput.value = Math.max(1, (parseInt(levelInput.value, 10) || 1) - 1);
    handleLevelSearch();
  });
  document.getElementById('levelUp').addEventListener('click', () => {
    levelInput.value = Math.min(55, (parseInt(levelInput.value, 10) || 1) + 1);
    handleLevelSearch();
  });

  setMode('rank');
  rankSelect.value = 'チアリーダー 1';
  handleRankSearch();
}

/* ==========================================================================
   表示する条件（A/B/C）の切り替え — 単一選択
   ========================================================================== */
function initColumnToggle() {
  const buttons = document.querySelectorAll('.col-toggle__btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      buttons.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-checked', String(b === btn));
      });
      renderTable(btn.dataset.col);
    });
  });
}

/* ==========================================================================
   初期化
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderLadder();
  renderTable('a');
  initSearch();
  initColumnToggle();
});
