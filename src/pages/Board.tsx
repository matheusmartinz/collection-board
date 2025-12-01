import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { globalStyles } from "../global/styles";
import { MOCK_DATA } from "./DadosMockados";

interface Colecao {
  uuid: string;
  codigo: string;
  nome: string;
}

interface Modelo {
  codigo: string;
  nome: string;
  status: "NAO_INICIADO" | "EM_DESENVOLVIMENTO" | "APROVADO" | "REPROVADO" | "CANCELADO";
}

interface ColecaoData {
  colecao: Colecao;
  numeroModelos: number;
  modelos: Modelo[];
}

interface ResumoColecao {
  nome: string;
  previsto: number;
  criados: number;
  naoIniciado: number;
  emDesenvolvimento: number;
  aprovado: number;
  reprovado: number;
  cancelado: number;
}

const API_URL = "https://eboard.service.bck.peon.tec.br/api/gestao-modelo";
const logoEliteBoard = "/iconeTopoElite.svg";
const REFRESH_INTERVAL = 60000;
const USE_MOCK_DATA = true; // Altere para false quando quiser usar a API real

const initialState = {
  loading: true,
  data: [] as Array<ResumoColecao>,
  error: null as string | null,
};

const Board = () => {
  // const [data, setData] = useState<ResumoColecao[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [stateLocal, setStateLocal] = useState(initialState);

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setStateLocal((prev) => ({
        ...prev,
        error: null,
      }));

      let apiData: ColecaoData[];

      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        apiData = MOCK_DATA;
      } else {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        apiData = await response.json();
      }

      const resumo: ResumoColecao[] = apiData.map((item) => {
        const statusCounts = {
          naoIniciado: 0,
          emDesenvolvimento: 0,
          aprovado: 0,
          reprovado: 0,
          cancelado: 0,
        };

        item.modelos.forEach((modelo) => {
          switch (modelo.status) {
            case "NAO_INICIADO":
              statusCounts.naoIniciado++;
              break;
            case "EM_DESENVOLVIMENTO":
              statusCounts.emDesenvolvimento++;
              break;
            case "APROVADO":
              statusCounts.aprovado++;
              break;
            case "REPROVADO":
              statusCounts.reprovado++;
              break;
            case "CANCELADO":
              statusCounts.cancelado++;
              break;
          }
        });

        return {
          nome: item.colecao.nome + " - " + item.colecao.codigo,
          previsto: item.numeroModelos,
          criados: item.modelos.length,
          ...statusCounts,
        };
      });
      // setLastUpdate(new Date());
      setStateLocal((prev) => ({
        ...prev,
        data: resumo,
        loading: false,
      }));
    } catch (err) {
      setStateLocal((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Erro ao carregar dados",
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (stateLocal.loading) {
    return (
      <div className="min-h-screen bg-tv-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-tv-text mx-auto mb-4" />
          <p className="text-tv-text text-3xl font-semibold">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (stateLocal.error) {
    return (
      <div className="min-h-screen bg-tv-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-status-rejected text-3xl font-semibold mb-4">Erro ao carregar dados</p>
          <p className="text-tv-text-muted text-2xl">{stateLocal.error}</p>
        </div>
      </div>
    );
  }

  const tvStyles: Record<string, React.CSSProperties> = {
    th: {
      border: `1px solid ${globalStyles.CINZA_MEDIO}`,
      whiteSpace: "nowrap",
      backgroundColor: globalStyles.peonDarkGreen,
      color: "white",
      fontWeight: "700",
      fontSize: "22px",
      padding: "12px 8px",
      textAlign: "center",
    },
    td: {
      border: `1px solid ${globalStyles.CINZA_MEDIO}`,
      whiteSpace: "nowrap",
      fontFamily: "Arial",
      fontSize: "20px",
      padding: "12px 8px",
      textAlign: "center",
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
          {/* <div className="text-peon-white text-2xl font-bold">LOGO</div> */}
          <div>
            <img src={logoEliteBoard} alt="logoEliteBoard" style={{ height: "35px" }} />
          </div>
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
              {stateLocal.data.map((row) => (
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

                  <td
                    style={{
                      ...tvStyles.td,
                      width: "140px",
                    }}
                  >
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

                  <td
                    style={{
                      ...tvStyles.td,
                      width: "120px",
                      color: globalStyles.RED,
                    }}
                  >
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

          {/* Última atualização
          {lastUpdate && (
            <div className="text-center py-4">
              <p className="text-tv-text-muted text-sm">
                Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
              </p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Board;
