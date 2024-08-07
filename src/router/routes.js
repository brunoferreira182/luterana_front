const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/mobileMainPage", component: () => import("pages/MobileMainPage.vue") },
      //admin
      { path: "/admin", redirect: "/admin/UsersList" },
      {
        path: "/admin/usersList",
        component: () => import("src/pages/admin/UsersList.vue"),
      },
      {
        path: "/admin/pastorsList",
        component: () => import("pages/admin/PastorsList.vue"),
      },
      {
        path: "/admin/admDocuments",
        component: () => import("pages/admin/AdmDocuments.vue"),
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
        component: () => import("src/pages/admin/OrganismsList.vue"),
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
        path: "/admin/createChildOrganism",
        component: () => import("pages/admin/CreateChildOrganism.vue"),
      },
      {
        path: "/admin/childOrganismDetail",
        component: () => import("pages/admin/ChildOrganismDetail.vue"),
      },
      {
        path: "/admin/functionsSolicitations",
        component: () => import("pages/admin/FunctionsSolicitations.vue"),
      },
      {
        path: "/admin/admSugestionsList",
        component: () => import("src/pages/admin/AdmSugestionsList.vue"),
      },
      {
        path: "/admin/admSolicitationsList",
        component: () => import("src/pages/admin/AdmSolicitationsList.vue"),
      },
      {
        path: "/admin/attachDetail",
        component: () => import("pages/admin/AttachDetail.vue"),
      },
      {
        path: "/admin/createNewAttach",
        component: () => import("src/pages/admin/CreateNewAttach.vue"),
      },
      {
        path: "/admin/districtDetail",
        component: () => import("src/pages/admin/DistrictDetail.vue"),
      },
      {
        path: "/admin/pastoralArchive",
        component: () => import("src/pages/admin/PastoralArchive.vue"),
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
        component: () => import("src/pages/config/FormConfigList.vue"),
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
      {
        path: "/config/createPastoralConfig",
        component: () => import("pages/config/CreatePastoralConfig.vue"),
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

      // configurações // formações

      {
        path: "/config/formationConfiguration",
        component: () => import("pages/config/FormationConfiguration.vue"),
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

      //configurations//grupo de funções
      {
        path: "/config/functionsGroupList",
        component: () => import("pages/config/FunctionsGroupList.vue"),
      },
      {
        path: "/config/createFunctionsGroup",
        component: () => import("pages/config/CreateFunctionsGroup.vue"),
      },
      {
        path: "/config/functionsGroupDetail",
        component: () => import("pages/config/FunctionsGroupDetail.vue"),
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
      
      //Organismos e usuário
      { path: "/orgs", redirect: "/orgs/userDashboard" },
      {
        path: "/orgs/userDashboard",
        component: () => import("pages/orgs/UserDashboard.vue"),
      },
      {
        path: "/user/userDistrict",
        component: () => import("pages/user/UserDistrict.vue"),
      },
      {
        path: "/orgs/userOrganismsList",
        component: () => import("pages/orgs/UserOrganismsList.vue"),
      },
      {
        path: "/user/userOrganismDetail",
        component: () => import("src/pages/user/UserOrganismDetail.vue"),
      },
      {
        path: "/user/userOrganismChildDetail",
        component: () => import("src/pages/user/UserOrganismDetail.vue"),
      },
      {
        path: "/user/userFunctionsList",
        component: () => import("src/pages/user/UserFunctionsList.vue"),
      },
      {
        path: "/user/userAttachments",
        component: () => import("src/pages/user/UserAttachments.vue"),
      },
      {
        path: "/user/createAttachments",
        component: () => import("pages/user/CreateAttachments.vue"),
      },
      {
        path: "/user/attachmentsDetail",
        component: () => import("pages/user/AttachmentsDetail.vue"),
      },
      {
        path: "/user/districtDetail",
        component: () => import("pages/user/DistrictDetail.vue"),
      },
      {
        path: "/user/organismsList",
        component: () => import("pages/user/OrganismsList.vue"),
      },
      { path: "/user", redirect: "/user/userPersonalData" },
      {
        path: "/user/userPersonalData",
        component: () => import("pages/user/UserPersonalData.vue"),
      }, 
      {
        path: "/user/userSolicitationsList",
        component: () => import("pages/user/UserSolicitationsList.vue"),
      }, 
      {
        path: "/user/userFormsList",
        component: () => import("pages/user/UserFormsList.vue"),
      }, 
      {
        path: "/user/userMyFormsList",
        component: () => import("pages/user/UserMyFormsList.vue"),
      }, 
      {
        path: "/user/userFormDetail",
        component: () => import("pages/user/UserFormDetail.vue"),
      },
      {
        path: "/user/userSugestionsList",
        component: () => import("src/pages/user/UserSugestionsList.vue"),
      },
      // {
      //   path: "/user/statistic",
      //   component: () => import("src/pages/user/Statistic.vue"),
      // },
      
      //ESTATÍSTICA 2023 
      {
        path: "/statistic/pastorData",
        component: () => import("src/pages/statistic/PastorData.vue"),
      },
      {
        path: "/statistic/introductionStatistic",
        component: () => import("src/pages/statistic/IntroductionStatistic.vue"),
      },
      {
        path: "/statistic/writeFinanceStatisticData",
        component: () => import("src/pages/statistic/WriteFinanceStatisticData.vue"),
      },
      {
        path: "/statistic/writeCongregationalStatisticData",
        component: () => import("src/pages/statistic/WriteCongregationalStatisticData.vue"),
      },
      {
        path: "/statistic/introWriteStatisticData",
        component: () => import("src/pages/statistic/IntroWriteStatisticData.vue"),
      },
      {
        path: "/statistic/selectOrganismToWriteStatisticData",
        component: () => import("src/pages/statistic/SelectOrganismToWriteStatisticData.vue"),
      },
      {
        path: "/statistic/completeStatistic",
        component: () => import("src/pages/statistic/CompleteStatistic.vue"),
      },
      {
        path: "/statistic/groupActivity",
        component: () => import("src/pages/statistic/GroupActivity.vue"),
      },
      {
        path: "/statistic/culturalActivities",
        component: () => import("src/pages/statistic/CulturalActivities.vue"),
      },
      {
        path: "/statistic/membersMovement",
        component: () => import("src/pages/statistic/MembersMovement.vue"),
      },
      {
        path: "/statistic/paroquialManagement",
        component: () => import("src/pages/statistic/ParoquialManagement.vue"),
      },
      {
        path: "/statistic/ChooseParish",
        component: () => import("src/pages/statistic/ChooseParish.vue"),
      },

      { path: "/maitenancePage", component: () => import("pages/MaitenancePage.vue") },
      
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  { path: "/login", component: () => import("pages/Login.vue") },
  { path: "/userCreateLogin", component: () => import("pages/UserCreateLogin.vue") },
  

  
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;