import { useMemo } from 'react';

// Transposing rule: maps raw score (index) → transposed score (value)
// Verified against Conners 3 Parent ADHD Index sheet
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

const ITEMS = [19, 35, 47, 67, 84, 88, 98, 99, 101, 104];

// Probability lookup: index = total transposed score (0–20)
const PROBABILITY = [11, 29, 41, 51, 56, 64, 71, 77, 82, 87, 91, 94, 97, 98, 99, 99, 99, 99, 99, 99, 99];

const ADHDIndex = ({ answers }) => {
  const rows = useMemo(() => ITEMS.map(id => {
    const raw = answers[id] !== undefined ? parseInt(answers[id], 10) : null;
    const rule = TRANSPOSE[id];
    const transposed = raw !== null ? rule[raw] : null;
    return { id, raw, rule, transposed };
  }), [answers]);

  const allAnswered = rows.every(r => r.transposed !== null);
  const total = allAnswered ? rows.reduce((sum, r) => sum + r.transposed, 0) : null;
  const probability = total !== null && total <= 20 ? PROBABILITY[total] : null;

  return (
    <section className="clinical-section">
      <h3>Índice TDAH de Conners 3</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="clinical-table" style={{ minWidth: 640 }}>
          <thead>
            <tr>
              {ITEMS.map(id => <th key={id}>Ítem {id}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {rows.map(r => (
                <td key={r.id} className="clinical-score-cell">{r.raw ?? '—'}</td>
              ))}
              <td>—</td>
            </tr>
            <tr style={{ fontSize: 11, color: '#888' }}>
              {rows.map(r => (
                <td key={r.id}>
                  {r.rule.map((v, i) => `${i}→${v}`).join(', ')}
                </td>
              ))}
              <td>—</td>
            </tr>
            <tr className="clinical-total-row">
              {rows.map(r => (
                <td key={r.id} className="clinical-score-cell">{r.transposed ?? '—'}</td>
              ))}
              <td className="clinical-score-cell">{total ?? '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {total !== null && (
        <div style={{ marginTop: 12, fontSize: 14 }}>
          <p>
            <strong>Puntaje Total Transpuesto:</strong> {total}
          </p>
          <p>
            <strong>Probabilidad de clasificación TDAH:</strong>{' '}
            {probability !== null ? `${probability}%` : '—'}
          </p>
        </div>
      )}
      {!allAnswered && (
        <p className="clinical-threshold">
          Responda los ítems 19, 35, 47, 67, 84, 88, 98, 99, 101 y 104 para calcular el índice.
        </p>
      )}
    </section>
  );
};

export default ADHDIndex;
