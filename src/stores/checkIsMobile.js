import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';

export const useScreenStore = defineStore({
  id: 'screen',
  state: () => ({
    isMobileState: false,
  }),
  getters: {
    isMobile: (state) => state.isMobileState,
  },
  actions: {
    setIsMobile(isMobile) {
      this.isMobileState = isMobile;
    },
    checkScreenSize() {
      const $q = useQuasar();
      this.setIsMobile($q.platform.is.mobile ? true : false);
    },
  },
});
