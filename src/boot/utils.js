import { MODE_AUTH_SERVER } from "./variables";
import CryptoJS from "crypto-js";
import { LocalStorage } from "quasar";
import useFetch from "./useFetch";
import { calculateMasterServerAttachmentsRoute } from "./masterServerRoutes";

const useUtils = {
  // forceFileDownload(response, options) {
  //   const url = window.URL.createObjectURL(new Blob([response], {type: 'arraybuffer'}))
  //   console.log(url)
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', options.originalname)
  //   document.body.appendChild(link)
  //   console.log(link)
  //   link.click()
  //   document.body.removeChild(link)
  // },
  
  downloadFile (options) {
    console.log(options, 'options dentro downloadfile')
    const opt = {
      method: 'get',
      responseType: 'arraybuffer',
      // responseType: 'blob',
      route: '/download/' + options.filename
    }
    useFetch(opt).then(async response => {
      console.log('entrou', response)
      const blob = new Blob([response], {type: options.type})
      const link = URL.createObjectURL(blob)
      console.log('link', link)
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = link;
      a.download = options.originalname;
      a.click();
      URL.revokeObjectURL(link);
    })
  },
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
          label: "Lista de Pastores",
          route: "/admin/pastorsList",
          icon: "sort",
        },
        {
          label: "Rede",
          route: "/admin/organismsList",
          icon: "diversity_2",
        },
        // {
        //   label: "Documentos",
        //   route: "/admin/admDocuments",
        //   icon: "description",
        // },
        // {
        //   label: "Títulos",
        //   route: "/admin/titlesList",
        //   icon: "school",
        // },
        // {
        //   label: "Solicitações de Títulos",
        //   route: "/admin/titlesSolicitationsList",
        //   icon: "list",
        // },
        // {
        //   label: "Solicitações de Funções",
        //   route: "/admin/functionsSolicitations",
        //   icon: "list",
        // },
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
        // {
        //   label: "Títulos",
        //   route: "/config/titleConfigurationList",
        //   icon: "import_contacts",
        // },
        // {
        //   label: "Formação",
        //   route: "/config/formationConfiguration",
        //   icon: "import_contacts",
        // },
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
          label: "Meu distrito",
          route: "/user/userDistrict",
          icon: "church",
        },
        // {
        //   label: "Minhas pendências",
        //   route: "/user/pendingList",
        //   icon: "pending_actions",
        // },
        // {
        //   label: "Lista das minhas funções",
        //   route: "/user/userFunctionsList",
        //   icon: "comment_bank",
        // },
        // {
        //   label: "Documentos",
        //   route: "/user/userAttachments",
        //   icon: "description",
        // },
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
        // {
        //   label: "Falar com admin",
        //   route: "/user/talkToAdmin",
        //   icon: "admin_panel_settings",
        // },
        // {
        //   label: "Formulários",
        //   route: "/user/userFormsList",
        //   icon: "list_alt",
        // },
        // {
        //   label: "Formulários enviados",
        //   route: "/user/userMyFormsList",
        //   icon: "collections_bookmark",
        // },
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
