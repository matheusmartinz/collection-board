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
  {
    colecao: { uuid: "7", codigo: "007", nome: "CASUAL MASCULINO" },
    numeroModelos: 22,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "EM_DESENVOLVIMENTO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "APROVADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "REPROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "CANCELADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "EM_DESENVOLVIMENTO" },
      { codigo: "014", nome: "Modelo 14", status: "NAO_INICIADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "8", codigo: "008", nome: "CASUAL FEMININO" },
    numeroModelos: 28,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "REPROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "APROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "APROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "CANCELADO" },
      { codigo: "016", nome: "Modelo 16", status: "APROVADO" },
      { codigo: "017", nome: "Modelo 17", status: "EM_DESENVOLVIMENTO" },
      { codigo: "018", nome: "Modelo 18", status: "NAO_INICIADO" },
    ],
  },
  {
    colecao: { uuid: "9", codigo: "009", nome: "ESPORTIVO 2025" },
    numeroModelos: 30,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "NAO_INICIADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "APROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "REPROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
      { codigo: "016", nome: "Modelo 16", status: "CANCELADO" },
      { codigo: "017", nome: "Modelo 17", status: "EM_DESENVOLVIMENTO" },
      { codigo: "018", nome: "Modelo 18", status: "NAO_INICIADO" },
      { codigo: "019", nome: "Modelo 19", status: "APROVADO" },
      { codigo: "020", nome: "Modelo 20", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "10", codigo: "010", nome: "INFANTIL VERÃO" },
    numeroModelos: 16,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "REPROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "11", codigo: "011", nome: "MODA PRAIA" },
    numeroModelos: 14,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "CANCELADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "12", codigo: "012", nome: "EXECUTIVO PREMIUM" },
    numeroModelos: 10,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "REPROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "13", codigo: "013", nome: "JEANS COLLECTION" },
    numeroModelos: 24,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "APROVADO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "EM_DESENVOLVIMENTO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "NAO_INICIADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "REPROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "APROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "APROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "CANCELADO" },
      { codigo: "016", nome: "Modelo 16", status: "APROVADO" },
      { codigo: "017", nome: "Modelo 17", status: "EM_DESENVOLVIMENTO" },
    ],
  },
  {
    colecao: { uuid: "14", codigo: "014", nome: "ACESSÓRIOS 2025" },
    numeroModelos: 18,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "REPROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "15", codigo: "015", nome: "FESTA & EVENTOS" },
    numeroModelos: 12,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "EM_DESENVOLVIMENTO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "REPROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "16", codigo: "016", nome: "PLUS SIZE" },
    numeroModelos: 20,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "CANCELADO" },
      { codigo: "013", nome: "Modelo 13", status: "APROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "REPROVADO" },
    ],
  },
  {
    colecao: { uuid: "17", codigo: "017", nome: "ECO FASHION" },
    numeroModelos: 15,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "EM_DESENVOLVIMENTO" },
      { codigo: "004", nome: "Modelo 4", status: "NAO_INICIADO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "APROVADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "EM_DESENVOLVIMENTO" },
      { codigo: "010", nome: "Modelo 10", status: "REPROVADO" },
    ],
  },
  {
    colecao: { uuid: "18", codigo: "018", nome: "UNDERWEAR LINE" },
    numeroModelos: 22,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "APROVADO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "EM_DESENVOLVIMENTO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "NAO_INICIADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "CANCELADO" },
      { codigo: "014", nome: "Modelo 14", status: "APROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "REPROVADO" },
    ],
  },
  {
    colecao: { uuid: "19", codigo: "019", nome: "STREET WEAR" },
    numeroModelos: 26,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "EM_DESENVOLVIMENTO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "NAO_INICIADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "APROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "REPROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
      { codigo: "016", nome: "Modelo 16", status: "CANCELADO" },
      { codigo: "017", nome: "Modelo 17", status: "EM_DESENVOLVIMENTO" },
      { codigo: "018", nome: "Modelo 18", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "20", codigo: "020", nome: "VINTAGE REVIVAL" },
    numeroModelos: 14,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "EM_DESENVOLVIMENTO" },
      { codigo: "004", nome: "Modelo 4", status: "NAO_INICIADO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "APROVADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "REPROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "21", codigo: "021", nome: "WORKOUT COLLECTION" },
    numeroModelos: 28,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "APROVADO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "EM_DESENVOLVIMENTO" },
      { codigo: "008", nome: "Modelo 8", status: "EM_DESENVOLVIMENTO" },
      { codigo: "009", nome: "Modelo 9", status: "NAO_INICIADO" },
      { codigo: "010", nome: "Modelo 10", status: "NAO_INICIADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "APROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "REPROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
      { codigo: "016", nome: "Modelo 16", status: "CANCELADO" },
      { codigo: "017", nome: "Modelo 17", status: "EM_DESENVOLVIMENTO" },
      { codigo: "018", nome: "Modelo 18", status: "APROVADO" },
      { codigo: "019", nome: "Modelo 19", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "22", codigo: "022", nome: "CALÇADOS VERÃO" },
    numeroModelos: 19,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "REPROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "CANCELADO" },
    ],
  },
  {
    colecao: { uuid: "23", codigo: "023", nome: "BOLSAS & CARTEIRAS" },
    numeroModelos: 17,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "REPROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "24", codigo: "024", nome: "COURO & SINTÉTICO" },
    numeroModelos: 21,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "NAO_INICIADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "REPROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "CANCELADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "25", codigo: "025", nome: "MODA TEEN" },
    numeroModelos: 23,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "EM_DESENVOLVIMENTO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "NAO_INICIADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "REPROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "CANCELADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
      { codigo: "016", nome: "Modelo 16", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "26", codigo: "026", nome: "HOMEWEAR" },
    numeroModelos: 16,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
      { codigo: "009", nome: "Modelo 9", status: "REPROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "27", codigo: "027", nome: "PIJAMAS & ROBES" },
    numeroModelos: 13,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "EM_DESENVOLVIMENTO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "NAO_INICIADO" },
      { codigo: "007", nome: "Modelo 7", status: "APROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "CANCELADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "28", codigo: "028", nome: "MODA GESTANTE" },
    numeroModelos: 11,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "EM_DESENVOLVIMENTO" },
      { codigo: "004", nome: "Modelo 4", status: "NAO_INICIADO" },
      { codigo: "005", nome: "Modelo 5", status: "NAO_INICIADO" },
      { codigo: "006", nome: "Modelo 6", status: "APROVADO" },
      { codigo: "007", nome: "Modelo 7", status: "REPROVADO" },
      { codigo: "008", nome: "Modelo 8", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "29", codigo: "029", nome: "UNIFORMES PROFISSIONAIS" },
    numeroModelos: 18,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "EM_DESENVOLVIMENTO" },
      { codigo: "006", nome: "Modelo 6", status: "EM_DESENVOLVIMENTO" },
      { codigo: "007", nome: "Modelo 7", status: "NAO_INICIADO" },
      { codigo: "008", nome: "Modelo 8", status: "NAO_INICIADO" },
      { codigo: "009", nome: "Modelo 9", status: "APROVADO" },
      { codigo: "010", nome: "Modelo 10", status: "APROVADO" },
      { codigo: "011", nome: "Modelo 11", status: "REPROVADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
    ],
  },
  {
    colecao: { uuid: "30", codigo: "030", nome: "BÁSICOS ESSENCIAIS" },
    numeroModelos: 32,
    modelos: [
      { codigo: "001", nome: "Modelo 1", status: "APROVADO" },
      { codigo: "002", nome: "Modelo 2", status: "APROVADO" },
      { codigo: "003", nome: "Modelo 3", status: "APROVADO" },
      { codigo: "004", nome: "Modelo 4", status: "APROVADO" },
      { codigo: "005", nome: "Modelo 5", status: "APROVADO" },
      { codigo: "006", nome: "Modelo 6", status: "APROVADO" },
      { codigo: "007", nome: "Modelo 7", status: "EM_DESENVOLVIMENTO" },
      { codigo: "008", nome: "Modelo 8", status: "EM_DESENVOLVIMENTO" },
      { codigo: "009", nome: "Modelo 9", status: "EM_DESENVOLVIMENTO" },
      { codigo: "010", nome: "Modelo 10", status: "NAO_INICIADO" },
      { codigo: "011", nome: "Modelo 11", status: "NAO_INICIADO" },
      { codigo: "012", nome: "Modelo 12", status: "APROVADO" },
      { codigo: "013", nome: "Modelo 13", status: "APROVADO" },
      { codigo: "014", nome: "Modelo 14", status: "APROVADO" },
      { codigo: "015", nome: "Modelo 15", status: "APROVADO" },
      { codigo: "016", nome: "Modelo 16", status: "REPROVADO" },
      { codigo: "017", nome: "Modelo 17", status: "CANCELADO" },
      { codigo: "018", nome: "Modelo 18", status: "APROVADO" },
      { codigo: "019", nome: "Modelo 19", status: "APROVADO" },
      { codigo: "020", nome: "Modelo 20", status: "APROVADO" },
      { codigo: "021", nome: "Modelo 21", status: "EM_DESENVOLVIMENTO" },
      { codigo: "022", nome: "Modelo 22", status: "APROVADO" },
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
    <div className="min-h-screen bg-tv-background">
      {/* Header principal */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          height: "10vh",
          marginBottom: "5vh",
          backgroundColor: "#263c2b"
        }}
      >
        <div className="flex items-center gap-6 w-full">
          <div className="text-peon-white text-2xl font-bold">LOGO</div>
          <h1 className="text-peon-white text-4xl font-bold flex-1 text-center">
            Andamento das Coleções
          </h1>
        </div>
      </div>

      {/* Wrapper branco ao redor da tabela */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#FFFFFF",
          width: "100%",
          padding: "0px 20px 10px 20px",
          flexGrow: 1
        }}
      >
        {/* Área de scroll da tabela */}
        <div
          style={{
            height: "80vh",
            width: "100%",
            overflowY: "auto",
            overflowX: "auto"
          }}
        >
          {/* Tabela estilo Dash */}
          <table className="w-full border-collapse" style={{ fontFamily: 'Arial' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ backgroundColor: '#263c2b' }}>
                <th className="text-white font-bold text-center py-2 px-1 text-base" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#263c2b' }}>
                  Coleção
                </th>
                <th className="text-white font-bold text-center py-2 px-1 text-base" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#263c2b' }}>
                  Previsto
                </th>
                <th className="text-white font-bold text-center py-2 px-1 text-base" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#263c2b' }}>
                  Criados
                </th>
                <th className="text-white font-bold text-center py-2 px-1 text-base" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#263c2b' }}>
                  Não iniciado
                </th>
                <th className="text-white font-bold text-center py-2 px-1 text-base" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#263c2b' }}>
                  Em desenvolvimento
                </th>
                <th className="text-white font-bold text-center py-2 px-1 text-base" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#263c2b' }}>
                  Aprovado
                </th>
                <th className="text-white font-bold text-center py-2 px-1 text-base" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#263c2b' }}>
                  Reprovado
                </th>
                <th className="text-white font-bold text-center py-2 px-1 text-base" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#263c2b' }}>
                  Cancelado
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#FAFBFA' }}>
              {data.map((row, index) => (
                <tr key={row.nome}>
                  <td className="text-tv-text text-center py-1 px-1" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Arial' }}>
                    {row.nome}
                  </td>
                  <td className="text-tv-text text-center py-1 px-1" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Arial' }}>
                    {row.previsto} (100%)
                  </td>
                  <td className="text-tv-text text-center py-1 px-1" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Arial' }}>
                    {row.criados} ({((row.criados / row.previsto) * 100).toFixed(2)}%)
                  </td>
                  <td className="text-status-not-started text-center py-1 px-1 font-bold" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Arial' }}>
                    {row.naoIniciado} ({((row.naoIniciado / row.previsto) * 100).toFixed(2)}%)
                  </td>
                  <td className="text-status-in-progress text-center py-1 px-1 font-bold" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Arial' }}>
                    {row.emDesenvolvimento} ({((row.emDesenvolvimento / row.previsto) * 100).toFixed(2)}%)
                  </td>
                  <td className="text-status-approved text-center py-1 px-1 font-bold" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Arial' }}>
                    {row.aprovado} ({((row.aprovado / row.previsto) * 100).toFixed(2)}%)
                  </td>
                  <td className="text-status-rejected text-center py-1 px-1 font-bold" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Arial' }}>
                    {row.reprovado} ({((row.reprovado / row.previsto) * 100).toFixed(2)}%)
                  </td>
                  <td className="text-status-cancelled text-center py-1 px-1 font-bold" style={{ border: '1px solid #ccc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Arial' }}>
                    {row.cancelado} ({((row.cancelado / row.previsto) * 100).toFixed(2)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Última atualização */}
          {lastUpdate && (
            <div className="text-center py-4">
              <p className="text-tv-text-muted text-sm">
                Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
