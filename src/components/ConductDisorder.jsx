import { useMemo } from 'react';

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

// Conduct Disorder criteria (Conners 3 Parent)
const CD_CRITERIA = [
  { criterion: 'A1',  item: 16,  mayBe: [1],  indicated: [2, 3] },
  { criterion: 'A2',  item: 30,  mayBe: [1],  indicated: [2, 3] },
  { criterion: 'A3',  item: 27,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A4',  item: 39,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A5',  item: 41,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A6',  item: 96,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A7',  item: 11,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A8',  item: 78,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A9',  item: 65,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A10', item: 89,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A11', item: 56,  mayBe: [],   indicated: [2, 3] },
  { criterion: 'A12', item: 58,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A13', item: 91,  mayBe: [1],  indicated: [2, 3] },
  { criterion: 'A14', item: 76,  mayBe: [],   indicated: [1, 2, 3] },
  { criterion: 'A15', item: 6,   mayBe: [1],  indicated: [2, 3] },
];

// Oppositional Defiant Disorder criteria (Conners 3 Parent)
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

const isChecked = (row, answers) => {
  const s = getScore(answers, row.item);
  if (s === null) return false;
  return [...row.mayBe, ...row.indicated].includes(s);
};

const DisorderTable = ({ title, criteria, threshold, answers }) => {
  const rows = useMemo(
    () => criteria.map(row => ({ ...row, score: getScore(answers, row.item), checked: isChecked(row, answers) })),
    [criteria, answers]
  );
  const total = rows.filter(r => r.checked).length;
  const met   = total >= threshold;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#444' }}>{title}</h4>
      <div className="table-scroll">
      <table className="clinical-table">
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Ítem</th>
            <th>Puntaje</th>
            <th>May be Ind.</th>
            <th>Indicated</th>
            <th>✓</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.criterion} className={row.checked ? 'clinical-row-flagged' : ''}>
              <td>{row.criterion}</td>
              <td>{row.item}</td>
              <td className="clinical-score-cell">{row.score ?? '—'}</td>
              <td>{row.mayBe.join(', ') || '—'}</td>
              <td>{row.indicated.join(', ')}</td>
              <td className="clinical-flag-cell">{row.checked ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="clinical-total-row">
            <td colSpan={5}>Total síntomas</td>
            <td>{total}</td>
          </tr>
        </tfoot>
      </table>
      </div>
      <p className={`clinical-threshold ${met ? 'met' : ''}`}>
        Criterios probablemente {met ? 'cumplidos' : 'no cumplidos'} (≥ {threshold}).
      </p>
    </div>
  );
};

const ConductDisorder = ({ answers }) => (
  <section className="clinical-section">
    <h3>Trastorno de Conducta y Negativismo Desafiante</h3>
    <div className="clinical-tables-row">
      <DisorderTable
        title="Trastorno de Conducta (TC)"
        criteria={CD_CRITERIA}
        threshold={3}
        answers={answers}
      />
      <DisorderTable
        title="Trastorno Negativista Desafiante (TND)"
        criteria={ODD_CRITERIA}
        threshold={4}
        answers={answers}
      />
    </div>
  </section>
);

export default ConductDisorder;
