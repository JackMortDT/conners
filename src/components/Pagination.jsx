const Pagination = ({ currentPage, totalPages, answeredInPage, totalInPage, onPageChange }) => {
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);

  return (
    <div className="pagination">
      <div className="pagination-top">
        <span className="pagination-info">
          Página <strong>{currentPage + 1}</strong> de {totalPages}
        </span>
        <span className="pagination-answered">
          {answeredInPage}/{totalInPage} respondidas
        </span>
      </div>

      <div className="pagination-progress-track">
        <div className="pagination-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          ← Anterior
        </button>
        <div className="pagination-dots">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`pagination-dot ${i === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(i)}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
