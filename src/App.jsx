import './App.css'
import { useState, useEffect } from 'react';
import questions from './resources/questions'
import fields from './resources/fields'
import Header from './components/Header'
import Board from './components/Board'
import Total from './components/Total'
import Pagination from './components/Pagination'
import ModuleNav from './components/ModuleNav'
import InconsistencyIndex from './components/InconsistencyIndex'
import Charts from './components/Charts'

const QUESTIONS_PER_PAGE = 10;

const App = () => {
  const [answers, setAnswers] = useState(() => {
    const stored = localStorage.getItem('answers');
    return stored ? JSON.parse(stored) : {};
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const stored = localStorage.getItem('currentPage');
    return stored ? parseInt(stored, 10) : 0;
  });

  const [activeModule, setActiveModule] = useState('cuestionario');

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('currentPage', String(currentPage));
  }, [currentPage]);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const answeredInPage = pageQuestions.filter(q => answers[q.id] !== undefined).length;

  const resetAnswers = () => {
    localStorage.removeItem('answers');
    localStorage.removeItem('currentPage');
    setAnswers({});
    setCurrentPage(0);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h1 className="app-title">La poderosisima Conners</h1>

      <ModuleNav activeModule={activeModule} onModuleChange={setActiveModule} />

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

      {activeModule === 'analisis' && (
        <InconsistencyIndex answers={answers} questions={questions} />
      )}

      {activeModule === 'graficas' && (
        <Charts fields={fields} answers={answers} questions={questions} />
      )}
    </div>
  );
};

export default App;
