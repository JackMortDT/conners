const TESTS = [
  {
    id: 'conners',
    icon: '🧠',
    label: 'Conners 3',
    description: 'Evaluación de TDAH',
    available: true,
  },
  {
    id: 'test2',
    icon: '📋',
    label: 'Prueba 2',
    description: 'Próximamente',
    available: false,
  },
  {
    id: 'test3',
    icon: '📊',
    label: 'Prueba 3',
    description: 'Próximamente',
    available: false,
  },
];

const TestSelector = ({ onSelect }) => (
  <div className="test-selector">
    <h2 className="test-selector-title">Selecciona una evaluación</h2>
    <p className="test-selector-subtitle">
      Elige el instrumento que deseas aplicar
    </p>
    <div className="test-selector-grid">
      {TESTS.map(({ id, icon, label, description, available }) => (
        <div
          key={id}
          className={`test-card ${available ? 'available' : 'unavailable'}`}
          onClick={available ? () => onSelect(id) : undefined}
        >
          <div className="test-card-icon">{icon}</div>
          <div className="test-card-label">{label}</div>
          <p className="test-card-description">{description}</p>
          <button
            className="test-card-action"
            disabled={!available}
            onClick={available ? () => onSelect(id) : undefined}
          >
            {available ? 'Iniciar →' : 'Próximamente'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default TestSelector;
