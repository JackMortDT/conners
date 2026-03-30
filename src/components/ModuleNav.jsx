import { useState, useRef, useEffect } from 'react';

const MODULES = [
  { id: 'cuestionario', label: 'Cuestionario' },
  { id: 'resultados',   label: 'Análisis de Resultados' },
  { id: 'graficas',     label: 'Gráficas' },
  { id: 'acerca',       label: 'Acerca de' },
];

const ModuleNav = ({
  activeModule, onModuleChange, onBack,
  age, onAgeChange,
  patientName, onPatientNameChange,
  testDate, onTestDateChange,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!popupOpen) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popupOpen]);

  const hasPatiendData = age !== null || patientName || testDate;

  return (
    <nav className="module-nav">
      {onBack && (
        <button className="module-nav-back" onClick={onBack}>
          ← Pruebas
        </button>
      )}
      <div className="module-nav-tabs-scroll">
        {MODULES.map(({ id, label }) => (
          <button
            key={id}
            className={`module-tab ${activeModule === id ? 'active' : ''}`}
            onClick={() => onModuleChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="module-nav-patient-wrapper" ref={popupRef}>
        <button
          className={`module-nav-patient-btn ${hasPatiendData ? 'has-data' : ''}`}
          onClick={() => setPopupOpen(o => !o)}
          title="Datos del paciente"
        >
          Paciente {patientName ? `— ${patientName}` : ''}
        </button>
        {popupOpen && (
          <div className="module-nav-popup">
            <label className="module-nav-popup-field">
              <span>Edad</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={age ?? ''}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  onAgeChange(isNaN(v) ? null : v);
                }}
                className="module-nav-age-input"
                placeholder="—"
              />
            </label>
            <label className="module-nav-popup-field">
              <span>Nombre</span>
              <input
                type="text"
                value={patientName}
                onChange={e => onPatientNameChange(e.target.value)}
                className="module-nav-name-input"
                placeholder="Paciente"
              />
            </label>
            <label className="module-nav-popup-field">
              <span>Fecha</span>
              <input
                type="date"
                value={testDate}
                onChange={e => onTestDateChange(e.target.value)}
                className="module-nav-name-input"
              />
            </label>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModuleNav;
