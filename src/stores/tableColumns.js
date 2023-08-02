import { defineStore } from "pinia";

export const useTableColumns = defineStore("tableColumns", {
  state: () => ({
    organismList: [
      {
        name: "nome",
        align: "left",
        label: "Nome do organismo",
        field: "nome",
        sortable: true,
      },
      {
        name: "organismTypeName",
        align: "left",
        label: "Nome do tipo de organismo",
        field: "organismTypeName",
        sortable: true,
      },
      {
        name: "data_de_criacao",
        align: "left",
        label: "Data de criação",
        field: (row) => row.data_de_criacao.dateLocale,
        sortable: true,
      },
    ],
    functionsList: [
      {
        name: "name",
        align: "left",
        label: "Nome da função",
        field: "name",
        sortable: true,
      },
      {
        name: "structureName",
        align: "left",
        label: "Estrutura",
        field: "structureName",
        sortable: true,
      },
      {
        name: "structureTypeName",
        align: "left",
        label: "Tipo da estrutura",
        field: "structureTypeName",
        sortable: true,
      },
      {
        name: "organismTypeName",
        align: "left",
        label: "Tipo do organismo",
        field: "organismTypeName",
        sortable: true,
      },
    ],
    organismConfigList: [
      {
        name: "organismTypeName",
        align: "left",
        label: "Nome",
        field: "organismTypeName",
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
    titleConfigList: [
      {
        name: "titleName",
        align: "left",
        label: "Nome",
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
        field: (row) => row.userDataTabs[0].fields[1].newValue,
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
    inactiveAdsList: [
      {
        name: "userId",
        align: "left",
        label: "Nº de usuário",
        field: (row) => row.createdBy.userId,
        sortable: true,
      },
      {
        name: "user",
        align: "left",
        label: "Usuário",
        field: (row) => row.createdBy.name,
        sortable: true,
      },
      {
        name: "title",
        align: "left",
        label: "Título",
        field: (row) => row.adData.title,
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
    categoryList: [
      {
        name: "userId",
        align: "left",
        label: "Nº de usuário",
        field: (row) => row.createdBy.userId,
        sortable: true,
      },
      {
        name: "user",
        align: "left",
        label: "Usuário",
        field: (row) => row.createdBy.name,
        sortable: true,
      },
      {
        name: "category",
        align: "left",
        label: "Categoria",
        field: "category",
        sortable: true,
      },
      {
        name: "date",
        align: "left",
        label: "Data de criação",
        field: (row) => row.createdAt.createdAtOnlyDate,
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
  }),
});
