const ITEMS = [
  { id: 106, label: 'Los problemas de su hijo afectan seriamente el trabajo escolar o las calificaciones.' },
  { id: 107, label: 'Los problemas de su hijo afectan seriamente las amistades y relaciones.' },
  { id: 108, label: 'Los problemas de su hijo afectan seriamente la vida en casa.' },
];

const LABELS = ['Nunca/No es verdad', 'Un poco verdad/Ocasionalmente', 'Bastante verdad/Frecuente', 'Muy verdad/Muy frecuente'];

const ImpairmentItems = ({ answers }) => (
  <section className="clinical-section">
    <h3>Deterioro Funcional</h3>
    <div className="table-scroll">
    <table className="clinical-table">
      <thead>
        <tr>
          <th>Ítem</th>
          <th>Contenido</th>
          <th>Puntaje</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {ITEMS.map(({ id, label }) => {
          const raw = answers[id];
          const score = raw !== undefined ? parseInt(raw, 10) : null;
          return (
            <tr key={id}>
              <td>{id}</td>
              <td style={{ textAlign: 'left' }}>{label}</td>
              <td className="clinical-score-cell">{score ?? '—'}</td>
              <td>{score !== null ? LABELS[score] : '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  </section>
);

export default ImpairmentItems;
