import { defineStore } from "pinia";



export const useMasks = defineStore("masks", {
  state: () => ({ 
    masks: [
      {cpf: '' }
    ]
  }),
  actions: {
    formatCPF(cpfIndex) {
      this.masks[cpfIndex].cpf = formatCPF(this.masks[cpfIndex].cpf);
    }
  },
  function:{ 
    formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return cpf;
    } 
  }
})