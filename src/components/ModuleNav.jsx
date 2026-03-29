const MODULES = [
  { id: 'cuestionario', label: 'Cuestionario' },
  { id: 'analisis',     label: 'Análisis de estilo' },
  { id: 'graficas',     label: 'Gráficas' },
  { id: 'clinico',      label: 'Análisis clínico' },
  { id: 'acerca',       label: 'Acerca de' },
];

const ModuleNav = ({ activeModule, onModuleChange, onBack, age, onAgeChange }) => (
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
        type="number"
        min="6"
        max="17"
        value={age ?? ''}
        onChange={e => {
          const v = parseInt(e.target.value, 10);
          onAgeChange(isNaN(v) ? null : v);
        }}
        className="module-nav-age-input"
        placeholder="—"
      />
    </label>
  </nav>
);

export default ModuleNav;
