import { useCallback } from "react";
import Question from "./Question";

const Board = ({ questions, fields, answers, setAnswers }) => {
  const handleAnswerChange = useCallback((questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  }, [setAnswers]);

  return (
    <>
      {questions.map((question) => (
        <tr key={question.id}>
          <td>{question.id}</td>
          {fields.map((field) => (
            <td
              key={field}
              className={`field-cell ${question.fields.includes(field) ? 'active-field' : 'inactive-field'}`}
            >
              {question.fields.includes(field) && (
                <div className="result">
                  {answers[question.id] ?? 0}
                </div>
              )}
            </td>
          ))}
          <td className="results-column">
            <Question
              questionId={question.id}
              answer={answers[question.id]}
              onAnswerChange={(value) => handleAnswerChange(question.id, value)}
              options={question.options}
            />
          </td>
        </tr>
      ))}
    </>
  );
};

export default Board;