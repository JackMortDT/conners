const Question = ({ questionId, answer, onAnswerChange, options }) => {
  return (
    <div className="question-options">
      {options.map((option) => {
        const inputId = `q${questionId}-opt${option}`;
        return (
          <div key={option} className="option-item">
            <input
              id={inputId}
              type="radio"
              name={`question-${questionId}`}
              value={option}
              checked={answer === option}
              onChange={() => onAnswerChange(option)}
            />
            <label htmlFor={inputId}>{option}</label>
          </div>
        );
      })}
    </div>
  );
};

export default Question;