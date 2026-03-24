import { useMemo } from 'react';

// Pairs as defined in the instrument's Response Style Analysis sheet
const PAIRS = [
  [97, 100],
  [42, 63],
  [4,  77],
  [7,  13],
  [26, 29],
  [35, 105],
  [25, 57],
  [23, 44],
  [34, 89],
  [47, 71],
];

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

const InconsistencyIndex = ({ answers, questions }) => {
  const { pairs, boxA, boxB, piTotal, niTotal } = useMemo(() => {
    const pairs = PAIRS.map(([a, b]) => {
      const sa = getScore(answers, a);
      const sb = getScore(answers, b);
      const diff = (sa !== null && sb !== null) ? Math.abs(sa - sb) : null;
      return { a, b, sa, sb, diff };
    });

    const answered = pairs.filter(p => p.diff !== null);
    const boxA = answered.reduce((sum, p) => sum + p.diff, 0);
    const boxB = answered.filter(p => p.diff === 2 || p.diff === 3).length;

    // PI1 and NI1 totals from all answers
    let piTotal = 0;
    let niTotal = 0;
    for (const [qId, val] of Object.entries(answers)) {
      const q = questions.find(q => q.id === Number(qId));
      if (!q) continue;
      const score = parseInt(val, 10) || 0;
      if (q.fields.includes('PI1')) piTotal += score;
      if (q.fields.includes('NI1')) niTotal += score;
    }

    return { pairs, boxA, boxB, piTotal, niTotal };
  }, [answers, questions]);

  const inconsistent = boxA >= 6 && boxB >= 2;

  return (
    <div className="inconsistency-container">
      <h2 className="inconsistency-title">Análisis de Estilo de Respuesta</h2>

      <section className="inconsistency-section">
        <h3>Índice de Inconsistencia</h3>
        <p className="inconsistency-instructions">
          Para cada par, se muestra la diferencia absoluta entre los ítems.
          Se suman las diferencias para obtener el Total A y se cuenta cuántas son 2 o 3 (B).
        </p>

        <div className="inconsistency-pairs">
          {pairs.map(({ a, b, sa, sb, diff }) => (
            <div key={`${a}-${b}`} className="inconsistency-pair">
              <div className="pair-items">
                <span className="pair-label">Ítem {a}</span>
                <span className="pair-score">{sa ?? '—'}</span>
              </div>
              <div className="pair-items">
                <span className="pair-label">Ítem {b}</span>
                <span className="pair-score">{sb ?? '—'}</span>
              </div>
              <div className="pair-diff">
                <span className="pair-diff-label">Dif.</span>
                <span className={`pair-diff-value ${diff === 2 || diff === 3 ? 'diff-high' : ''}`}>
                  {diff ?? '—'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="inconsistency-totals">
          <div className="inconsistency-box">
            <span className="box-label">Total A</span>
            <span className="box-value">{boxA}</span>
          </div>
          <div className="inconsistency-box">
            <span className="box-label">Total B</span>
            <span className="box-value">{boxB}</span>
            <span className="box-note">(difs. = 2 o 3)</span>
          </div>
          <div className={`inconsistency-alert ${inconsistent ? 'alert-active' : 'alert-inactive'}`}>
            {inconsistent
              ? '⚠ Posible estilo de respuesta inconsistente indicado (A ≥ 6 y B ≥ 2)'
              : '✓ Sin indicación de estilo de respuesta inconsistente'}
          </div>
        </div>
      </section>

      <section className="inconsistency-section">
        <h3>Guías de Escala PI y NI</h3>
        <table className="pi-ni-table">
          <thead>
            <tr>
              <th>Escala</th>
              <th>Puntaje bruto</th>
              <th>Guía interpretativa</th>
            </tr>
          </thead>
          <tbody>
            <tr className={piTotal >= 5 ? 'guideline-flagged' : ''}>
              <td>Impresión Positiva (PI)</td>
              <td className="pi-ni-score">{piTotal}</td>
              <td>
                {piTotal >= 5
                  ? '⚠ Posible estilo de respuesta positiva indicado'
                  : '—'}
              </td>
            </tr>
            <tr className={niTotal >= 5 ? 'guideline-flagged' : ''}>
              <td>Impresión Negativa (NI)</td>
              <td className="pi-ni-score">{niTotal}</td>
              <td>
                {niTotal >= 5
                  ? '⚠ Posible estilo de respuesta negativa indicado'
                  : '—'}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="pi-ni-note">
          Puntaje bruto ≥ 5 en PI o NI sugiere revisar el estilo de respuesta.
        </p>
      </section>
    </div>
  );
};

export default InconsistencyIndex;
