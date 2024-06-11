// import { MODE_AUTH_SERVER } from "./variables";
import CryptoJS from "crypto-js";
import { LocalStorage } from "quasar";
import useFetch from "./useFetch";
import { calculateMasterServerAttachmentsRoute } from "./masterServerRoutes";
import { masterServerRoute } from './masterServerRoutes'
import { Filesystem } from '@capacitor/filesystem';

const useUtils = {
  async download (obj) {
    const opt = {
      url: `${masterServerRoute()}/static/${obj.filename}`,
      method: 'GET',
    }
    const dl = await Filesystem.downloadFile(opt)
    const blob = new Blob([dl.blob], {type: obj.mimetype})
    const link = URL.createObjectURL(blob)
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = link;
    a.download = obj.originalname;
    a.click();
    URL.revokeObjectURL(link);
  },
  // downloadFile (options) {
  //   const opt = {
  //     method: 'GET',
  //     responseType: 'blob',
  //     route: '/download/' + options.filename
  //   }
  //   useFetch(opt).then((response) => {
  //     console.log('entrou', typeof response)
  //     const blob = new Blob([response], {type: options.type})
  //     console.log('blob', blob)
  //     const link = URL.createObjectURL(blob)
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.href = link;
  //     a.download = options.originalname;
  //     a.click();
  //     URL.revokeObjectURL(link);
  //   })
  // },
  makeFileUrl (filename) {
    // console.log(filename, 'quer ver que ta chegando')
    if (!filename) return '/assets/default_avatar.svg'
    return this.attachmentsAddress() + filename + '?' + new Date().getTime()
  },
  attachmentsAddress () {
    return calculateMasterServerAttachmentsRoute();
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
  async registerUserDataAndKey({ data, key }) {
    LocalStorage.set("$k", key);
    const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    LocalStorage.set("u", d);
    return;
  },
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  getPermissions() {
    const opt = {
      route: "/auth/getUserPermissionsOnly",
    };
    return useFetch(opt);
  },
  getPermissionStatus(permissionRole) {
    const opt = {
      route: "/auth/getPermissionStatus",
      body: {
        permissionRole
      }
    };
    return useFetch(opt);
  },
  //api quebrada no backend não utilizar
  // getUserInfoByToken() {
  //   const opt = {
  //     mode: MODE_AUTH_SERVER,
  //     route: "/getUserInfoByToken",
  //   };
  //   return useFetch(opt);
  // },
  getDrawerOptions(type) {
    const obj = {
      admin: [
        {
          label: "Lista de Usuários",
          route: "/admin/usersList",
          icon: "group",
        },
        {
          label: "Lista de Pastores",
          route: "/admin/pastorsList",
          icon: "sort",
        },
        {
          label: "Rede",
          route: "/admin/organismsList",
          icon: "diversity_2",
        },
        {
          label: "Lista de solicitações",
          route: "/admin/admSolicitationsList",
          icon: "checklist",
        },
        {
          label: "Lista de sugestões",
          route: "/admin/admSugestionsList",
          icon: "format_list_bulleted",
        },
        {
          label: "Ficha pastoral",
          route: "/admin/pastoralArchive",
          icon: "format_list_bulleted",
        },
        {
          label: "Membresia",
          route: "/admin/userMembershipandHistory",
          icon: "equalizer",
        },
      ],
      config: [
        {
          label: "Tipos de organismos",
          route: "/config/organismTypeConfigList",
          icon: "edit_square",
        },
        {
          label: "Organismos",
          route: "/config/organismConfigurationList",
          icon: "diversity_2",
        },
        {
          label: "Usuário",
          route: "/config/createUserConfig?userType=user",
          icon: "group",
        },
        {
          label: "Novo Usuário",
          route: "/config/createUserConfig?userType=newUser",
          icon: "group",
        },
        {
          label: "Pastor",
          route: "/config/createUserConfig?userType=pastor",
          icon: "group",
        },
        {
          label: "Visões",
          route: "/config/visionsList",
          icon: "visibility",
        },
        {
          label: "Formulários",
          route: "/config/formConfigList",
          icon: "feed",
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
          label: "Lista de solicitações",
          route: "/user/userSolicitationsList",
          icon: "format_list_bulleted",
        },
        {
          label: "Lista de sugestões",
          route: "/user/userSugestionsList",
          icon: "assistant",
        },
        {
          label: "Estatística",
          route: "/statistic/introWriteStatisticData",
          icon: "equalizer",
        },
        {
          label: "Membresia",
          route: "/user/userMembershipandHistory",
          icon: "group",
        },
      ],
    };
    return obj[type];
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
};
export default useUtils;
