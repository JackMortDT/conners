import DSM5Counts from './DSM5Counts';
import ConductDisorder from './ConductDisorder';
import ImpairmentItems from './ImpairmentItems';
import ADHDIndex from './ADHDIndex';
import ScreenerItems from './ScreenerItems';

const ClinicalAnalysisParents = ({ answers, questions, age }) => (
  <div className="clinical-container">
    <h2 className="clinical-title">Análisis Clínico — Padres</h2>
    <DSM5Counts answers={answers} questions={questions} age={age} />
    <ConductDisorder answers={answers} questions={questions} />
    <ImpairmentItems answers={answers} questions={questions} />
    <ADHDIndex answers={answers} questions={questions} />
    <ScreenerItems answers={answers} questions={questions} />
  </div>
);

export default ClinicalAnalysisParents;
