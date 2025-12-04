import { Loader2 } from "lucide-react";
import { globalStyles } from "../global/styles";
import { useGestaoModelo } from "../hooks/useGestaoModelo";

const logoEliteBoard = "/logo_eliteBoard.svg";

const Board = () => {
  const { data, loading, error } = useGestaoModelo();

  if (loading) {
    return (
      <div className="min-h-screen bg-tv-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-tv-text mx-auto mb-4" />
          <p className="text-tv-text text-3xl font-semibold">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tv-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-status-rejected text-3xl font-semibold mb-4">Erro ao carregar dados</p>
          <p className="text-tv-text-muted text-2xl">{error}</p>
        </div>
      </div>
    );
  }

  const tvStyles: Record<string, React.CSSProperties> = {
    th: {
      border: `1px solid ${globalStyles.CINZA_MEDIO}`,
      whiteSpace: "nowrap",
      backgroundColor: globalStyles.peonWhite,
      color: globalStyles.PEON_DARK_BLUE,
      fontWeight: "700",
      fontSize: "22px",
      padding: "12px 8px",
      textAlign: "center" as const,
    },
    td: {
      border: `1px solid ${globalStyles.CINZA_MEDIO}`,
      whiteSpace: "nowrap",
      fontFamily: "Arial",
      fontSize: "20px",
      padding: "12px 8px",
      textAlign: "center" as const,
      color: globalStyles.PEON_DARK_BLUE,
    },
    percentage: {
      fontSize: "20px",
      marginLeft: "10px",
    },
    cellCol: {
      display: "flex",
      flexDirection: "column",
    },
  };

  return (
    <div className="min-h-screen bg-tv-background">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          height: "10vh",
          marginBottom: "5vh",
          backgroundColor: globalStyles.peonGreen,
        }}
      >
        <div className="flex items-center gap-6 w-full">
          <img
            src={logoEliteBoard}
            alt="logoEliteBoard"
            style={{
              height: "50px",
              filter:
                "brightness(0) saturate(100%) invert(98%) sepia(1%) saturate(265%) hue-rotate(169deg) brightness(103%) contrast(97%)",
            }}
          />
          <h1
            className="text-4xl font-bold flex-1 text-center"
            style={{ color: globalStyles.peonWhite }}
          >
            Andamento das Coleções
          </h1>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          backgroundColor: globalStyles.peonWhite,
          width: "100%",
          padding: "0px 20px 10px 20px",
          flexGrow: 1,
        }}
      >
        <div
          style={{
            height: "80vh",
            width: "100%",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <table className="w-full border-collapse" style={{ fontFamily: "Arial" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ ...tvStyles.th }}>Coleção</th>
                <th style={{ ...tvStyles.th, minWidth: "120px" }}>Previsto</th>
                <th style={{ ...tvStyles.th, minWidth: "120px" }}>Criados</th>
                <th style={{ ...tvStyles.th, minWidth: "140px" }}>Não iniciado</th>
                <th style={{ ...tvStyles.th, minWidth: "180px" }}>Em desenvolvimento</th>
                <th style={{ ...tvStyles.th, minWidth: "120px" }}>Aprovado</th>
                <th style={{ ...tvStyles.th, minWidth: "120px" }}>Reprovado</th>
                <th style={{ ...tvStyles.th, minWidth: "120px" }}>Cancelado</th>
              </tr>
            </thead>

            <tbody style={{ backgroundColor: globalStyles.peonWhite }}>
              {data.map((row) => (
                <tr key={row.nome}>
                  <td style={{ ...tvStyles.td, textAlign: "left", padding: "12px 12px" }}>
                    {row.nome}
                  </td>

                  <td style={{ ...tvStyles.td, color: globalStyles.PEON_BLUE }}>
                    <div style={tvStyles.cellCol}>
                      <span>{row.previsto}</span>
                      <span style={tvStyles.percentage}>100%</span>
                    </div>
                  </td>

                  <td style={{ ...tvStyles.td, width: "120px", color: globalStyles.PEON_BLUE }}>
                    <div style={tvStyles.cellCol}>
                      <span>{row.criados}</span>
                      <span style={tvStyles.percentage}>
                        {((row.criados / row.previsto) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  <td style={{ ...tvStyles.td, width: "140px" }}>
                    <div style={tvStyles.cellCol}>
                      <span>{row.naoIniciado}</span>
                      <span style={tvStyles.percentage}>
                        {((row.naoIniciado / row.previsto) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  <td
                    style={{
                      ...tvStyles.td,
                      width: "180px",
                      color: globalStyles.PEON_LARANJA_CLARO,
                    }}
                  >
                    <div style={tvStyles.cellCol}>
                      <span>{row.emDesenvolvimento}</span>
                      <span style={tvStyles.percentage}>
                        {((row.emDesenvolvimento / row.previsto) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  <td style={{ ...tvStyles.td, width: "120px", color: globalStyles.peonGreen }}>
                    <div style={tvStyles.cellCol}>
                      <span>{row.aprovado}</span>
                      <span style={tvStyles.percentage}>
                        {((row.aprovado / row.previsto) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  <td style={{ ...tvStyles.td, width: "120px", color: globalStyles.RED }}>
                    <div style={tvStyles.cellCol}>
                      <span>{row.reprovado}</span>
                      <span style={tvStyles.percentage}>
                        {((row.reprovado / row.previsto) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  <td style={{ ...tvStyles.td, width: "120px", color: globalStyles.RED }}>
                    <div style={tvStyles.cellCol}>
                      <span>{row.cancelado}</span>
                      <span style={tvStyles.percentage}>
                        {((row.cancelado / row.previsto) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Board;
