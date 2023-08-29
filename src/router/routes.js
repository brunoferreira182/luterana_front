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
        path: "/admin/titlesList",
        component: () => import("pages/admin/TitlesList.vue"),
      },
      {
        path: "/admin/titlesSolicitationsList",
        component: () => import("pages/admin/TitlesSolicitationsList.vue"),
      },
      {
        path: "/admin/userTitleDetail",
        component: () => import("pages/admin/UserTitleDetail.vue"),
      },
      {
        path: "/admin/createAffiliatedOrganism",
        component: () => import("pages/admin/CreateAffiliatedOrganism.vue"),
      },
      
      
      //configurations// tipos de organismos
      { path: "/config", redirect: "/config/OrganismTypeConfigList" },
      {
        path: "/config/organismTypeConfigList",
        component: () => import("pages/config/OrganismTypeConfigList.vue"),
      },
      {
        path: "/config/createOrganismTypeConfig",
        component: () => import("pages/config/CreateOrganismTypeConfig.vue"),
      },
      {
        path: "/config/organismTypeConfigDetail",
        component: () => import("pages/config/OrganismTypeConfigDetail.vue"),
      },
      //configurations// config de formulários
      {
        path: "/config/createFormConfig",
        component: () => import("pages/config/CreateFormConfig.vue"),
      },
      {
        path: "/config/formConfigDetail",
        component: () => import("pages/config/FormConfigDetail.vue"),
      },
      {
        path: "/config/formConfigList",
        component: () => import("pages/config/FormConfigList.vue"),
      },
      
      //configurations// organismos
      {
        path: "/config/organismConfigurationList",
        component: () => import("pages/config/OrganismConfigurationList.vue"),
      },
      {
        path: "/config/createOrganismsConfig",
        component: () => import("pages/config/CreateOrganismsConfig.vue"),
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

      //configurations//visões
      {
        path: "/config/visionsList",
        component: () => import("pages/config/VisionsList.vue"),
      },
      {
        path: "/config/visionDetail",
        component: () => import("pages/config/VisionDetail.vue"),
      },
      {
        path: "/config/createVision",
        component: () => import("pages/config/CreateVision.vue"),
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
      
      //Organismos do usuário
      { path: "/orgs", redirect: "/orgs/userDashboard" },
      {
        path: "/orgs/userDashboard",
        component: () => import("pages/orgs/UserDashboard.vue"),
      },
      {
        path: "/orgs/userOrganismsList",
        component: () => import("pages/orgs/UserOrganismsList.vue"),
      },
      {
        path: "/orgs/userOrganismDetail",
        component: () => import("pages/orgs/UserOrganismDetail.vue"),
      },
      {
        path: "/orgs/userFunctionsList",
        component: () => import("pages/orgs/UserFunctionsList.vue"),
      },
      {
        path: "/orgs/searchAllOrganismsList",
        component: () => import("pages/orgs/SearchAllOrganismsList.vue"),
      },
      
      { path: "/user", redirect: "/user/userPersonalData" },
      {
        path: "/user/userPersonalData",
        component: () => import("pages/user/UserPersonalData.vue"),
      }, 
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  { path: "/login", component: () => import("pages/Login.vue") },
  { path: "/userCreateLogin", component: () => import("pages/userCreateLogin.vue") },

  
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
