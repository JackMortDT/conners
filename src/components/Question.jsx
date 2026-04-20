const Question = ({ questionId, answer, onAnswerChange, options }) => {
  return (
    <div className="question-options">
      {options.map((option, index) => {
        const inputId = `q${questionId}-opt${index}`;
        return (
          <div key={index} className="option-item">
            <input
              id={inputId}
              type="radio"
              name={`question-${questionId}`}
              value={index}
              checked={answer === index}
              onChange={() => onAnswerChange(index)}
            />
            <label htmlFor={inputId}>{option}</label>
          </div>
        );
      })}
    </div>
  );
};

export default Question;