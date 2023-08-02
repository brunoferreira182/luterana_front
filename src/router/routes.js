const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Home.vue") },

      //admin
      { path: "/admin", redirect: "/admin/usersList" },
      {
        path: "/admin/usersList",
        component: () => import("pages/admin/UsersList.vue"),
      },
      {
        path: "/admin/createUser",
        component: () => import("pages/admin/CreateUser.vue"),
      },
      {
        path: "/admin/userDetail",
        component: () => import("pages/admin/UserDetail.vue"),
      },
      {
        path: "/admin/createOrganism",
        component: () => import("pages/admin/CreateOrganism.vue"),
      },
      {
        path: "/admin/organismsList",
        component: () => import("pages/admin/OrganismsList.vue"),
      },
      {
        path: "/admin/organismDetail",
        component: () => import("pages/admin/OrganismDetail.vue"),
      },
      {
        path: "/admin/OrganismStructureDetail",
        component: () => import("pages/admin/OrganismStructureDetail.vue"),
      },

      //configurations//organismos
      { path: "/config", redirect: "/config/OrganismTypeList" },
      {
        path: "/config/createOrganismType",
        component: () => import("pages/config/CreateOrganismType.vue"),
      },
      
      {
        path: "/config/organismTypeList",
        component: () => import("pages/config/OrganismTypeList.vue"),
      },
      {
        path: "/config/organismTypeDetail",
        component: () => import("pages/config/OrganismTypeDetail.vue"),
      },
      {
        path: "/config/createOrganismsConfig",
        component: () => import("pages/config/CreateOrganismsConfig.vue"),
      },
      {
        path: "/config/createOrganismsConfig",
        component: () => import("pages/config/CreateOrganismsConfig.vue"),
      },
      {
        path: "/config/organismConfigurationList",
        component: () => import("pages/config/OrganismConfigurationList.vue"),
      },
      {
        path: "/config/organismConfigDetail",
        component: () => import("pages/config/OrganismConfigDetail.vue"),
      },
      
      //configurations//configuração de usuários
      
      {
        path: "/config/usersConfigList",
        component: () => import("pages/config/UsersConfigList.vue"),
      },
      {
        path: "/config/createUserConfig",
        component: () => import("pages/config/CreateUserConfig.vue"),
      },
      
      //configurations//titulos
      {
        path: "/config/createTitleConfig",
        component: () => import("pages/config/CreateTitleConfig.vue"),
      },
      {
        path: "/config/titleConfigDetail",
        component: () => import("pages/config/TitleConfigDetail.vue"),
      },
      {
        path: "/config/titleConfigurationList",
        component: () => import("pages/config/TitleConfigList.vue"),
      },

      //configurations//tipos de estruturas
      {
        path: "/config/createStructureType",
        component: () => import("pages/config/CreateStructureType.vue"),
      },
      {
        path: "/config/structuresTypesList",
        component: () => import("pages/config/StructuresTypesList.vue"),
      },
      {
        path: "/config/structureTypeDetail",
        component: () => import("pages/config/StructureTypeDetail.vue"),
      },
      //configurations//estruturas
      {
        path: "/config/createStructure",
        component: () => import("pages/config/CreateStructure.vue"),
      },
      {
        path: "/config/structuresList",
        component: () => import("pages/config/StructuresList.vue"),
      },
      {
        path: "/config/structureDetail",
        component: () => import("pages/config/StructureDetail.vue"),
      },
      //configurations//funções
      {
        path: "/config/createFunction",
        component: () => import("pages/config/CreateFunction.vue"),
      },
      {
        path: "/config/functionsList",
        component: () => import("pages/config/FunctionsList.vue"),
      },
      {
        path: "/config/functionDetail",
        component: () => import("pages/config/FunctionDetail.vue"),
      },

      //attachments

      { path: "/attach", redirect: "/attach/createAttachment" },

      {
        path: "/attach/createAttachment",
        component: () => import("pages/attach/CreateAttachment.vue"),
      },
      {
        path: "/attach/attachmentDetail",
        component: () => import("pages/attach/AttachmentDetail.vue"),
      },
      {
        path: "/attach/receivedAttachments",
        component: () => import("pages/attach/ReceivedAttachments.vue"),
      },
      {
        path: "/attach/sentAttachments",
        component: () => import("pages/attach/SentAttachments.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  { path: "/login", component: () => import("pages/Login.vue") },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
