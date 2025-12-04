import { useEffect, useState } from "react";
import { fetchGestaoModelo, ResumoColecao } from "../services/gestaoModeloService";

const REFRESH_INTERVAL = 60000;
const initialState = {
  error: null as string | null,
  data: [] as ResumoColecao[],
  loading: true,
};

export function useGestaoModelo() {
  const [stateLocal, setStateLocal] = useState(initialState);

  async function loadData() {
    try {
      setStateLocal((prev) => ({
        ...prev,
        error: null,
      }));
      const resumo = await fetchGestaoModelo();
      setStateLocal((prev) => ({
        ...prev,
        data: resumo,
        loading: false,
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : "Erro ao carregar";
      setStateLocal((prev) => ({
        ...prev,
        loading: false,
        error: error,
      }));
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);
  const { data, loading, error } = stateLocal;

  return { data, loading, error };
}
