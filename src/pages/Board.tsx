import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
const REFRESH_INTERVAL = 60000; // 60 segundos

const Board = () => {
  const [data, setData] = useState<ResumoColecao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const apiData: ColecaoData[] = await response.json();
      
      // Transformar dados em formato de resumo
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
          nome: item.colecao.nome,
          previsto: item.numeroModelos,
          criados: item.modelos.length,
          ...statusCounts,
        };
      });

      setData(resumo);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Buscar dados ao montar o componente
    fetchData();

    // Configurar auto-refresh
    const interval = setInterval(fetchData, REFRESH_INTERVAL);

    // Limpar interval ao desmontar
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-tv-background p-8">
      <div className="max-w-[95vw] mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-5xl font-bold text-tv-text">Andamento das Coleções</h1>
          {lastUpdate && (
            <p className="text-tv-text-muted text-2xl">
              Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-tv-header">
                <th className="text-tv-text text-left py-6 px-8 text-3xl font-semibold border-b-2 border-tv-text/20">
                  Coleção
                </th>
                <th className="text-tv-text text-center py-6 px-8 text-3xl font-semibold border-b-2 border-tv-text/20">
                  Previsto
                </th>
                <th className="text-tv-text text-center py-6 px-8 text-3xl font-semibold border-b-2 border-tv-text/20">
                  Criados
                </th>
                <th className="text-status-not-started text-center py-6 px-8 text-3xl font-semibold border-b-2 border-tv-text/20">
                  Não iniciado
                </th>
                <th className="text-status-in-progress text-center py-6 px-8 text-3xl font-semibold border-b-2 border-tv-text/20">
                  Em desenvolvimento
                </th>
                <th className="text-status-approved text-center py-6 px-8 text-3xl font-semibold border-b-2 border-tv-text/20">
                  Aprovado
                </th>
                <th className="text-status-rejected text-center py-6 px-8 text-3xl font-semibold border-b-2 border-tv-text/20">
                  Reprovado
                </th>
                <th className="text-status-cancelled text-center py-6 px-8 text-3xl font-semibold border-b-2 border-tv-text/20">
                  Cancelado
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={row.nome}
                  className={index % 2 === 0 ? "bg-tv-row-even" : "bg-tv-row-odd"}
                >
                  <td className="text-tv-text py-5 px-8 text-2xl border-b border-tv-text/10">
                    {row.nome}
                  </td>
                  <td className="text-tv-text text-center py-5 px-8 text-2xl font-semibold border-b border-tv-text/10">
                    {row.previsto}
                  </td>
                  <td className="text-tv-text text-center py-5 px-8 text-2xl font-semibold border-b border-tv-text/10">
                    {row.criados}
                  </td>
                  <td className="text-status-not-started text-center py-5 px-8 text-2xl font-bold border-b border-tv-text/10">
                    {row.naoIniciado}
                  </td>
                  <td className="text-status-in-progress text-center py-5 px-8 text-2xl font-bold border-b border-tv-text/10">
                    {row.emDesenvolvimento}
                  </td>
                  <td className="text-status-approved text-center py-5 px-8 text-2xl font-bold border-b border-tv-text/10">
                    {row.aprovado}
                  </td>
                  <td className="text-status-rejected text-center py-5 px-8 text-2xl font-bold border-b border-tv-text/10">
                    {row.reprovado}
                  </td>
                  <td className="text-status-cancelled text-center py-5 px-8 text-2xl font-bold border-b border-tv-text/10">
                    {row.cancelado}
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
