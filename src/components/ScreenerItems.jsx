import { useMemo } from 'react';

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

const getScore = (answers, id) => {
  const v = answers[id];
  return v !== undefined ? parseInt(v, 10) : null;
};

const ScreenerTable = ({ title, items, flagLabel, answers }) => {
  const rows = useMemo(
    () => items.map(it => ({ ...it, score: getScore(answers, it.id) })),
    [items, answers]
  );
  const anyFlagged = rows.some(r => r.score !== null && r.score >= 1);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#444' }}>{title}</h4>
      <div className="table-scroll">
      <table className="clinical-table">
        <thead>
          <tr>
            <th>Ítem</th>
            <th>Contenido</th>
            <th>Puntaje</th>
            <th>{flagLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const flagged = row.score !== null && row.score >= 1;
            return (
              <tr key={row.id} className={flagged ? 'clinical-row-attention' : ''}>
                <td>{row.id}</td>
                <td style={{ textAlign: 'left' }}>{row.label}</td>
                <td className="clinical-score-cell">{row.score ?? '—'}</td>
                <td className={flagged ? 'clinical-attention-cell' : ''}>
                  {flagged ? '✓' : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      {anyFlagged && (
        <p className="clinical-threshold met" style={{ marginTop: 6 }}>
          ⚠ {flagLabel}
        </p>
      )}
    </div>
  );
};

const ScreenerItems = ({ answers }) => (
  <section className="clinical-section">
    <h3>Ítems de Tamizaje y Conducta Grave</h3>
    <div className="clinical-tables-row" style={{ marginBottom: 24 }}>
      <ScreenerTable
        title="Ansiedad"
        items={ANXIETY_ITEMS}
        flagLabel="Se recomienda investigación adicional"
        answers={answers}
      />
      <ScreenerTable
        title="Depresión"
        items={DEPRESSION_ITEMS}
        flagLabel="Se recomienda investigación adicional"
        answers={answers}
      />
    </div>
    <ScreenerTable
      title="Ítems Críticos de Conducta Grave"
      items={SEVERE_CONDUCT_ITEMS}
      flagLabel="Se recomienda atención inmediata"
      answers={answers}
    />
  </section>
);

export default ScreenerItems;
