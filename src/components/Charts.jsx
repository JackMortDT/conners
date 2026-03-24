import { useMemo } from 'react';

const Charts = ({ fields, answers, questions }) => {
  const totals = useMemo(() => {
    const acc = fields.reduce((obj, f) => ({ ...obj, [f]: 0 }), {});
    for (const [qId, val] of Object.entries(answers)) {
      const q = questions.find(q => q.id === Number(qId));
      if (!q) continue;
      const score = parseInt(val, 10) || 0;
      q.fields.forEach(f => { if (acc[f] !== undefined) acc[f] += score; });
    }
    return acc;
  }, [fields, answers, questions]);

  // Max possible score per field: sum of max option per question that maps to that field
  const maxTotals = useMemo(() => {
    const acc = fields.reduce((obj, f) => ({ ...obj, [f]: 0 }), {});
    questions.forEach(q => {
      const maxOpt = Math.max(...q.options);
      q.fields.forEach(f => { if (acc[f] !== undefined) acc[f] += maxOpt; });
    });
    return acc;
  }, [fields, questions]);

  const globalMax = Math.max(...fields.map(f => maxTotals[f]), 1);

  return (
    <div className="charts-container">
      <h2 className="charts-title">Gráficas de Resultados</h2>
      <p className="charts-subtitle">
        Puntaje bruto por campo. La barra llena muestra el puntaje obtenido; el fondo muestra el máximo posible.
      </p>

      <div className="histogram">
        {fields.map(field => {
          const value = totals[field];
          const max = maxTotals[field] || 1;
          const fillPct = Math.round((value / max) * 100);

          return (
            <div key={field} className="histogram-bar-group">
              <span className="histogram-value">{value}</span>
              <div className="histogram-track" title={`${value} / ${max}`}>
                <div
                  className="histogram-fill"
                  style={{ height: `${(max / globalMax) * 100}%` }}
                >
                  <div
                    className="histogram-scored"
                    style={{ height: `${fillPct}%` }}
                  />
                </div>
              </div>
              <span className="histogram-label">{field}</span>
            </div>
          );
        })}
      </div>

      <div className="charts-legend">
        <span className="legend-item">
          <span className="legend-swatch legend-scored" /> Puntaje obtenido
        </span>
        <span className="legend-item">
          <span className="legend-swatch legend-max" /> Máximo posible
        </span>
      </div>
    </div>
  );
};

export default Charts;
