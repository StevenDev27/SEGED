
import { useMemo, useState } from "react";
import { useVentas } from "../hooks/useVentas";

export const Dashboard = () => {
  const { items: ventas, loading, error } = useVentas();

  const [monthsCount, setMonthsCount] = useState(7);

  const ventasPorMes = useMemo(() => {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const now = new Date();
    const months = Array.from({ length: monthsCount }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1) + index, 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        mes: monthNames[date.getMonth()],
        valor: 0,
      };
    });

    ventas.forEach((venta) => {
      const fecha = new Date(venta.fecha);
      if (isNaN(fecha)) return;
      const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      const month = months.find((m) => m.key === key);
      if (month) {
        month.valor += Number(venta.total || 0);
      }
    });

    return months;
  }, [ventas, monthsCount]);

  const maxValor = Math.max(...ventasPorMes.map((item) => item.valor), 1);
  const montoPromedio = ventasPorMes.reduce((acc, item) => acc + item.valor, 0) / ventasPorMes.length;
  const growthPercentage = (() => {
    if (ventasPorMes.length < 2) return null;
    const latest = ventasPorMes[ventasPorMes.length - 1].valor;
    const previous = ventasPorMes[ventasPorMes.length - 2].valor;
    if (previous === 0) return latest === 0 ? 0 : null;
    return Math.round(((latest - previous) / previous) * 100);
  })();

  return (
    <div className="container mt-4">
      <style>{`
        .neon-dashboard {
          background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 28%),
                      radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.16), transparent 25%),
                      #060816;
          border: 1px solid rgba(96, 165, 250, 0.15);
          box-shadow: 0 0 24px rgba(56, 189, 248, 0.12);
          border-radius: 28px;
          padding: 2rem;
          color: #f8fafc;
        }

        .neon-dashboard h2 {
          text-shadow: 0 0 16px rgba(59, 130, 246, 0.55);
        }

        .neon-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
          background: rgba(59, 130, 246, 0.14);
          border: 1px solid rgba(59, 130, 246, 0.24);
          border-radius: 999px;
          color: #dbeafe;
          backdrop-filter: blur(8px);
          box-shadow: inset 0 0 14px rgba(59, 130, 246, 0.12);
        }

        .neon-chart {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(15, 23, 42, 0.9);
          border-radius: 24px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          box-shadow: inset 0 0 24px rgba(59, 130, 246, 0.08);
        }

        .neon-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .neon-chart-header h3 {
          color: #e0f2fe;
          margin: 0;
        }

        .neon-graph {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          min-height: 260px;
          height: 260px;
          padding: 1rem 0.25rem 0 0.25rem;
        }

        .neon-bar {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          flex: 1;
          min-width: 0;
          height: 100%;
          margin: 0 0.15rem;
          border-radius: 18px 18px 4px 4px;
          background: rgba(148, 163, 184, 0.08);
          overflow: hidden;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .neon-bar:hover {
          transform: translateY(-4px);
          opacity: 0.95;
        }

        .neon-bar::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow: 0 0 32px rgba(59, 130, 246, 0.18);
          opacity: 0.7;
          pointer-events: none;
        }

        .neon-bar-fill {
          width: 100%;
          border-radius: inherit;
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.95), rgba(56, 189, 248, 0.4));
          box-shadow: inset 0 0 24px rgba(59, 130, 246, 0.25);
          transition: height 0.35s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 0.75rem;
          position: relative;
          z-index: 1;
          min-height: 8%;
        }

        .neon-bar-label {
          margin-top: 0.75rem;
          text-align: center;
          color: #c7d2fe;
          font-size: 0.92rem;
          z-index: 1;
        }

        .neon-value {
          position: relative;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
          color: #f8fafc;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.9);
          z-index: 2;
        }

        .neon-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: grid;
          grid-template-rows: repeat(4, 1fr);
          row-gap: 1rem;
        }

        .neon-grid span {
          display: block;
          border-top: 1px solid rgba(148, 163, 184, 0.12);
          width: 100%;
        }
      `}</style>

      <div className="neon-dashboard">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
          <div>
            <h2>Dashboard Neon</h2>
            <p className="text-secondary mb-2">Visualiza el comportamiento de ventas con un estilo moderno y luminoso.</p>
            <div className="d-flex align-items-center gap-2">
              <div className="neon-badge">
                <span>Últimos {monthsCount} meses</span>
              </div>
              <div className="btn-group btn-group-sm" role="group" aria-label="Meses">
                {[3,6,7,12].map((m) => (
                  <button key={m} type="button" className={`btn btn-outline-light btn-sm ${monthsCount===m? 'active':''}`} onClick={() => setMonthsCount(m)}>{m}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="text-end">
            <p className="mb-1 text-secondary">Monto promedio</p>
            <strong style={{ fontSize: "1.8rem", color: "#bfdbfe" }}>${Math.round(montoPromedio).toLocaleString('es-CO')}</strong>
          </div>
        </div>

        <div className="neon-chart">
          <div className="neon-chart-header">
            <div>
              <h3>Ventas</h3>
              <p className="text-secondary mb-0">Tendencia mensual</p>
            </div>
            <div className="neon-badge">Crecimiento {growthPercentage !== null ? `${growthPercentage >= 0 ? '+' : ''}${growthPercentage}%` : '—'}</div>
          </div>
          <div className="position-relative" style={{ minHeight: "280px" }}>
            <div className="neon-grid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "260px" }}>
                <div className="text-secondary">Cargando datos...</div>
              </div>
            ) : error ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "260px" }}>
                <div className="text-danger">Error cargando ventas</div>
              </div>
            ) : (
              <div className="neon-graph">
                {ventasPorMes.map((item) => {
                  const fillHeight = Math.max(8, (item.valor / maxValor) * 100);
                  return (
                    <div key={item.mes} className="neon-bar">
                      <div className="neon-bar-fill" style={{ height: `${fillHeight}%` }}>
                        <span className="neon-value">${Math.round(item.valor).toLocaleString('es-CO')}</span>
                      </div>
                      <div className="neon-bar-label">{item.mes}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

          <div className="mt-4 bg-transparent">
            <h5 className="text-white text-sm mb-2">Detalle mensual</h5>
            <div className="overflow-auto">
              <table className="table table-sm table-striped w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Mes</th>
                    <th className="text-right">Ventas</th>
                    <th className="text-right">Cambio</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasPorMes.map((item, idx) => {
                    const prev = ventasPorMes[idx - 1] ? ventasPorMes[idx - 1].valor : null;
                    const change = prev === null ? null : Math.round(((item.valor - prev) / (prev || 1)) * 100);
                    const formatted = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Math.round(item.valor));
                    return (
                      <tr key={item.key || item.mes}>
                        <td className="align-middle">{item.mes}</td>
                        <td className="align-middle text-right">${formatted}</td>
                        <td className={`align-middle text-right ${change === null ? 'text-slate-300' : change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {change === null ? '—' : `${change >= 0 ? '+' : ''}${change}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  );
}