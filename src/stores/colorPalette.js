import { defineStore } from "pinia";

export const useColorsPalette = defineStore("colorsPalette", {
  state: () => ({ 
    colors: [
      {
        color: "#f44336",
        name: "vermelho"
      },
      {
        color: "#ff9800",
        name: "laranja"
      },
      {
        color: "#ffeb3b",
        name: "amarelo"
      },
      {
        color: "#4caf50",
        name: "verde"
      },
      {
        color: "#2196f3",
        name: "azul"
      },
      {
        color: "#3f51b5",
        name: "violeta"
      },
      {
        color: "#e91e63",
        name: "rosa"
      },
      {
        color: "#9c27b0",
        name: "roxo"
      },
      {
        color: "#9e9e9e",
        name: "cinza"
      },
      {
        color: "#03a9f4",
        name: "azul claro"
      },
      {
        color: "#8bc34a",
        name: "verde claro"
      },
      {
        color: "#ffc107",
        name: "amarelo claro"
      },
      {
        color: "#ff5722",
        name: "laranja escuro"
      },
      {
        color: "#607d8b",
        name: "azul cinza"
      },
      {
        color: "#795548",
        name: "marrom"
      }
    ]
  })})