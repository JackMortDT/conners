import { useMemo } from "react";

const Total = ({ fields, answers, questions, resetAnswers }) => {
  const results = useMemo(() => {
    const totals = fields.reduce((acc, field) => ({ ...acc, [field]: 0 }), {});

    for (const [questionId, selectedAnswer] of Object.entries(answers)) {
      const question = questions.find(q => q.id === Number(questionId));
      if (question) {
        question.fields.forEach(fieldKey => {
          totals[fieldKey] += parseInt(selectedAnswer, 10) || 0;
        });
      }
    }

    return totals;
  }, [fields, answers, questions]);

  return (
    <tr>
      <td>Total:</td>
      {fields.map((field) => (
        <td key={field} className="total-result">
          {results[field] ?? 0}
        </td>
      ))}
      <td>
        <div className="reset-container">
          <button className="reset-button" onClick={resetAnswers}>
            Reiniciar
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Total;