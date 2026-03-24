import { useMemo, useRef } from 'react';

// SVG dimensions
const SVG_WIDTH  = 840;
const SVG_HEIGHT = 320;
const PAD_LEFT   = 40;
const PAD_RIGHT  = 20;
const PAD_TOP    = 30;
const PAD_BOTTOM = 40;
const CHART_W    = SVG_WIDTH  - PAD_LEFT - PAD_RIGHT;
const CHART_H    = SVG_HEIGHT - PAD_TOP  - PAD_BOTTOM;

const Charts = ({ fields, answers, questions }) => {
  const svgRef = useRef(null);

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

  const maxTotals = useMemo(() => {
    const acc = fields.reduce((obj, f) => ({ ...obj, [f]: 0 }), {});
    questions.forEach(q => {
      const maxOpt = Math.max(...q.options);
      q.fields.forEach(f => { if (acc[f] !== undefined) acc[f] += maxOpt; });
    });
    return acc;
  }, [fields, questions]);

  const globalMax = Math.max(...fields.map(f => maxTotals[f]), 1);

  const barWidth  = CHART_W / fields.length;
  const barPad    = barWidth * 0.18;

  const handleDownload = () => {
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'conners-graficas.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="charts-container">
      <div className="charts-header">
        <div>
          <h2 className="charts-title">Gráficas de Resultados</h2>
          <p className="charts-subtitle">
            Puntaje bruto por campo. Barra azul = obtenido; gris = máximo posible.
          </p>
        </div>
        <button className="charts-download-btn" onClick={handleDownload}>
          ↓ Descargar SVG
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="histogram-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Y-axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = PAD_TOP + CHART_H * (1 - frac);
          return (
            <g key={frac}>
              <line
                x1={PAD_LEFT} y1={y}
                x2={PAD_LEFT + CHART_W} y2={y}
                stroke="#e0e0e0" strokeWidth="1"
              />
              <text
                x={PAD_LEFT - 6} y={y + 4}
                textAnchor="end"
                fontSize="11" fill="#aaa"
              >
                {Math.round(globalMax * frac)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {fields.map((field, i) => {
          const value  = totals[field];
          const max    = maxTotals[field] || 1;
          const x      = PAD_LEFT + i * barWidth + barPad;
          const bw     = barWidth - barPad * 2;

          const maxBarH    = (max / globalMax) * CHART_H;
          const scoredBarH = (value / globalMax) * CHART_H;
          const maxBarY    = PAD_TOP + CHART_H - maxBarH;
          const scoredBarY = PAD_TOP + CHART_H - scoredBarH;

          return (
            <g key={field}>
              {/* Max possible bar (background) */}
              <rect
                x={x} y={maxBarY}
                width={bw} height={maxBarH}
                fill="#e0e0e0" rx="3"
              />
              {/* Scored bar */}
              {scoredBarH > 0 && (
                <rect
                  x={x} y={scoredBarY}
                  width={bw} height={scoredBarH}
                  fill="#007bff" rx="3"
                />
              )}
              {/* Value label */}
              <text
                x={x + bw / 2}
                y={scoredBarH > 0 ? scoredBarY - 4 : PAD_TOP + CHART_H - 4}
                textAnchor="middle"
                fontSize="11" fontWeight="bold" fill="#333"
              >
                {value}
              </text>
              {/* Field label */}
              <text
                x={x + bw / 2}
                y={PAD_TOP + CHART_H + 20}
                textAnchor="middle"
                fontSize="11" fill="#666"
              >
                {field}
              </text>
            </g>
          );
        })}

        {/* X axis */}
        <line
          x1={PAD_LEFT} y1={PAD_TOP + CHART_H}
          x2={PAD_LEFT + CHART_W} y2={PAD_TOP + CHART_H}
          stroke="#ccc" strokeWidth="1"
        />
      </svg>

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
