import { defineStore } from "pinia";

export const useColorsPalette = defineStore("colorsPalette", {
  state: () => ({ 
    colors: [
      {
        color: "#ff0000",
        name: "vermelho"
      },
      {
        color: "#ff7f00",
        name: "laranja"
      },
      {
        color: "#ffff00",
        name: "amarelo"
      },
      {
        color: "#00ff00",
        name: "verde"
      },
      {
        color: "#0000ff",
        name: "azul"
      },
      {
        color: "#ff00ff",
        name: "violeta"
      },
      {
        color: "#ff007f",
        name: "rosa"
      },
      {
        color: "#800080",
        name: "roxo"
      },
      {
        color: "#ffffff",
        name: "branco"
      },
      {
        color: "#c0c0c0",
        name: "cinza"
      },
      {
        color: "#000000",
        name: "preto"
      },
      {
        color: "#00ffff",
        name: "azul claro"
      },
      {
        color: "#00ff7f",
        name: "verde claro"
      },
      {
        color: "#ffff7f",
        name: "amarelo claro"
      },
      {
        color: "#ff7f7f",
        name: "laranja claro"
      },
      {
        color: "#ff7f00",
        name: "rosa claro"
      },
      {
        color: "#f5f5f5",
        name: "bege"
      },
      {
        color: "#c0c0c0",
        name: "cinza"
      },
      {
        color: "#663300",
        name: "marrom"
      }
    ]
  })})