import { defineStore } from "pinia";
export const savedPastorsList = defineStore("savedPastorsList", {
  state: () => ({ 
    list: [],
    page: 1,
    rowsPerPage: 15,
    rowsNumber: 0,
    sortBy: "",
    selectFilter: '',
    filter: ''
  })
})