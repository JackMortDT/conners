const MODULES = [
  { id: 'cuestionario', label: 'Cuestionario' },
  { id: 'analisis',     label: 'Análisis de estilo' },
  { id: 'graficas',     label: 'Gráficas' },
  { id: 'acerca',       label: 'Acerca de' },
];

const ModuleNav = ({ activeModule, onModuleChange }) => (
  <nav className="module-nav">
    {MODULES.map(({ id, label }) => (
      <button
        key={id}
        className={`module-tab ${activeModule === id ? 'active' : ''}`}
        onClick={() => onModuleChange(id)}
      >
        {label}
      </button>
    ))}
  </nav>
);

export default ModuleNav;
