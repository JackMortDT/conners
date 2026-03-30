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
}) => (
  <nav className="module-nav">
    {onBack && (
      <button className="module-nav-back" onClick={onBack}>
        ← Pruebas
      </button>
    )}
    {MODULES.map(({ id, label }) => (
      <button
        key={id}
        className={`module-tab ${activeModule === id ? 'active' : ''}`}
        onClick={() => onModuleChange(id)}
      >
        {label}
      </button>
    ))}
    <label className="module-nav-age">
      Edad:
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
    <label className="module-nav-age">
      Nombre:
      <input
        type="text"
        value={patientName}
        onChange={e => onPatientNameChange(e.target.value)}
        className="module-nav-name-input"
        placeholder="Paciente"
      />
    </label>
    <label className="module-nav-age">
      Fecha:
      <input
        type="date"
        value={testDate}
        onChange={e => onTestDateChange(e.target.value)}
        className="module-nav-name-input"
      />
    </label>
  </nav>
);

export default ModuleNav;
