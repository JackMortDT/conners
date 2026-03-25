const About = () => (
  <div className="about-container">
    <h2 className="about-title">Acerca de esta aplicación</h2>
    <p className="about-intro">
      Esta es una herramienta de evaluación neuropsicológica diseñada para registrar,
      calificar e interpretar respuestas de un instrumento estandarizado de manera digital.
      Toda la información se guarda localmente en tu dispositivo; no se envían datos a ningún servidor.
    </p>

    <section className="about-section">
      <h3>Módulos</h3>
      <p>La aplicación está dividida en tres módulos accesibles desde la barra de navegación superior:</p>

      <div className="about-module">
        <span className="about-module-name">Cuestionario</span>
        <p>
          Presenta las preguntas del instrumento de 10 en 10 (paginadas).
          Selecciona la opción que mejor describe la conducta evaluada usando los botones de opción.
          Tus respuestas se guardan automáticamente y puedes retomar la evaluación en cualquier momento.
        </p>
        <ul>
          <li>Usa <strong>Siguiente / Anterior</strong> o los puntos de navegación para moverte entre páginas.</li>
          <li>La barra de progreso muestra qué tan avanzada está la evaluación.</li>
          <li>El contador <em>&quot;X/10 respondidas&quot;</em> indica cuántas preguntas de la página actual ya fueron contestadas.</li>
          <li>La fila de <strong>Totales</strong> al final de cada página muestra los puntajes brutos acumulados por campo.</li>
          <li>El botón <strong>Reiniciar</strong> borra todas las respuestas y regresa a la primera página.</li>
        </ul>
      </div>

      <div className="about-module">
        <span className="about-module-name">Análisis de estilo de respuesta</span>
        <p>
          Evalúa la consistencia y el estilo de respuesta del evaluado a través de dos secciones:
        </p>
        <ul>
          <li>
            <strong>Índice de Inconsistencia:</strong> compara 10 pares de ítems similares.
            Si la diferencia total (A) es ≥ 6 <em>y</em> el número de diferencias de 2 o 3 (B) es ≥ 2,
            se indica un posible estilo de respuesta inconsistente.
          </li>
          <li>
            <strong>Guías PI y NI:</strong> un puntaje bruto ≥ 5 en la escala de Impresión Positiva (PI)
            o Impresión Negativa (NI) sugiere revisar el estilo de respuesta antes de interpretar los resultados.
          </li>
        </ul>
        <p>Los valores se calculan automáticamente a partir de las respuestas del cuestionario.</p>
      </div>

      <div className="about-module">
        <span className="about-module-name">Gráficas</span>
        <p>
          Muestra un histograma con el puntaje bruto obtenido en cada campo de evaluación,
          comparado con el máximo posible. Permite visualizar el perfil del evaluado de un vistazo.
        </p>
        <ul>
          <li>La <strong>barra azul</strong> representa el puntaje obtenido.</li>
          <li>La <strong>barra gris</strong> representa el puntaje máximo posible para ese campo.</li>
          <li>El botón <strong>↓ Descargar SVG</strong> guarda la gráfica como archivo de imagen vectorial.</li>
        </ul>
      </div>
    </section>

    <section className="about-section">
      <h3>Campos de evaluación</h3>
      <p>El instrumento mide 14 campos neuropsicológicos:</p>
      <div className="about-fields">
        {[
          ['IN1', 'Inatención'],
          ['HY1', 'Hiperactividad'],
          ['LE1', 'Problemas de aprendizaje'],
          ['LP1', 'Problemas de aprendizaje (escolar)'],
          ['EF1', 'Función ejecutiva'],
          ['AG1', 'Agresión'],
          ['PR1', 'Relaciones con pares'],
          ['GL1', 'Índice global'],
          ['AN1', 'Ansiedad'],
          ['AH1', 'Índice ADHD'],
          ['CD1', 'Trastorno de conducta'],
          ['OD1', 'Trastorno negativista desafiante'],
          ['PI1', 'Impresión positiva'],
          ['NI1', 'Impresión negativa'],
        ].map(([key, label]) => (
          <div key={key} className="about-field-item">
            <span className="about-field-key">{key}</span>
            <span className="about-field-label">{label}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="about-section">
      <h3>Almacenamiento de datos</h3>
      <p>
        Todas las respuestas se guardan en el <strong>almacenamiento local</strong> del navegador
        (<code>localStorage</code>). Esto significa que:
      </p>
      <ul>
        <li>Los datos <strong>no se envían</strong> a ningún servidor externo.</li>
        <li>Las respuestas persisten aunque cierres el navegador.</li>
        <li>Si limpias los datos del navegador o usas modo incógnito, las respuestas se perderán.</li>
        <li>Cada dispositivo guarda sus propias respuestas de forma independiente.</li>
      </ul>
    </section>
  </div>
);

export default About;
