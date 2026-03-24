import './App.css'
import { useState, useEffect } from 'react';
import questions from './resources/questions'
import fields from './resources/fields'
import Header from './components/Header'
import Board from './components/Board'
import Total from './components/Total'

const App = () => {
  const [answers, setAnswers] = useState(() => {
    const stored = localStorage.getItem('answers');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  const resetAnswers = () => {
    localStorage.removeItem('answers');
    setAnswers({});
  };

  return (
    <div>
      <h1 className="app-title">La poderosisima Conners</h1>

      <div className="app-container">
        <div className="results-panel">
          <table className="results-table">
            <Header fields={fields} />
            <tbody>
              <Board
                questions={questions}
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
    </div>
  );
};

export default App;