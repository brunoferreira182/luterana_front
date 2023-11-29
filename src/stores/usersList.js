import { defineStore } from "pinia";
export const savedUsersList = defineStore("savedUsersList", {
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