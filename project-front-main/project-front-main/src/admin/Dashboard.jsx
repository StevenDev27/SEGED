
export const Dashboard = () => {
  return (
    <div className="container mt-4 fade-in">
      <h3 className="mb-3">Dashboard de Analíticas</h3>
      <div className="card shadow border-0 p-3">
        <div className="card-body p-0" style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: '8px', overflow: 'hidden' }}>
          <iframe title="DASBOARD" width="100%" height="100%" src="https://app.powerbi.com/view?r=eyJrIjoiMTRkM2I0NmMtMjg1OS00MzY3LTgyZTItZTk4MjgyMTdiODI2IiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9" frameBorder="0" allowFullScreen={true}></iframe>
        </div>
      </div>
    </div>
  )
}