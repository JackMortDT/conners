import { useMemo } from 'react';

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

// DSM-5 ADHD Inattentive criteria (Conners 3 Parent scoring sheet)
const INATTENTIVE = [
  { criterion: 'A1a', items: [47],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1b', items: [95],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1c', items: [35],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1d', items: [68, 79],  mayBe: [],  indicated: [2, 3], rule: 'both'   },
  { criterion: 'A1e', items: [84],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1f', items: [28],      mayBe: [2], indicated: [3],    rule: 'single' },
  { criterion: 'A1g', items: [97],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1h', items: [101],     mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A1i', items: [2],       mayBe: [],  indicated: [2, 3], rule: 'single' },
];

// DSM-5 ADHD Hyperactive-Impulsive criteria
const HYPERACTIVE = [
  { criterion: 'A2a', items: [98],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2b', items: [93],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2c', items: [69, 99],  mayBe: [1], indicated: [2, 3], rule: 'either' },
  { criterion: 'A2d', items: [71],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2e', items: [54, 45],  mayBe: [1], indicated: [2, 3], rule: 'either' },
  { criterion: 'A2f', items: [3],       mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2g', items: [43],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2h', items: [61],      mayBe: [],  indicated: [2, 3], rule: 'single' },
  { criterion: 'A2i', items: [104],     mayBe: [],  indicated: [2, 3], rule: 'single' },
];

const isChecked = (row, answers) => {
  const scores = row.items.map(id => getScore(answers, id));
  if (scores.some(s => s === null)) return false;
  const allRequired = [...row.mayBe, ...row.indicated];
  if (row.rule === 'both') return scores.every(s => allRequired.includes(s));
  return scores.some(s => allRequired.includes(s));
};

const CriterionTable = ({ title, criteria, answers }) => {
  const rows = useMemo(() => criteria.map(row => {
    const scores = row.items.map(id => getScore(answers, id));
    const checked = isChecked(row, answers);
    return { ...row, scores, checked };
  }), [criteria, answers]);

  const total = rows.filter(r => r.checked).length;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#444' }}>{title}</h4>
      <div className="table-scroll">
      <table className="clinical-table">
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Ítem(s)</th>
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
              <td>{row.items.join(' + ')}</td>
              <td className="clinical-score-cell">
                {row.scores.map(s => s ?? '—').join(' / ')}
              </td>
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
    </div>
  );
};

const DSM5Counts = ({ answers, questions: _questions, age }) => {
  const inattentiveTotal = useMemo(
    () => INATTENTIVE.filter(r => isChecked(r, answers)).length,
    [answers]
  );
  const hyperactiveTotal = useMemo(
    () => HYPERACTIVE.filter(r => isChecked(r, answers)).length,
    [answers]
  );

  const threshold = age !== null ? (age <= 16 ? 6 : 5) : null;
  const inattentiveMet  = threshold !== null && inattentiveTotal  >= threshold;
  const hyperactiveMet  = threshold !== null && hyperactiveTotal  >= threshold;
  const combinedMet     = inattentiveMet && hyperactiveMet;

  return (
    <section className="clinical-section">
      <h3>Conteo de Síntomas DSM-5</h3>
      <div className="clinical-tables-row">
        <CriterionTable
          title="TDAH Inatento"
          criteria={INATTENTIVE}
          answers={answers}
        />
        <CriterionTable
          title="TDAH Hiperactivo-Impulsivo"
          criteria={HYPERACTIVE}
          answers={answers}
        />
      </div>

      <div style={{ marginTop: 12, fontSize: 13 }}>
        {age === null ? (
          <p className="clinical-threshold">
            Ingrese la edad del paciente para ver si se cumplen los criterios de síntomas.
          </p>
        ) : (
          <>
            <p className={`clinical-threshold ${inattentiveMet ? 'met' : ''}`}>
              Inatento: {inattentiveTotal}/{threshold} — criterios{' '}
              {inattentiveMet ? 'probablemente cumplidos' : 'probablemente no cumplidos'}.
            </p>
            <p className={`clinical-threshold ${hyperactiveMet ? 'met' : ''}`}>
              Hiperactivo-Impulsivo: {hyperactiveTotal}/{threshold} — criterios{' '}
              {hyperactiveMet ? 'probablemente cumplidos' : 'probablemente no cumplidos'}.
            </p>
            {combinedMet && (
              <p className="clinical-threshold met">
                TDAH Combinado: criterios probablemente cumplidos.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DSM5Counts;
