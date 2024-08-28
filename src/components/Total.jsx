import React from "react";

const Total = ({ fields, answers, questions, resetAnswers }) => {
  const calculateResults = () => {
    const results = fields.reduce((acc, field) => {
      acc[field] = 0;
      return acc;
    }, {});

    for (const questionId in answers) {
      const selectedAnswer = answers[questionId];
      const question = questions.find(q => q.id == questionId);

      if (question) {
        question.fields.forEach(fieldKey => {
          results[fieldKey] += parseInt(selectedAnswer, 10) || 0;
        });
      }
    }

    return results;
  };

  const results = calculateResults();

  return (
    <tr>
      <td>Total:</td>
      {fields.map((field) => (
        <td key={field} className="total-result">
          {results[field] || 0}
        </td>
      ))}
      <td>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <button
            onClick={resetAnswers}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reiniciar
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Total;