import { defineStore } from "pinia";

export const useColorsPalette = defineStore("colorsPalette", {
  state: () => ({ 
    colors: [
        "#f44336",
        "#ff9800",
        "#ffeb3b",
        "#4caf50",
        "#2196f3",
        "#3f51b5",
        "#e91e63",
        "#9c27b0",
        "#9e9e9e",
        "#03a9f4",
        "#8bc34a",
        "#ffc107",
        "#ff5722",
        "#607d8b",
        "#795548",
        "#673ab7",
        "#64ffda",
        "#009688",
        "#c0ca33",
        "#689f38",
    ]
  })})