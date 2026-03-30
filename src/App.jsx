import './App.css'
import { useState, useEffect } from 'react';
import questionsParents  from './resources/questions-parents'
import questionsTeachers from './resources/questions-teachers'
import fields from './resources/fields'
import Header from './components/Header'
import Board from './components/Board'
import Total from './components/Total'
import Pagination from './components/Pagination'
import ModuleNav from './components/ModuleNav'
import AnalisisResultados from './components/AnalisisResultados'
import Charts from './components/Charts'
import About from './components/About'
import TestSelector from './components/TestSelector'

const QUESTIONS_PER_PAGE = 10;

const QUESTIONS_BY_VERSION = {
  'conners-parents':  questionsParents,
  'conners-teachers': questionsTeachers,
};

const App = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [activeModule, setActiveModule] = useState('cuestionario');
  const [age, setAge] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [testDate, setTestDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Load version-specific answers and page from localStorage when version changes
  useEffect(() => {
    if (activeTest !== null) {
      const stored = localStorage.getItem(`answers-${activeTest}`);
      setAnswers(stored ? JSON.parse(stored) : {});
      const page = localStorage.getItem(`currentPage-${activeTest}`);
      setCurrentPage(page ? parseInt(page, 10) : 0);
    }
  }, [activeTest]);

  // Persist answers for the active version
  useEffect(() => {
    if (activeTest !== null) {
      localStorage.setItem(`answers-${activeTest}`, JSON.stringify(answers));
    }
  }, [answers, activeTest]);

  // Persist current page for the active version
  useEffect(() => {
    if (activeTest !== null) {
      localStorage.setItem(`currentPage-${activeTest}`, String(currentPage));
    }
  }, [currentPage, activeTest]);

  // Load age from localStorage when version changes
  useEffect(() => {
    if (activeTest !== null) {
      const stored = localStorage.getItem(`age-${activeTest}`);
      setAge(stored ? parseInt(stored, 10) : null);
    }
  }, [activeTest]);

  // Persist age for the active version
  useEffect(() => {
    if (activeTest !== null) {
      if (age !== null) {
        localStorage.setItem(`age-${activeTest}`, String(age));
      } else {
        localStorage.removeItem(`age-${activeTest}`);
      }
    }
  }, [age, activeTest]);

  // Load patientName from localStorage when version changes
  useEffect(() => {
    if (activeTest !== null) {
      const stored = localStorage.getItem(`patientName-${activeTest}`);
      setPatientName(stored ?? '');
    }
  }, [activeTest]);

  // Load testDate from localStorage when version changes
  useEffect(() => {
    if (activeTest !== null) {
      const stored = localStorage.getItem(`testDate-${activeTest}`);
      setTestDate(stored ?? new Date().toISOString().slice(0, 10));
    }
  }, [activeTest]);

  // Persist patientName for the active version
  useEffect(() => {
    if (activeTest !== null) {
      if (patientName) {
        localStorage.setItem(`patientName-${activeTest}`, patientName);
      } else {
        localStorage.removeItem(`patientName-${activeTest}`);
      }
    }
  }, [patientName, activeTest]);

  // Persist testDate for the active version
  useEffect(() => {
    if (activeTest !== null) {
      localStorage.setItem(`testDate-${activeTest}`, testDate);
    }
  }, [testDate, activeTest]);

  const questions = QUESTIONS_BY_VERSION[activeTest] ?? [];

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const answeredInPage = pageQuestions.filter(q => answers[q.id] !== undefined).length;

  const resetAnswers = () => {
    localStorage.removeItem(`answers-${activeTest}`);
    localStorage.removeItem(`currentPage-${activeTest}`);
    setAnswers({});
    setCurrentPage(0);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeTest === null) {
    return (
      <div>
        <h1 className="app-title">Sistema de Evaluación Neuropsicológica</h1>
        <TestSelector onSelect={setActiveTest} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="app-title">Sistema de Evaluación Neuropsicológica</h1>

      <ModuleNav
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        onBack={() => { setActiveTest(null); setAge(null); }}
        age={age}
        onAgeChange={setAge}
        patientName={patientName}
        onPatientNameChange={setPatientName}
        testDate={testDate}
        onTestDateChange={setTestDate}
      />

      {activeModule === 'cuestionario' && (
        <>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            answeredInPage={answeredInPage}
            totalInPage={pageQuestions.length}
            onPageChange={goToPage}
          />
          <div className="app-container">
            <div className="results-panel">
              <table className="results-table">
                <Header fields={fields} />
                <tbody>
                  <Board
                    questions={pageQuestions}
                    fields={fields}
                    answers={answers}
                    setAnswers={setAnswers}
                  />
                  <Total
                    fields={fields}
                    answers={answers}
                    questions={questions}
                    resetAnswers={resetAnswers}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeModule === 'resultados' && (
        <AnalisisResultados
          answers={answers}
          questions={questions}
          age={age}
          activeTest={activeTest}
          patientName={patientName}
          testDate={testDate}
        />
      )}

      {activeModule === 'graficas' && (
        <Charts fields={fields} answers={answers} questions={questions} />
      )}

      {activeModule === 'acerca' && <About />}
    </div>
  );
};

export default App;
