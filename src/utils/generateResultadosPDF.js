import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

// ── Constants (mirrored from components — intentional duplication) ─────────────

const PAIRS = [
  [44, 67], [12, 23], [36, 60], [14, 81], [19, 98],
  [45, 99], [94, 102], [75, 79], [13, 92], [39, 83],
];

const INATTENTIVE = [
  { criterion: 'A1a', items: [47],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1b', items: [95],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1c', items: [35],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1d', items: [68, 79], mayBe: [],  indicated: [2, 3], rule: 'both'   },
  { criterion: 'A1e', items: [84],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1f', items: [28],     mayBe: [2], indicated: [3],    rule: 'single' },
  { criterion: 'A1g', items: [97],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1h', items: [101],    mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1i', items: [2],      mayBe: [],  indicated: [2, 3], rule: 'single' },
];

const HYPERACTIVE = [
  { criterion: 'A2a', items: [98],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2b', items: [93],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2c', items: [69, 99], mayBe: [1], indicated: [2, 3], rule: 'either' },
  { criterion: 'A2d', items: [71],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2e', items: [54, 45], mayBe: [1], indicated: [2, 3], rule: 'either' },
  { criterion: 'A2f', items: [3],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2g', items: [43],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2h', items: [61],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2i', items: [104],    mayBe: [],  indicated: [2, 3], rule: 'single' },
];

const CD_CRITERIA = [
  { criterion: 'A1',  item: 16,  mayBe: [1],  indicated: [2, 3]    },
  { criterion: 'A2',  item: 30,  mayBe: [1],  indicated: [2, 3]    },
  { criterion: 'A3',  item: 27,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A4',  item: 39,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A5',  item: 41,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A6',  item: 96,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A7',  item: 11,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A8',  item: 78,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A9',  item: 65,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A10', item: 89,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A11', item: 56,  mayBe: [],   indicated: [2, 3]    },
  { criterion: 'A12', item: 58,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A13', item: 91,  mayBe: [1],  indicated: [2, 3]    },
  { criterion: 'A14', item: 76,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A15', item: 6,   mayBe: [1],  indicated: [2, 3]    },
];

const ODD_CRITERIA = [
  { criterion: 'A1', item: 14,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A2', item: 73,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A3', item: 48,  mayBe: [1], indicated: [2, 3] },
  { criterion: 'A4', item: 102, mayBe: [],  indicated: [2, 3] },
  { criterion: 'A5', item: 94,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A6', item: 59,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A7', item: 21,  mayBe: [],  indicated: [2, 3] },
  { criterion: 'A8', item: 57,  mayBe: [1], indicated: [2, 3] },
];

const IMPAIRMENT_ITEMS = [
  { id: 106, label: 'Los problemas de su hijo afectan seriamente el trabajo escolar o las calificaciones.' },
  { id: 107, label: 'Los problemas de su hijo afectan seriamente las amistades y relaciones.' },
  { id: 108, label: 'Los problemas de su hijo afectan seriamente la vida en casa.' },
];

const IMPAIRMENT_LABELS = [
  'Nunca/No es verdad',
  'Un poco verdad/Ocasionalmente',
  'Bastante verdad/Frecuente',
  'Muy verdad/Muy frecuente',
];

const ADHD_ITEMS = [19, 35, 47, 67, 84, 88, 98, 99, 101, 104];

const TRANSPOSE = {
  19:  [0, 1, 2, 2],
  35:  [0, 0, 2, 2],
  47:  [0, 1, 2, 2],
  67:  [0, 1, 2, 2],
  84:  [0, 1, 2, 2],
  88:  [0, 0, 2, 2],
  98:  [0, 0, 2, 2],
  99:  [0, 1, 2, 2],
  101: [0, 1, 2, 2],
  104: [0, 1, 2, 2],
};

// Index = total transposed score (0-20)
const PROBABILITY = [11, 29, 41, 51, 56, 64, 71, 77, 82, 87, 91, 94, 97, 98, 99, 99, 99, 99, 99, 99, 99];

const ANXIETY_ITEMS = [
  { id: 4,   label: 'Preocupaciones' },
  { id: 20,  label: 'Dificultad para controlar preocupaciones' },
  { id: 70,  label: 'Nervioso o inquieto' },
  { id: 100, label: 'Irritable' },
];

const DEPRESSION_ITEMS = [
  { id: 17,  label: 'Sentimientos de inutilidad' },
  { id: 66,  label: 'Cansado; poca energía' },
  { id: 82,  label: 'Pérdida de interés o placer' },
  { id: 103, label: 'Triste, sombrío o irritable' },
];

const SEVERE_CONDUCT_ITEMS = [
  { id: 11, label: 'Sexo forzado' },
  { id: 27, label: 'Usa un arma' },
  { id: 41, label: 'Crueldad con animales' },
  { id: 78, label: 'Prender fuego' },
  { id: 89, label: 'Allanamiento de morada' },
  { id: 96, label: 'Robo con enfrentamiento' },
];

// ── isChecked helpers ─────────────────────────────────────────────────────────

const isDsm5Checked = (row, answers) => {
  const scores = row.items.map(id => getScore(answers, id));
  if (scores.some(s => s === null)) return false;
  const allValid = [...row.mayBe, ...row.indicated];
  if (row.rule === 'both') return scores.every(s => allValid.includes(s));
  return scores.some(s => allValid.includes(s));
};

const isCdChecked = (row, answers) => {
  const s = getScore(answers, row.item);
  if (s === null) return false;
  return [...row.mayBe, ...row.indicated].includes(s);
};

// ── PDF builder ───────────────────────────────────────────────────────────────

export function generateResultadosPDF({ answers, questions, age, patientName, testDate }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  let y = 15;

  // Adds a new page if less than `needed` mm remain on the current page.
  const ensureSpace = (needed = 25) => {
    if (y + needed > 278) {
      doc.addPage();
      y = 15;
    }
  };

  const sectionTitle = (text) => {
    ensureSpace(12);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(text, 14, y);
    y += 7;
  };

  const subTitle = (text) => {
    ensureSpace(8);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(text, 14, y);
    y += 5;
  };

  const bodyText = (text) => {
    ensureSpace(6);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(text, 14, y);
    y += 5;
  };

  // Renders an autoTable and advances y to just below it.
  const table = (head, body, opts = {}) => {
    ensureSpace(20);
    autoTable(doc, {
      startY: y,
      head,
      body,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 80, 120], textColor: 255, fontStyle: 'bold' },
      ...opts,
    });
    y = doc.lastAutoTable.finalY + 4;
  };

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Conners 3 - Reporte de Resultados', 105, y, { align: 'center' });
  y += 9;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Nombre: ' + (patientName || '-'), 14, y);
  doc.text('Edad: ' + (age !== null ? String(age) : '-'), 110, y);
  doc.text('Fecha: ' + (testDate || '-'), 155, y);
  y += 10;

  // ── 1. Inconsistency Index ──────────────────────────────────────────────────
  sectionTitle('1. Analisis de Estilo de Respuesta');
  subTitle('Indice de Inconsistencia');

  const pairData = PAIRS.map(([a, b]) => {
    const sa = getScore(answers, a);
    const sb = getScore(answers, b);
    const diff = (sa !== null && sb !== null) ? Math.abs(sa - sb) : null;
    return [String(a), sa !== null ? String(sa) : '-', String(b), sb !== null ? String(sb) : '-', diff !== null ? String(diff) : '-'];
  });

  table(
    [['Item A', 'Puntaje A', 'Item B', 'Puntaje B', 'Dif.']],
    pairData
  );

  const diffs = PAIRS
    .map(([a, b]) => {
      const sa = getScore(answers, a);
      const sb = getScore(answers, b);
      return (sa !== null && sb !== null) ? Math.abs(sa - sb) : null;
    })
    .filter(d => d !== null);

  const boxA = diffs.reduce((s, d) => s + d, 0);
  const boxB = diffs.filter(d => d === 2 || d === 3).length;
  const inconsistent = boxA >= 7 && boxB >= 2;

  bodyText('Total A: ' + boxA + '   |   Total B (difs. = 2 o 3): ' + boxB);
  bodyText(inconsistent
    ? '[!] Posible estilo de respuesta inconsistente indicado (A >= 7 y B >= 2)'
    : '[v] Sin indicacion de estilo de respuesta inconsistente');

  subTitle('Guias de Escala PI y NI');

  let piTotal = 0;
  let niTotal = 0;
  for (const [qId, val] of Object.entries(answers)) {
    const q = questions.find(q => q.id === Number(qId));
    if (!q) continue;
    const score = parseInt(val, 10) || 0;
    if (q.fields.includes('PI')) piTotal += score;
    if (q.fields.includes('NI')) niTotal += score;
  }

  table(
    [['Escala', 'Puntaje Bruto', 'Guia interpretativa']],
    [
      ['Impresion Positiva (PI)', String(piTotal),
        piTotal >= 5 ? '[!] Posible estilo de respuesta positiva indicado' : '-'],
      ['Impresion Negativa (NI)', String(niTotal),
        niTotal >= 5 ? '[!] Posible estilo de respuesta negativa indicado' : '-'],
    ]
  );

  // ── 2. DSM-5 ────────────────────────────────────────────────────────────────
  sectionTitle('2. Conteo de Sintomas DSM-5');
  subTitle('TDAH Inatento');

  const inRows = INATTENTIVE.map(row => {
    const scores = row.items.map(id => getScore(answers, id));
    const checked = isDsm5Checked(row, answers);
    return [
      row.criterion,
      row.items.join(' + '),
      scores.map(s => s !== null ? String(s) : '-').join(' / '),
      row.mayBe.join(', ') || '-',
      row.indicated.join(', '),
      checked ? '[v]' : '',
    ];
  });
  const inTotal = inRows.filter(r => r[5] === '[v]').length;

  table(
    [['Criterio', 'Item(s)', 'Puntaje', 'May be Ind.', 'Indicated', '[v]']],
    [
      ...inRows,
      [{ content: 'Total sintomas', colSpan: 5, styles: { fontStyle: 'bold' } }, String(inTotal)],
    ]
  );

  subTitle('TDAH Hiperactivo-Impulsivo');

  const hyRows = HYPERACTIVE.map(row => {
    const scores = row.items.map(id => getScore(answers, id));
    const checked = isDsm5Checked(row, answers);
    return [
      row.criterion,
      row.items.join(' + '),
      scores.map(s => s !== null ? String(s) : '-').join(' / '),
      row.mayBe.join(', ') || '-',
      row.indicated.join(', '),
      checked ? '[v]' : '',
    ];
  });
  const hyTotal = hyRows.filter(r => r[5] === '[v]').length;

  table(
    [['Criterio', 'Item(s)', 'Puntaje', 'May be Ind.', 'Indicated', '[v]']],
    [
      ...hyRows,
      [{ content: 'Total sintomas', colSpan: 5, styles: { fontStyle: 'bold' } }, String(hyTotal)],
    ]
  );

  if (age !== null) {
    const threshold = age <= 16 ? 6 : 5;
    const inMet  = inTotal >= threshold;
    const hyMet  = hyTotal >= threshold;
    bodyText('Inatento: ' + inTotal + '/' + threshold + ' - criterios ' + (inMet ? 'probablemente cumplidos' : 'probablemente no cumplidos') + '.');
    bodyText('Hiperactivo-Impulsivo: ' + hyTotal + '/' + threshold + ' - criterios ' + (hyMet ? 'probablemente cumplidos' : 'probablemente no cumplidos') + '.');
    if (inMet && hyMet) bodyText('TDAH Combinado: criterios probablemente cumplidos.');
  } else {
    bodyText('Ingrese la edad del paciente para ver si se cumplen los criterios de sintomas.');
  }

  // ── 3. Conduct Disorder ─────────────────────────────────────────────────────
  sectionTitle('3. Trastorno de Conducta y Negativismo Desafiante');
  subTitle('Trastorno de Conducta (TC)');

  const cdRows = CD_CRITERIA.map(row => {
    const s = getScore(answers, row.item);
    const checked = isCdChecked(row, answers);
    return [
      row.criterion, String(row.item),
      s !== null ? String(s) : '-',
      row.mayBe.join(', ') || '-',
      row.indicated.join(', '),
      checked ? '[v]' : '',
    ];
  });
  const cdTotal = cdRows.filter(r => r[5] === '[v]').length;

  table(
    [['Criterio', 'Item', 'Puntaje', 'May be Ind.', 'Indicated', '[v]']],
    [
      ...cdRows,
      [{ content: 'Total sintomas', colSpan: 5, styles: { fontStyle: 'bold' } }, String(cdTotal)],
    ]
  );
  bodyText('Criterios probablemente ' + (cdTotal >= 3 ? 'cumplidos' : 'no cumplidos') + ' (>= 3).');

  subTitle('Trastorno Negativista Desafiante (TND)');

  const oddRows = ODD_CRITERIA.map(row => {
    const s = getScore(answers, row.item);
    const checked = isCdChecked(row, answers);
    return [
      row.criterion, String(row.item),
      s !== null ? String(s) : '-',
      row.mayBe.join(', ') || '-',
      row.indicated.join(', '),
      checked ? '[v]' : '',
    ];
  });
  const oddTotal = oddRows.filter(r => r[5] === '[v]').length;

  table(
    [['Criterio', 'Item', 'Puntaje', 'May be Ind.', 'Indicated', '[v]']],
    [
      ...oddRows,
      [{ content: 'Total sintomas', colSpan: 5, styles: { fontStyle: 'bold' } }, String(oddTotal)],
    ]
  );
  bodyText('Criterios probablemente ' + (oddTotal >= 4 ? 'cumplidos' : 'no cumplidos') + ' (>= 4).');

  // ── 4. Impairment Items ─────────────────────────────────────────────────────
  sectionTitle('4. Deterioro Funcional');

  table(
    [['Item', 'Contenido', 'Puntaje', 'Descripcion']],
    IMPAIRMENT_ITEMS.map(({ id, label }) => {
      const score = getScore(answers, id);
      return [
        String(id), label,
        score !== null ? String(score) : '-',
        score !== null ? IMPAIRMENT_LABELS[score] : '-',
      ];
    }),
    { columnStyles: { 1: { cellWidth: 70 }, 3: { cellWidth: 52 } } }
  );

  // ── 5. ADHD Index ───────────────────────────────────────────────────────────
  sectionTitle('5. Indice TDAH de Conners 3');

  const adhdRows = ADHD_ITEMS.map(id => {
    const raw = answers[id] !== undefined ? parseInt(answers[id], 10) : null;
    const rule = TRANSPOSE[id];
    const transposed = raw !== null ? rule[raw] : null;
    return { id, raw, rule, transposed };
  });
  const allAnswered = adhdRows.every(r => r.transposed !== null);
  const adhdTotal   = allAnswered ? adhdRows.reduce((s, r) => s + r.transposed, 0) : null;
  const probability = adhdTotal !== null && adhdTotal <= 20 ? PROBABILITY[adhdTotal] : null;

  table(
    [[...ADHD_ITEMS.map(id => 'I.' + id), 'Total']],
    [
      [...adhdRows.map(r => r.raw !== null ? String(r.raw) : '-'), '-'],
      [...adhdRows.map(r => r.rule.map((v, i) => i + '>' + v).join(' ')), '-'],
      [...adhdRows.map(r => r.transposed !== null ? String(r.transposed) : '-'), adhdTotal !== null ? String(adhdTotal) : '-'],
    ],
    { styles: { fontSize: 7, cellPadding: 1.5 } }
  );

  if (adhdTotal !== null) {
    bodyText('Puntaje Total Transpuesto: ' + adhdTotal);
    bodyText('Probabilidad de clasificacion TDAH: ' + (probability !== null ? probability + '%' : '-'));
  } else {
    bodyText('Responda los items del Indice TDAH para calcular el puntaje total.');
  }

  // ── 6. Screener Items ───────────────────────────────────────────────────────
  sectionTitle('6. Items de Tamizaje y Conducta Grave');

  const screenerSection = (items, title, flagLabel) => {
    subTitle(title);
    const rows = items.map(({ id, label }) => {
      const score = getScore(answers, id);
      const flagged = score !== null && score >= 1;
      return [String(id), label, score !== null ? String(score) : '-', flagged ? '[v]' : ''];
    });
    const anyFlagged = rows.some(r => r[3] === '[v]');
    table(
      [['Item', 'Contenido', 'Puntaje', flagLabel]],
      rows,
      { columnStyles: { 1: { cellWidth: 95 } } }
    );
    if (anyFlagged) bodyText('[!] ' + flagLabel);
  };

  screenerSection(ANXIETY_ITEMS,        'Ansiedad',                        'Se recomienda investigacion adicional');
  screenerSection(DEPRESSION_ITEMS,     'Depresion',                       'Se recomienda investigacion adicional');
  screenerSection(SEVERE_CONDUCT_ITEMS, 'Items Criticos de Conducta Grave', 'Se recomienda atencion inmediata');

  // ── Save ────────────────────────────────────────────────────────────────────
  const safeName = (patientName || 'paciente')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip diacritics
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'paciente';
  const safeDate = testDate || new Date().toISOString().slice(0, 10);
  doc.save('conners3-resultados-' + safeName + '-' + safeDate + '.pdf');
}
