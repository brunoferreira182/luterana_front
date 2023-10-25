import { defineStore } from "pinia";
export const useTableColumns = defineStore("tableColumns", {
  state: () => ({
    suggestionList: [
      {
        name: "suggestionTitle",
        align: "left",
        label: "Tipo de sugestão",
        field: "suggestionTitle",
        sortable: true,
      },
    ],
    allFunctionsSolicitations: [
      {
        name: "userName",
        align: "left",
        label: "Nome de usuário",
        
        
        field: "userName",
        sortable: true,
      },
      {
        name: "functionName",
        align: "left",
        label: "Nome da função",
        field: "functionName",
        sortable: true,
      },
    ],
    recivedSolicitations: [
      // {
      //   name: "userName",
      //   align: "left",
      //   label: "Nome de usuário",
      //   field: "userName",
      //   sortable: true,
      // },
      {
        name: "functionName",
        align: "left",
        label: "Nome da função",
        field: "functionName",
        sortable: true,
      },
      {
        name: "organismName",
        align: "left",
        label: "Nome do organismo",
        field: "organismName",
        sortable: true,
      },
      {
        name: "createdBy",
        align: "left",
        label: "Quem solicitou",
        field: "createdBy",
        sortable: true,
      },
      // {
      //   name: "createdAt",
      //   align: "left",
      //   label: "Quando",
      //   field: "createdAt",
      //   sortable: true,
      // },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: 'status',
        sortable: true,
      },
    ],
    pageOrganismList: [
      {
        name: "organismName",
        align: "left",
        label: "Nome do organismo",
        field: "organismName",
        sortable: true,
      },
      {
        name: "data_de_criacao",
        align: "left",
        label: "Data de criação",
        field: "createdAt",
        sortable: true,
      },
    ],
    functionsGroupList: [
      {
        name: "functionGroupName",
        align: "left",
        label: "Nome do grupo",
        field: "functionGroupName",
        sortable: true,
      },
      {
        name: "createdAt",
        align: "left",
        label: "Data de criação",
        field: 'createdAt',
        sortable: true,
      },
    ],
    organismList: [
      {
        name: "nome",
        align: "left",
        label: "Nome do organismo",
        field: (row) => row.nome,
        sortable: true,
      },
      {
        name: "apelido",
        align: "left",
        label: "Apelido do organismo",
        field: (row) => row.apelido,
        sortable: true,
      },
      {
        name: "organismConfigName",
        align: "left",
        label: "Tipo de organismo",
        field: "organismConfigName",
        sortable: true,
      },
      {
        name: "organismParentName",
        align: "left",
        label: "Organismo superior",
        field: "organismParentName",
        sortable: true,
      },
    ],
    titlesSolicitationsList: [
      {
        name: "userName",
        align: "left",
        label: "Nome do usuário",
        field: "userName",
        sortable: true,
      },
      {
        name: "titleName",
        align: "left",
        label: "Nome do título solicitado",
        field: "titleName",
        sortable: true,
      },
    ],
    searchAllOrganismsList: [
      {
        name: "nome",
        align: "left",
        label: "Nome do organismo",
        field: "nome",
        sortable: true,
      },
      // {
      //   name: "data_de_criacao",
      //   align: "left",
      //   label: "Data de criação",
      //   field: (row) => row.data_de_criacao.dateLocale,
      //   sortable: true,
      // },
    ],
    formConfigList: [
      {
        name: "name",
        align: "left",
        label: "Nome do formulário",
        field: "name",
        sortable: true,
      },
      {
        name: "data_de_criacao",
        align: "left",
        label: "Data de criação",
        field: (row) => row.createdAt.createdAtOnlyDate,
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: "status",
        sortable: true,
      },
    ],
    formList: [
      {
        name: "formName",
        align: "left",
        label: "Nome do formulário",
        field: "formName",
        sortable: true,
      },
      {
        name: "recurrencyLabel",
        align: "left",
        label: "Vigência",
        field: "recurrencyLabel",
        sortable: true,
      },
      {
        name: "actionButtons",
        align: "left",
        label: "Ações",
        field: "actionButtons",
        sortable: true,
      },
    ],
    myFormList: [
      {
        name: "formName",
        align: "left",
        label: "Nome do formulário",
        field: "formName",
        sortable: true,
      },
      {
        name: "recurrencyLabel",
        align: "left",
        label: "Vigência",
        field: "recurrencyLabel",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: "status",
        sortable: true,
      },
    ],
    organismTypeList: [
      {
        name: "nome",
        align: "left",
        label: "Nome do tipo de organismo",
        field: (row) => row.organismTypeData.name,
        sortable: true,
      },
      // {
      //   name: "data_de_criacao",
      //   align: "left",
      //   label: "Data de criação",
      //   field: (row) => row.createdAt.createdAtOnlyDate,
      //   sortable: true,
      // },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: "status",
        sortable: true,
      },
    ],
    organismConfigList: [
      {
        name: "organismConfigName",
        align: "left",
        label: "Nome",
        field: "organismConfigName",
        sortable: true,
      },
      {
        name: "creationDate",
        align: "left",
        label: "Data de criação",
        field: (row) => row.createdAt.createdAtOnlyDate,
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: "status",
        sortable: true,
      },
    ],
    pendingApprovalList: [
      {
        name: "titleName",
        align: "left",
        label: "Nome",
        field: "titleName",
        sortable: true,
      },
      {
        name: "createdAt",
        align: "left",
        label: "Data de criação",
        field: "createdAt",
        sortable: true,
      },
    ],
    titleConfigList: [
      {
        name: "titleName",
        align: "left",
        label: "Título",
        field: "titleName",
        sortable: true,
      },
      {
        name: "creationDate",
        align: "left",
        label: "Data de criação",
        field: (row) => row.createdAt.createdAtOnlyDate,
        sortable: true,
      },
    ],
    approvalList: [
      {
        name: "userName",
        align: "left",
        label: "Nome do usuário",
        field: "userName",
        sortable: true,
      },
      {
        name: "titleName",
        align: "left",
        label: "Título aguardando aprovação",
        field: "titleName",
        sortable: true,
      },
      {
        name: "creationDate",
        align: "left",
        label: "Data de criação",
        field: (row) => row.createdAt.createdAtOnlyDate,
        sortable: true,
      },
    ],
    userOrganismList: [
      {
        name: "nome",
        align: "left",
        label: "Nome do organismo",
        field: (row) => row.nome,
        sortable: true,
      },
      {
        name: "apelido",
        align: "left",
        label: "Apelido do organismo",
        field: (row) => row.apelido,
        sortable: true,
      },
      // {
      //   name: "data_de_criacao",
      //   align: "left",
      //   label: "Data de criação",
      //   field: (row) => row.data_de_criacao.dateLocale,
      //   sortable: true,
      // },
      {
        name: "organismConfigName",
        align: "left",
        label: "Tipo de organismo",
        field: "organismConfigName",
        sortable: true,
      },
      {
        name: "organismParentName",
        align: "left",
        label: "Organismo superior",
        field: "organismParentName",
        sortable: true,
      },
      {
        name: "endereco",
        align: "left",
        label: "Cidade",
        field: "endereco",
        sortable: true,
      },
    ],
    userOrganismListMobile: [
      {
        name: "nome",
        align: "left",
        label: "Nome do organismo",
        field: (row) => row.apelido || row.nome,
        sortable: true,
      },
      {
        name: "organismConfigName",
        align: "left",
        label: "Tipo de organismo",
        field: "organismConfigName",
        sortable: true,
      },
      {
        name: "endereco",
        align: "left",
        label: "Cidade",
        field: "endereco",
        sortable: true,
      },
    ],
    userFunctionsList: [
      {
        name: "functionName",
        align: "left",
        label: "Nome da função",
        field: "functionName",
        sortable: true,
      },
      {
        name: "organismName",
        align: "left",
        label: "Organismo",
        field: "organismName",
        sortable: true,
      },
    ],
    suggestionList: [
      {
        name: "tile",
        align: "left",
        label: "Título",
        field: (row) => row.suggestionTitle,
        sortable: true,
      },
      {
        name: "date",
        align: "left",
        label: "Data",
        field: (row) => row.createdAt,
        sortable: true,
      }
    ],
    usersList: [
      {
        name: "name",
        align: "left",
        label: "Nome",
        field: (row) => row.userName,
        sortable: true,
      },
      {
        name: "email",
        align: "left",
        label: "E-mail",
        field: (row) => row.email,
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: "status",
        sortable: true,
      },
    ],
    sentAttachments: [
      {
        name: "userId",
        align: "left",
        label: "Título",
        field: (row) => row.attachmentInfo.title,
        sortable: true,
      },
      {
        name: "user",
        align: "left",
        label: "Descrição",
        field: (row) => row.attachmentInfo.description,
        sortable: true,
      },
    ],
    visionsConfigList: [
      {
        name: "userId",
        align: "left",
        label: "Visão",
        field: (row) => row.visionInfo.name,
        sortable: true,
      },
      {
        name: "creationDate",
        align: "left",
        label: "Data de criação",
        field: (row) => row.createdAt.createdAtOnlyDate,
        sortable: true,
      },
    ],
  }),
});
