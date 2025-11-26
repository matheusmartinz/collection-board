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
const USE_MOCK_DATA = true; // Altere para false quando quiser usar a API real

// Dados mockados para teste
const MOCK_DATA: ColecaoData[] = [
  {
    colecao: { uuid: "1", codigo: "001", nome: "SALDO E BRINDES" },
    numeroModelos: 15,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "EM_DESENVOLVIMENTO" },
      { codigo: "004", nome: "Modelo 4", status: "NAO_INICIADO" },
      { codigo: "005", nome: "Modelo 5", status: "APROVADO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "REPROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "NAO_INICIADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "CANCELADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "2", codigo: "002", nome: "VERÃO 2025" },
    numeroModelos: 20,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "REPROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "EM_DESENVOLVIMENTO" },
      { codigo: "014", nome: "Modelo 14", status: "APROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "3", codigo: "003", nome: "INVERNO 2025" },
    numeroModelos: 18,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "EM_DESENVOLVIMENTO" },
      { codigo: "002", nome: "Modelo 2", status: "EM_DESENVOLVIMENTO" },
      { codigo: "003", nome: "Modelo 3", status: "EM_DESENVOLVIMENTO" },
      { codigo: "004", nome: "Modelo 4", status: "NAO_INICIADO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "4", codigo: "004", nome: "PRIMAVERA 2025" },
    numeroModelos: 12,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "NAO_INICIADO" },
      { codigo: "002", nome: "Modelo 2", status: "NAO_INICIADO" },
      { codigo: "003", nome: "Modelo 3", status: "NAO_INICIADO" },
      { codigo: "004", nome: "Modelo 4", status: "NAO_INICIADO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
    ],
  },
  {
    colecao: { uuid: "5", codigo: "005", nome: "LINHA PREMIUM" },
    numeroModelos: 8,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "APROVADO" },
      { codigo: "006", nome: "Modelo 6", status: "REPROVADO" },
      { codigo: "007", nome: "Modelo 7", status: "EM_DESENVOLVIMENTO" },
      { codigo: "008", nome: "Modelo 8", status: "EM_DESENVOLVIMENTO" },
    ],
  },
  {
    colecao: { uuid: "6", codigo: "006", nome: "OUTLET" },
    numeroModelos: 25,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "APROVADO" },
      { codigo: "006", nome: "Modelo 6", status: "CANCELADO" },
      { codigo: "007", nome: "Modelo 7", status: "CANCELADO" },
      { codigo: "008", nome: "Modelo 8", status: "CANCELADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "REPROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "APROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "APROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
      { codigo: "016", nome: "Modelo 16", status: "APROVADO" },
      { codigo: "017", nome: "Modelo 17", status: "EM_DESENVOLVIMENTO" },
    ],
  },
];

const Board = () => {
  const [data, setData] = useState<ResumoColecao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      
      let apiData: ColecaoData[];
      
      if (USE_MOCK_DATA) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        apiData = MOCK_DATA;
      } else {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }
        
        apiData = await response.json();
      }
      
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
    <div className="min-h-screen bg-tv-background px-6 py-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-tv-text">Andamento das Coleções</h1>
        {lastUpdate && (
          <p className="text-tv-text-muted text-xl">
            Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
          </p>
        )}
      </div>

      <div className="w-full">
        <table className="w-full border-collapse" style={{ fontFamily: 'Arial, Roboto, sans-serif' }}>
          <thead>
            <tr className="bg-tv-header">
              <th className="text-tv-text-header text-left py-[18px] px-6 text-[32px] font-semibold border-b border-tv-text-header/10" style={{ width: '18%' }}>
                Coleção
              </th>
              <th className="text-tv-text-header text-center py-[18px] px-6 text-[32px] font-semibold border-b border-tv-text-header/10" style={{ width: '10%' }}>
                Previsto
              </th>
              <th className="text-tv-text-header text-center py-[18px] px-6 text-[32px] font-semibold border-b border-tv-text-header/10" style={{ width: '10%' }}>
                Criados
              </th>
              <th className="text-tv-text-header text-center py-[18px] px-6 text-[32px] font-semibold border-b border-tv-text-header/10" style={{ width: '12%' }}>
                Não iniciado
              </th>
              <th className="text-tv-text-header text-center py-[18px] px-6 text-[32px] font-semibold border-b border-tv-text-header/10" style={{ width: '15%' }}>
                Em desenvolvimento
              </th>
              <th className="text-tv-text-header text-center py-[18px] px-6 text-[32px] font-semibold border-b border-tv-text-header/10" style={{ width: '12%' }}>
                Aprovado
              </th>
              <th className="text-tv-text-header text-center py-[18px] px-6 text-[32px] font-semibold border-b border-tv-text-header/10" style={{ width: '12%' }}>
                Reprovado
              </th>
              <th className="text-tv-text-header text-center py-[18px] px-6 text-[32px] font-semibold border-b border-tv-text-header/10" style={{ width: '11%' }}>
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
                <td className="text-tv-text py-[18px] px-6 text-[28px] font-semibold border-b border-tv-text/10">
                  {row.nome}
                </td>
                <td className="text-tv-text text-center py-[18px] px-6 text-[28px] font-semibold border-b border-tv-text/10">
                  {row.previsto}
                </td>
                <td className="text-tv-text text-center py-[18px] px-6 text-[28px] font-semibold border-b border-tv-text/10">
                  {row.criados}
                </td>
                <td className="text-status-not-started text-center py-[18px] px-6 text-[28px] font-bold border-b border-tv-text/10">
                  {row.naoIniciado}
                </td>
                <td className="text-status-in-progress text-center py-[18px] px-6 text-[28px] font-bold border-b border-tv-text/10">
                  {row.emDesenvolvimento}
                </td>
                <td className="text-status-approved text-center py-[18px] px-6 text-[28px] font-bold border-b border-tv-text/10">
                  {row.aprovado}
                </td>
                <td className="text-status-rejected text-center py-[18px] px-6 text-[28px] font-bold border-b border-tv-text/10">
                  {row.reprovado}
                </td>
                <td className="text-status-cancelled text-center py-[18px] px-6 text-[28px] font-bold border-b border-tv-text/10">
                  {row.cancelado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Board;
