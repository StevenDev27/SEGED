export const Inicio = () => {
  return (
    <div className="d-flex align-items-center justify-content-center fade-in" style={{ minHeight: '80vh' }}>
      <div className="container px-4">
        <div className="text-center mb-5 position-relative">
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)',
            zIndex: -1
          }} />
          <h1 className="display-4 fw-bold mb-3" style={{
            background: 'linear-gradient(to right, #6366f1, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>SEGED</h1>
          <p className="lead mb-0 text-white-50">
            Sistema de Gestión de Ventas para microempresas
          </p>
        </div>

        <div className="row g-4 max-w-4xl mx-auto">
          <div className="col-12 col-lg-6">
            <div className="card h-100 p-2">
              <div className="card-body p-4 text-center">
                <div className="mb-4 d-inline-flex align-items-center justify-content-center" style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <i className="bi bi-bullseye fs-2 text-primary"></i>
                </div>
                <h3 className="h4 fw-bold mb-3">Nuestra Misión</h3>
                <p className="mb-0 text-muted" style={{ lineHeight: '1.7' }}>
                  Proveer a las microempresas una plataforma web de gestión de ventas, segura, intuitiva y accesible, que estandarice procesos, reduzca mermas y habilite decisiones basadas en datos para fortalecer su productividad y competitividad.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card h-100 p-2">
              <div className="card-body p-4 text-center">
                <div className="mb-4 d-inline-flex align-items-center justify-content-center" style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <i className="bi bi-eye fs-2 text-secondary"></i>
                </div>
                <h3 className="h4 fw-bold mb-3">Nuestra Visión</h3>
                <p className="mb-0 text-muted" style={{ lineHeight: '1.7' }}>
                  Consolidarnos como la solución de referencia en gestión de ventas para microempresas en Latinoamérica, distinguiéndonos por innovación continua, confiabilidad operativa y un soporte cercano que impulse el crecimiento sostenible del tejido empresarial.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
