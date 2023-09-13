import {
  MODE_AUTH_SERVER,
  MODE_MASTER_SERVER,
  PROJECT_NAME,
} from "./variables";
import CryptoJS from "crypto-js";
import { Loading, Notify, LocalStorage } from "quasar";
import useFetch from "./useFetch";

let loadingVar = [];
let updateUserInfoOnNextRoute = false;
const useUtils = {
  async fetchIuguId() {
    const ret = await useFetch({ route: "/iugu/getIuguTokenByCid" });
    setIuguId(ret.data);
  },
  userType: {
    async fetchAndRegister() {
      const ret = await useFetch({
        route: "/mobile/profile/getSelectedUserType",
      });
      window.localStorage.setItem("ut", JSON.stringify(ret.data));
    },
    get() {
      return JSON.parse(window.localStorage.getItem("ut"));
    },
  },

  updateNextRoute: {
    get() {
      return updateUserInfoOnNextRoute;
    },
    set(val) {
      updateUserInfoOnNextRoute = val;
      // const userInfo = this.getUserInfoByToken()
      return;
    },
  },
  presentUserInfo() {
    const key = LocalStorage.getItem("$k");
    const udCr = LocalStorage.getItem("u");
    if (!udCr || !key) return false;
    const ud = JSON.parse(
      CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8)
    );
    return ud;
  },
  registerLogin(data) {
    const key = window.localStorage.getItem("$k");
    const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    window.localStorage.setItem("u" + data.userId, d);
    window.localStorage.setItem("au", data.userId);
    this.userType.fetchAndRegister();
  },
  getUSerProfilePhotoUrl() {
    const userInfo = this.presentUserInfo();
    return (
      this.attachmentsAddress() +
      userInfo.profilePhoto +
      "?" +
      new Date().getTime()
    );
  },
  localStorage: {
    set(key, value) {
      window.localStorage.setItem(key, JSON.stringify(value));
      return;
    },
    get(key) {
      return JSON.parse(window.localStorage.getItem(key));
    },
  },
  loading: {
    async loadingMk(message) {
      loadingVar = await Loading.create({
        message: message ? message : "Aguarde",
      });
    },
    async loadingMkArr(message) {
      loadingVar.push(
        await Loading.create({
          message: message ? message : "Aguarde",
        })
      );
      return loadingVar.length - 1;
    },
    async show(message) {
      await this.loadingMk(message);
      loadingVar.present();
    },
    async hide() {
      try {
        await loadingVar.dismiss();
      } catch (e) {
        return;
      }
    },
    async clear() {
      try {
        await loadingVar.dismiss();
      } catch (e) {
        return;
      }
    },
  },
  // isSystemComplete() {
  //   return SYSTEM_COMPLETE;
  // },
  async registerUserDataAndKey({ data, key }) {
    LocalStorage.set("$k", key);
    const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    LocalStorage.set("u", d);
    return;
  },
  urlIframeAdmin() {
    if (MODE_IFRAME === "local") return "http://localhost:8302/#";
    else return "https://homolr.b3dev.net/Admin/front/#";
  },

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  errorMessages(type) {
    let ret;
    Vue.prototype.$errorMessages.forEach((e) => {
      if (e.name === type) ret = e.label;
    });
    Notify.create(ret);
    return ret;
  },
  presentOriginalUserInfo() {
    const key = window.localStorage.getItem("$k");
    const activeUser = window.localStorage.getItem("ul");
    const udCr = window.localStorage.getItem("u" + activeUser);
    if (!udCr || !key) return false;
    let ud;
    let error = false;
    try {
      ud = JSON.parse(
        CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8)
      );
    } catch (e) {
      error = true;
    }
    if (!error) return ud;
    // window.location.href = '/login'
    return ud;
  },
  setActiveUser(id) {
    window.localStorage.setItem("au", id);
  },
  attachmentsAddress() {
    if (
      MODE_MASTER_SERVER === "dev" &&
      MODE_MASTER_SERVER === "dev_ext" &&
      MODE_MASTER_SERVER === "prod"
    )
      return masterServerRoute() + `/static/${PROJECT_NAME}/`;
    else return masterServerRoute("dev_ext") + `/static/${PROJECT_NAME}/`;
  },
  getPermissions() {
    const opt = {
      route: "/auth/getUserPermissionsOnly",
    };
    return useFetch(opt);
  },
  getUserInfoByToken() {
    const opt = {
      mode: MODE_AUTH_SERVER,
      route: "/getUserInfoByToken",
    };
    return useFetch(opt);
  },
  getDrawerOptions(type) {
    const obj = {
      admin: [
        {
          label: "Lista de Usuários",
          route: "/admin/usersList",
          icon: "group",
        },
        {
          label: "Lista de Organismos",
          route: "/admin/organismsList",
          icon: "diversity_2",
        },
        {
          label: "Títulos",
          route: "/admin/titlesList",
          icon: "import_contacts",
        },
        {
          label: "Solicitações de Títulos",
          route: "/admin/titlesSolicitationsList",
          icon: "list",
        },
        {
          label: "Solicitações de Funções",
          route: "/admin/functionsSolicitations",
          icon: "list",
        },
      ],
      config: [
        {
          label: "Configuração de tipos de organismos",
          route: "/config/organismTypeConfigList",
          icon: "edit_square",
        },
        {
          label: "Configuração de Organismos",
          route: "/config/organismConfigurationList",
          icon: "diversity_2",
        },
        {
          label: "Configuração de usuário",
          route: "/config/createUserConfig",
          icon: "group",
        },
        {
          label: "Títulos",
          route: "/config/titleConfigurationList",
          icon: "import_contacts",
        },
        {
          label: "Visões",
          route: "/config/visionsList",
          icon: "visibility",
        },
        {
          label: "Configuração de formulário",
          route: "/config/formConfigList",
          icon: "forum",
        },
        {
          label: "Grupo de funções",
          route: "/config/functionsGroupList",
          icon: "workspaces",
        },
      ],
      attach: [
        {
          label: "Novo anexo",
          route: "/attach/createAttachment",
          icon: "add",
        },
        {
          label: "Compartilhados comigo",
          route: "/attach/receivedAttachments",
          icon: "share",
        },
        {
          label: "Enviados",
          route: "/attach/sentAttachments",
          icon: "send",
        },
      ],
      orgs: [        
        {
          label: "Lista dos meus organismos",
          route: "/orgs/userOrganismsList",
          icon: "speaker_notes",
        },
      ],
      user: [
        {
          label: "Meus dados pessoais",
          route: "/user/userPersonalData",
          icon: "folder_shared",
        },
        {
          label: "Minha rede",
          route: "/user/organismsList",
          icon: "diversity_2",
        },
        {
          label: "Lista das minhas funções",
          route: "/user/userFunctionsList",
          icon: "comment_bank",
        },
        {
          label: "Lista de solicitações",
          route: "/user/userSolicitationsList",
          icon: "format_list_bulleted",
        },
      ],
    };
    return obj[type];
  },
  getUserPermissionByRole(role) {
    const opt = {
      route: "/getUserPermissionByRole",
      mode: MODE_AUTH_SERVER,
      body: {},
    };
    if (typeof role === "object") {
      const arrayRoles = [];
      Object.keys(role).forEach((k) => {
        arrayRoles.push(k);
      });
      opt.body.arrayRoles = arrayRoles;
    } else opt.body.role = role;
    return useFetch(opt);
  },
  convertToArrayIntoArray({ data, itemsPerRow }) {
    const tempRows = [];
    let tempCols = [];
    if (data.length === 1) return [data];
    data.forEach((s, i) => {
      if (i % itemsPerRow === itemsPerRow - 1) {
        tempCols.push(s);
        tempRows.push(tempCols);
        tempCols = [];
      } else {
        tempCols.push(s);
        if (i === data.length - 1) tempRows.push(tempCols);
      }
    });
    return tempRows;
  },
  verifyIfClientHasPaymentMethod() {
    const opt = {
      route: "/templeClub/verifyIfClientHasPaymentMethod",
    };
    return useFetch(opt);
  },
  getUserAddress: async function () {
    const opt = {
      route: "/getUserAddress",
      mode: MODE_AUTH_SERVER,
    };
    return useFetch(opt);
  },
};
export default useUtils;
