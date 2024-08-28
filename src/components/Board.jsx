import React from "react";
import Question from "./Question";

const Board = ({ questions, fields, answers, setAnswers }) => {
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

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
              {question.fields.includes(field) ? (
                <div className="result">
                  {answers[question.id] && parseInt(answers[question.id], 10) || 0}
                </div>
              ) : null}
            </td>
          ))}
          <td className="results-column">
            <Question
              questionId={question.id}
              answer={answers[question.id]}
              handleAnswerChange={(value) => handleAnswerChange(question.id, value)}
              options={questions.find(q => q.id === question.id)?.options || []}
            />
          </td>
        </tr>
      ))}
    </>
  )
};

export default Board;