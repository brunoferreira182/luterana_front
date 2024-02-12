import { defineStore } from "pinia";
export const useTableColumns = defineStore("tableColumns", {
  state: () => ({
    attach:[
      {
        name: "title",
        align: "left",
        label: "Título",
        field: (row) => row.attachmentInfo.title,
        sortable: true,
      },
      // {
      //   name: "organismParentName",
      //   align: "left",
      //   label: "Nome do organismo",
      //   field: (row) => row.organismData.organismParentName,
      //   sortable: true,
      // },
      // {
      //   name: "saldoAnterior",
      //   align: "left",
      //   label: "Saldo anterior",
      //   field: "saldoAnterior",
      //   sortable: true,
      // },
    ],
    entryValueAnual: [
      {
        name: "organismParentConfig",
        align: "left",
        label: "Tipo de organismo",
        field: (row) => row.organismData.organismParentConfig,
        sortable: true,
      },
      {
        name: "organismParentName",
        align: "left",
        label: "Nome do organismo",
        field: (row) => row.organismData.organismParentName,
        sortable: true,
      },
      {
        name: "saldoAnterior",
        align: "left",
        label: "Saldo anterior",
        field: "saldoAnterior",
        sortable: true,
      },
      {
        name: "receitasRegulares",
        align: "left",
        label: "Receitas regulares",
        field: "receitasRegulares",
        sortable: true,
      },
      {
        name: "ofertasEspeciais",
        align: "left",
        label: "Ofertas especiais",
        field: "ofertasEspeciais",
        sortable: true,
      },
      {
        name: "campanhasEspecificas",
        align: "left",
        label: "Campanhas específicas",
        field: "campanhasEspecificas",
        sortable: true,
      },
      {
        name: "auxilio",
        align: "left",
        label: "Auxílio (outros)",
        field: "auxilio",
        sortable: true,
      },
      {
        name: "emprestimos",
        align: "left",
        label: "Empréstimos",
        field: "emprestimos",
        sortable: true,
      },
      {
        name: "todasOutrasReceitas",
        align: "left",
        label: "Todas as outras receitas",
        field: "todasOutrasReceitas",
        sortable: true,
      },
    ],
    outputValueAnual: [
      
      {
        name: "organismParentConfig",
        align: "left",
        label: "Tipo de organismo",
        field: (row) => row.organismData.organismParentConfig,
        sortable: true,
      },
      {
        name: "organismParentName",
        align: "left",
        label: "Nome do organismo",
        field: (row) => row.organismData.organismParentName,
        sortable: true,
      },
      {
        name: "contribuicaoIelb",
        align: "left",
        label: "Contribuição IELB",
        field: "contribuicaoIelb",
        sortable: true,
      },
      {
        name: "contribuicaoDistrito",
        align: "left",
        label: "Contribuição para o Distrito",
        field: "contribuicaoDistrito",
        sortable: true,
      },
      {
        name: "devolucaoEmprestimosIelb",
        align: "left",
        label: "Devolução de empréstimos para a IELB",
        field: (row) => row.transaction.value,
        sortable: true,
      },
      {
        name: "todasSaidas",
        align: "left",
        label: "Todas as outras saídas",
        field: "todasSaidas",
        sortable: true,
      }
    ],
    suggestionList: [
      {
        name: "suggestionTitle",
        align: "left",
        label: "Tipo de sugestão",
        field: "suggestionTitle",
        sortable: true,
      },
    ],
    solicitationsList: [
      {
        name: "organismType",
        align: "left",
        label: "Tipo de organismo",
        field: "organismType",
        sortable: true,
      },
      {
        name: "organismName",
        align: "left",
        label: "Nome do organism",
        field: "organismName",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: (row) => row.status,
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
    admAttachList: [
      {
        name: "attachTitle",
        align: "left",
        label: "Título",
        field: "attachTitle",
        sortable: true
      }
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
        color: "organismStyle"
      },
      {
        name: "city",
        align: "left",
        label: "Cidade",
        field: (row) => row.city,
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
      {
        name: "organismConfigName",
        align: "left",
        label: "Tipo de organismo",
        field: "organismConfigName",
        sortable: true,
      },
      {
        name: "city",
        align: "left",
        label: "Cidade",
        field: (row) => row.endereco[0].city,
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
        name: "city",
        align: "left",
        label: "Cidade",
        field: (row) => row.endereco[0].city,
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
    userAttachments: [
      {
        name: "attachTitle",
        align: "left",
        label: "Nome do arquivo",
        field: "attachTitle",
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
        name: "userType",
        align: "left",
        label: "Tipo",
        field: (row) => row.userType,
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
