export interface Colecao {
  uuid: string;
  codigo: string;
  nome: string;
}

export interface Modelo {
  codigo: string;
  nome: string;
  status: "NAO_INICIADO" | "EM_DESENVOLVIMENTO" | "APROVADO" | "REPROVADO" | "CANCELADO";
}

export interface ColecaoData {
  colecao: Colecao;
  numeroModelos: number;
  modelos: Modelo[];
}

export interface ResumoColecao {
  nome: string;
  previsto: number;
  criados: number;
  naoIniciado: number;
  emDesenvolvimento: number;
  aprovado: number;
  reprovado: number;
  cancelado: number;
}

const API_URL = "https://eboard.service.bck.peon.tec.br/proxy/gestao-modelo";

export async function fetchGestaoModelo(): Promise<ResumoColecao[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const apiData: ColecaoData[] = await response.json();

  return apiData.map((item) => {
    const statusCounts = {
      naoIniciado: 0,
      emDesenvolvimento: 0,
      aprovado: 0,
      reprovado: 0,
      cancelado: 0,
    };

    item.modelos.forEach((modelo) => {
      statusCounts[
        (
          {
            NAO_INICIADO: "naoIniciado",
            EM_DESENVOLVIMENTO: "emDesenvolvimento",
            APROVADO: "aprovado",
            REPROVADO: "reprovado",
            CANCELADO: "cancelado",
          } as const
        )[modelo.status]
      ]++;
    });

    return {
      nome: `${item.colecao.codigo} - ${item.colecao.nome}`,
      previsto: item.numeroModelos,
      criados: item.modelos.length,
      ...statusCounts,
    };
  });
}
