import { useState } from 'react';
import InconsistencyIndex from './InconsistencyIndex';
import DSM5Counts from './DSM5Counts';
import ConductDisorder from './ConductDisorder';
import ImpairmentItems from './ImpairmentItems';
import ADHDIndex from './ADHDIndex';
import ScreenerItems from './ScreenerItems';
import { generateResultadosPDF } from '../utils/generateResultadosPDF';

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="collapsible">
      <button className="collapsible-header" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span className="collapsible-chevron">{open ? '▼' : '▶'}</span>
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
};

const AnalisisResultados = ({ answers, questions, age, activeTest, patientName, testDate }) => (
  <div className="analisis-resultados-container">
    <div className="analisis-resultados-header">
      <h2 className="analisis-resultados-title">Análisis de Resultados</h2>
      {activeTest === 'conners-parents' && (
        <button
          className="pdf-download-btn"
          onClick={() => generateResultadosPDF({ answers, questions, age, patientName, testDate })}
        >
          Descargar PDF
        </button>
      )}
    </div>

    <CollapsibleSection title="Análisis de Estilo de Respuesta">
      <InconsistencyIndex answers={answers} questions={questions} />
    </CollapsibleSection>

    {activeTest === 'conners-parents' ? (
      <>
        <CollapsibleSection title="DSM-5 Síntomas ADHD">
          <DSM5Counts answers={answers} questions={questions} age={age} />
        </CollapsibleSection>
        <CollapsibleSection title="Trastorno de Conducta / TOD">
          <ConductDisorder answers={answers} />
        </CollapsibleSection>
        <CollapsibleSection title="Ítems de Deterioro">
          <ImpairmentItems answers={answers} />
        </CollapsibleSection>
        <CollapsibleSection title="Índice ADHD">
          <ADHDIndex answers={answers} />
        </CollapsibleSection>
        <CollapsibleSection title="Ítems Screener">
          <ScreenerItems answers={answers} />
        </CollapsibleSection>
      </>
    ) : (
      <p className="clinical-placeholder">Análisis clínico no disponible para esta versión.</p>
    )}
  </div>
);

export default AnalisisResultados;
