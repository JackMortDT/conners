import React from "react";

const Question = ({ questionId, answer, handleAnswerChange, options }) => {
  return (
    <div className="question-options">
      {options.map((option) => (
        <div key={option} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <input
            type="radio"
            name={`question-${questionId}`}
            value={option}
            checked={answer === option}
            onChange={() => handleAnswerChange(option)}
            style={{ marginRight: '5px' }}
          />
          <label>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Question;