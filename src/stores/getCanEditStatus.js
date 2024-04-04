import { defineStore } from 'pinia';
import useFetch from "../boot/useFetch";
export const getCanEditStatus = defineStore({
  id: 'canEdit',
  actions: {
    getUserCanEditStatus(){
      const opt  = {
        route: '/desktop/users/getUserCanEditStatus'
      }
      return useFetch(opt)
    },
  },
});
