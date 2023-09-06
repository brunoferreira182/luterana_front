<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          v-if="
            $route.path === '/config/organismConfigDetail'
          "
          class="col-6 text-h5 text-capitalize">{{ organismConfigName }}
        </div>
        <div 
          v-if="
            $route.path === '/config/CreateOrganismsConfig'
          "
          class="col-6 text-h5 text-capitalize">Criar configuração de organismo
        </div>
        <div class="col text-right">
          <q-btn
            @click="clkSaveConfig"
            rounded
            color="primary"
            class="q-pa-sm"
            unelevated
            icon="bookmark"
            no-caps
          >
            {{
              $route.path === "/config/organismConfigDetail"
                ? "Salvar"
                : "Criar"
            }}
            Configuração
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-center q-pa-md">
        <div class="col-7 q-gutter-md" align="start">
          <div
            class="text-h5"
          >
            Informações 
            <div class="text-caption" v-if="$route.query === '/config/organismConfigDetail'">
              Selecione o tipo de organismo que a configuração será aplicada
            </div>
          </div>
          <q-chip
            v-for="org in organismConfigNamesOptions"
            :key="org._id"
            clickable
            @click="chipClicked(org)"
          >
            <q-icon v-if="org.selected" name="check" size="sm" color="green-8" />
            {{ org.organismTypeData.name }}
          </q-chip>
          <q-input
            outlined
            label="Nome da configuração"
            v-model="organismConfigName"
          />
          <div class="text-caption no-margin q-pl-md q-py-sm">
            Informe qual será o nome da configuração do organismo
          </div>
          <q-separator/>
          <div>Esta configuração de organismo será vinculada a outra?
            <q-chip 
              :color="requiresLink ? 'teal' : 'negative'" 
              text-color="white" 
              :icon="requiresLink ? 'done' : 'close'"
            >
              {{ requiresLink ? 'Sim' : 'Não' }}
            </q-chip>
            <q-chip
              v-if="parentOrganismConfigName" 
              color="teal" 
              text-color="white" 
            >
              {{ parentOrganismConfigName }}
            </q-chip>
          </div>
          <q-btn 
            unelevated
            no-caps
            rounded
            color="primary" 
            :label="$route.query.organismConfigId && requiresLink === true ? 'Alterar filiação': 'Criar filiação'"
            @click="dialogCreateAffiliation = true"
          />
          <q-separator/>
          <div>
            <div class="q-mb-md">Gostaria de definir uma cor para identificar essa configuração?</div>
            <q-btn 
              unelevated
              no-caps
              rounded
              color="primary" 
              :label="'Definir cor'"
              @click="dialogSelectColor = true"
            />
          </div>
          <q-dialog
            v-model="dialogSelectColor"
            color="primary"
          >
            <q-card style="border-radius: 1rem;width: 400px;">
              <q-card-section>
                <div class="text-h6 text-center">Nova cor</div>
                <div class="q-pa-md">
                  <q-color
                    no-footer
                    no-header-tabs
                    default-view="palette"
                    :palette="colorPalette"
                    class="my-picker"
                    v-model="newColor"
                  />
                </div>
              </q-card-section>
              <q-card-section align="center" class="q-mb-md">
                <q-btn
                  flat
                  label="Cancelar"
                  no-caps
                  color="primary"
                  @click="dialogSelectColor = false"
                />
                <q-btn
                  unelevated
                  rounded
                  label="Confirmar"
                  no-caps
                  color="primary"
                  @click="confirmColor"
                />
              </q-card-section>
            </q-card>
          </q-dialog>
          <q-dialog 
            v-model="dialogCreateAffiliation"
            color="primary"
          > 
            <q-card style="border-radius: 1rem; width: 400px">
              <q-card-section>
                <div class="text-h6 text-center">Nova filiação</div>
              </q-card-section>
              <q-card-section>
                <q-select
                  outlined
                  label="Nome da configuração"
                  option-label="organismConfigName"
                  :option-value="(item) => item._id"
                  emit-value
                  map-options
                  hint="Informe qual será o organismo pai"
                  v-model="childOfOrganism"
                  :options="organismConfigsList"
                />
              </q-card-section>
              <q-card-actions align="center" class="q-mb-md">
                <q-btn
                  flat
                  label="Cancelar"
                  no-caps
                  color="primary"
                  @click="dialogCancelAffiliation"
                />
                <q-btn
                  unelevated
                  rounded
                  label="Confirmar"
                  no-caps
                  color="primary"
                  @click="confirmChildOf"
                />
              </q-card-actions>
            </q-card>
            <div class="q-gutter-md bg-primary" style="max-width: 300px">
              
            </div>
          </q-dialog>
          <q-separator
          />
          <div
            class="text-h5"
          >
            Adicione os campos de preenchimento
          </div>
          <div
            class="row q-gutter-x-sm q-mx-none"
          >
            <div class="col">
              <q-input
                outlined
                class="q-ml-sm"
                hint="Nome do dado que será solicitado na hora do cadastro do organismo"
                label="Novo dado"
                v-model="newField.label"
              />
            </div>
            <div class="col">
              <q-input
                outlined
                hint="Descrição abaixo do campo para facilitar entendimento"
                label="Dica"
                v-model="newField.hint"
              />
            </div>
            <div class="col">
              <q-select
                outlined
                hint="O tipo do dado"
                label="Tipo de dado"
                option-label="label"
                :options="fieldTypesOptions"
                v-model="newField.type"
              />
            </div>
          </div>
          <q-checkbox
            class="q-pt-lg"
            v-model="newField.required"
            label="Preenchimento Obrigatório"
          />
          <q-checkbox
            :disable="
              newField.type ? newField.type.type === 'boolean' : false
            "
            class="q-pt-lg"
            v-model="newField.multiple"
            label="Campo múltiplo"
          />
          <div
            class="row justify-center"
          >
            <q-chip v-for="option in newField.options" :key="option">
              {{ option }}
            </q-chip>
            <q-btn
              label="Adicionar campo"
              no-caps
              rounded
              unelevated
              @click="addField"
              color="primary"
            />
          </div>
          <q-separator
          />
          <div
            class="text-h5"
          >
            Visualização
          </div>
          <div
          >
            <div
              v-for="(field, i) in organismFields"
              :key="i"
              class="q-my-md"
            >
              <div class="row q-gutter-sm items-center">
                <div class="col">
                  <q-input
                    readonly
                    :label="field.label"
                    :hint="field.hint"
                    outlined
                  >
                    <template
                      #append
                      v-if="
                        field.multiple &&
                        $route.path === '/config/organismConfigDetail'
                      "
                    >
                      <q-btn
                        disabled
                        icon="add"
                        color="primary"
                        flat
                        round
                        @click="addMultipleField"
                      >
                        <q-tooltip
                          >Adicionar multiplo
                          {{ field.type.label }}</q-tooltip
                        >
                      </q-btn>
                    </template>
                  </q-input>
                </div>
                <div class="col-2 q-mb-md">
                  <q-badge class="q-pa-xs">{{
                    organismFields[i].type.label
                  }}</q-badge
                  ><br />
                  <q-badge color="orange" class="q-pa-xs">
                    {{ field.required ? "obrigatório" : "opcional" }}
                  </q-badge>
                </div>
                <div class="col-1">
                  <q-btn
                    icon="delete"
                    size="large"
                    class="q-mb-md"
                    rounded
                    @click="organismFields.splice(i, 1)"
                    flat
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-separator class="q-mx-md" vertical/>
        <div class="col-4">
          <div class="row">
            <div
              class="text-h5"
            >
              Funções 
            </div>
            <q-btn
              @click="newFunctionDialog = true"
              class="q-mx-md"
              label="Adicionar"
              rounded
              flat
              color="primary"
              no-caps
              icon-right="add"
            />
          </div>
          <q-item
            style="border-radius: 1rem"
            class="bg-grey-3 q-ma-sm q-pa-md"
            v-for="(item,i) in functions" 
            :key="i"
          >
            <q-item-section>
              <div class="text-subtitle2">{{ item.name }}</div>
              <div>Descrição: {{ item.description }}</div>
              <div class="text-caption text-grey-7">
                Título necessário: {{ item.requiredTitle ? item.requiredTitle : 'nenhum' }}
              </div>
              <div class="text-caption text-grey-7">
                Grupo: {{ item.functionGroupName ? item.functionGroupName : 'nenhum' }}
              </div>
              <div class="text-caption text-grey-7">
                Número de participantes: {{ item.numOfOccupants ? item.numOfOccupants : 'nenhum' }}
              </div>
              <div>
                <q-icon name="visibility" color="primary" size="sm"/>
                <q-chip
                  v-for="(vision,i) in item.visions"
                  :key="i"
                >
                {{ vision.name }}
                </q-chip>
              </div>
            </q-item-section>
            <q-item-section top side>
              <div>
                <q-btn
                  flat
                  color="primary"
                  icon="edit"
                  dense
                  size="sm"
                  @click="editFunction(item)"
                >
                  <q-tooltip>
                    Editar função
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  color="red-9"
                  icon="delete"
                  size="sm"
                  @click="deleteFunction(item)"
                >
                  <q-tooltip>
                    Deletar função
                  </q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </div>
      </div>
      <q-dialog v-model="newFunctionDialog" @hide="functionDialogClosed">
        <q-card style="border-radius: 1rem; width: 586px">
          <q-card-section>
            <div class="text-h6 text-center">Nova função</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-md">
              <q-input
                label="Escreva o nome"
                outlined
                hint="Nome da função"
                v-model="newFunction.name"
              />
              <q-input
                outlined
                autogrow
                hint="Uma descrição completa sobre a função"
                label="Descrição"
                v-model="newFunction.description"
              />
              <q-select
                outlined
                clearable
                option-label="titleName"
                emit-value
                map-options
                label="Título (opcional)"
                :option-value="(item) => item._id"
                :options="titlesOptions"
                v-model="newFunction.requiredTitleId"
              />
              <q-select
                outlined
                clearable
                option-label="label"
                emit-value
                map-options
                label="Ocupantes por função"
                :option-value="(item) => item.label"
                :options="occupantsOptions"
                v-model="newFunction.numOfOccupants"
              />
              <div>
                <q-checkbox 
                v-model="newFunction.functionProperties.numRequired"
                label="Este número de ocupantes deve ser preenchido?"
                />
              </div>
              <q-select
                outlined
                clearable
                option-label="functionGroupName"
                emit-value
                map-options
                hint="Selecione o grupo que esta função pertence"
                label="Grupo de função"
                :option-value="(item) => item._id"
                :options="functionsGroupList"
                v-model="newFunction.functionGroupId"
              />
              <div class="text-grey-8 text-subtitle1 q-px-xs">Visões:</div>
              <div class="visions-field q-mt-none row ">
                <div v-for="(vision, visionIndex) in visionsList" :key="visionIndex" class="col-6 q-my-md">
                  <div class="text-subtitle1">{{ vision.name }}</div>
                  <div class="text-caption text-grey-7">{{ vision.description }}</div>
                  <q-chip
                    v-for="permission in vision.permissions" :key="permission.name"
                    :class="{ 'selected-chip': permission.selected }"
                    clickable
                    @click="handlePermissions(vision, permission)"
                  >
                    <q-icon v-if="permission.selected" name="check" size="sm" color="green-8" />
                    {{ permission.short }}
                    <q-tooltip>{{ permission.label }}</q-tooltip>
                  </q-chip>
                </div>
              </div>
              <q-checkbox
                class="q-px-sm"
                label="Preenchimento da função é obrigatório?"
                v-model="newFunction.isRequired"
              />
              <q-checkbox
                class="q-px-sm"
                label="Esta função fará gestão de troca de função e organismo?"
                v-model="newFunction.functionProperties.canManageFuncAndOrgSolicitations"
              />
              <q-checkbox
                class="q-px-sm"
                label="Esta função poderá criar e editar grupos de organismos?"
                v-model="newFunction.functionProperties.canCreateAndEditChildOrganism"
              />
            </div>
          </q-card-section>
          <q-card-actions align="center" class="q-mb-md">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="newFunctionDialog = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addFunction"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="editFunctionDialog.open">
        <q-card style="border-radius: 1rem; width:586px">
          <q-card-section>
            <div class="text-h6 text-center">Editar função</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-md">
              <q-input
                label="Escreva o nome"
                outlined
                hint="Nome da função"
                v-model="editFunctionDialog.function.name"
              />
              <q-input
                outlined
                autogrow
                hint="Uma descrição completa sobre a função"
                label="Descrição"
                v-model="editFunctionDialog.function.description"
              />
              <q-select
                outlined
                clearable
                option-label="titleName"
                emit-value
                map-options
                label="Título (opcional)"
                :option-value="(item) => item._id"
                :options="titlesOptions"
                v-model="editFunctionDialog.function.requiredTitleId"
              />
              <q-select
                outlined
                clearable
                option-label="label"
                emit-value
                map-options
                label="Ocupantes por função"
                :option-value="(item) => item.label"
                :options="occupantsOptions"
                v-model="editFunctionDialog.function.numOfOccupants"
              />
              <div>
                <q-checkbox 
                  v-model="editFunctionDialog.function.functionProperties.numRequired"
                  label="A ocupação deve ser obrigatória?"
                />
              </div>
              <div class="text-subtitle1 q-px-xs">Visões:</div>
              <div class="visions-field q-mt-none row">
                <div v-for="(vision, visionIndex) in editFunctionDialog.function.visions" :key="visionIndex" class="col-6 q-my-md">
                  <div class="text-subtitle1">{{ vision.name }}</div>
                  <div class="text-caption text-grey-7">{{ vision.description }}</div>
                  <q-chip
                    v-for="permission in vision.permissions"
                    :key="permission.name"
                    :class="{ 'selected-chip': permission.name === vision.selectedPermission }"
                    clickable
                    @click="handlePermissionOnEdit(vision, permission)"
                  >
                    <q-icon v-if="permission.name === vision.selectedPermission" name="check" size="sm" color="green-8" />
                    {{ permission.short }}
                    <q-tooltip>{{ permission.label }}</q-tooltip>
                  </q-chip>
                </div>
              </div>
              <q-checkbox
                class="q-px-sm"
                label="Preenchimento da função é obrigatório?"
                v-model="editFunctionDialog.function.isRequired"
              />
              <q-checkbox
                class="q-px-sm"
                label="Esta função fará gestão de troca de função e organismo?"
                v-model="editFunctionDialog.function.functionProperties.canManageFuncAndOrgSolicitations"
              />
              <q-checkbox
                class="q-px-sm"
                label="Esta função poderá criar e editar grupos de organismos?"
                v-model="editFunctionDialog.function.functionProperties.canCreateAndEditChildOrganism"
              />
            </div>
          </q-card-section>
          <q-card-actions align="center" class="q-mb-md">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="editFunctionDialog.open = false"
            />
            <q-btn
              v-if="$route.query.organismConfigId"
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="updateOrganismFunctionConfig"
            />
            <q-btn
              v-else
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="editFunctionDialog.open = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogDeleteFunction.open">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Tem certeza que deseja deletar essa função?</div>
          </q-card-section>
          <q-card-actions align="center" class="q-mb-md">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogDeleteFunction.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="confirmDeleteFunction"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../boot/useFetch";
import { useColorsPalette } from "stores/colorPalette";
export default defineComponent({
  name: "OrganismsConfigDetail",
  data() {
    return {
      organismConfigsList: [],
      childOfOrganism: [],
      newColor: '',
      selectedColor: '',
      fieldTypesOptions: [],
      selectedPermissions: [],
      organismConfigNamesOptions: [],
      organismConfigName: '',
      parentOrganismConfigName: '',
      organismTypeId: '',
      typeSelected: null,
      requiresLink: false,
      dialogCreateAffiliation: false,
      dialogSelectColor: false,
      valueSelected: "",
      searchString: '',
      newFunctionDialog: false,
      newFunction: {
        name: '',
        description: '',
        requiredTitleId: null,
        numOfOccupants: '',
        functionProperties: {
          canManageFuncAndOrgSolicitations: false,
          canCreateAndEditChildOrganism: false,
          numRequired: false,
        },
        isRequired: true,
        visions: []
      },
      colorPalette: useColorsPalette().colors,
      editFunctionDialog: {
        open: false,
        function: {
          name: '',
          description: '',
          requiredTitleId: null,
          numOfOccupants: null,
          numRequired: false,
          functionProperties: {
            canManageFuncAndOrgSolicitations: false,
            canCreateAndEditChildOrganism: false,
          },
          isRequired: true,
          visions: []
        } 
      },
      dialogDeleteFunction: {
        open: false,
        function: {
          name: '',
          description: '',
          requiredTitleId: null,
          isRequired: true
        } 
      },
      functions: [],
      titlesOptions: [],
      occupantsOptions: [],
      organismFields: [
        {
          label: "Nome",
          type: {
            _id: "64ad55727cb57d0bd22b10d5",
            type: "string",
            label: "Texto",
          },
          hint: "Informe o nome",
          required: true,
          model: "nome",
        },
        {
          label: "Data de criação",
          type: {
            _id: "64ad55ce7cb57d0bd22b10d9",
            type: "date",
            label: "Data",
          },
          hint: "Data de criação do organismo",
          required: true,
          model: "data_de_criacao",
        },
      ],
      newField: {
        label: null,
        type: null,
        hint: null,
        required: true,
        multiple: false,
      },
      selectedType: "",
      visionsList: [],
      functionsGroupList: [],
      permissionName: '',
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    if (this.$route.path === "/config/organismConfigDetail") {
      this.getOrganismConfigById();
    } else {
      this.getOrganismsTypes();
    }
    this.getTitleConfigsList();
    this.getFieldTypes();
    this.getVisions();
    this.getOrganismsConfigsList();
    this.getFunctionsGroupList()
    this.getOccupantsOptions()
  },
  methods: {
    getFunctionsGroupList() {
      const opt = {
        route: "/desktop/config/getFunctionsGroupList",
      };
      useFetch(opt).then((r) => {
        this.functionsGroupList = r.data.list;
      });
    },
    handlePermissionOnEdit(vision, permission) {
      const visionId = vision.visionId;
      // Encontrar o objeto vision correspondente no array
      const visionIndex = this.editFunctionDialog.function.visions.findIndex(
        item => item.visionId === visionId
      );
      if (visionIndex !== -1) {
        const selectedPermission = this.editFunctionDialog.function.visions[visionIndex].selectedPermission;
        if (selectedPermission === permission.name) {
          // Deselecionar o chip atual
          this.editFunctionDialog.function.visions[visionIndex].selectedPermission = null;
        } else {
          // Deselecionar o chip anteriormente selecionado (se houver)
          if (selectedPermission) {
            const prevPermission = vision.permissions.find(p => p.name === selectedPermission);
            if (prevPermission) {
              prevPermission.selected = false;
            }
          }
          // Selecionar o novo chip
          this.editFunctionDialog.function.visions[visionIndex].selectedPermission = permission.name;
          permission.selected = true;
        }
      }
    },
    handlePermissions(vision, permission) {
      const visionId = vision.visionId;
      const existingIndex = this.newFunction.visions.findIndex(
        item => item.visionId === visionId
      );
      if (existingIndex !== -1) {
        const currentPermission = this.newFunction.visions[existingIndex].permission;
        if (currentPermission === permission.name) {
          this.newFunction.visions.splice(existingIndex, 1);
          permission.selected = false;
        } else {
          this.newFunction.visions[existingIndex].permission = permission.name;
          permission.selected = true;
          const prevPermission = vision.permissions.find(p => p !== permission && p.selected);
          if (prevPermission) {
            prevPermission.selected = false;
            const prevIndex = this.newFunction.visions.findIndex(
              item => item.visionId === visionId && item.permission === prevPermission.name
            );
            if (prevIndex !== -1) {
              this.newFunction.visions.splice(prevIndex, 1);
            }
          }
        }
      } else {
        vision.permissions.forEach(p => {
          p.selected = p === permission;
        });
        this.newFunction.visions.push({
          name: vision.name,
          visionId: visionId,
          selectedPermission: permission.name,
          permissions: this.visionsList[0].permissions,
        });
      }
    },
    chipClicked(org) {
      this.organismConfigNamesOptions.forEach(o => {
        o.selected = o === org;
      });
      this.organismTypeId = org._id
    },
    addField() {
      if (
        this.newField.label &&
        this.newField.hint &&
        (this.organismConfigName ||
          this.$route.path === "/config/organismConfigDetail")
      ) {
        this.organismFields.push({ ...this.newField });
        this.newField.label = null;
        this.newField.hint = null;
        this.newField.type = null;
        this.newField.required = true;
        this.newField.multiple = false;
        return;
      }
      this.$q.notify("preencha todos os dados antes de adicionar um campo");
    },
    addMultipleField() {
      this.userData.generalData.phones.push(this.valueSelected);
      this.newPhone = "";
      this.typeSelected = null;
    },
    getTitleConfigsList() {
      const opt = {
        route: "/desktop/config/getTitleConfigsList",
        body: {
          isActive: 1
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.titlesOptions = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/config/getOrganismsTypes",
        body: {
          isActive: 1,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismConfigNamesOptions = r.data;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getFieldTypes() {
      const opt = {
        route: "/desktop/config/getDataTypesList",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.fieldTypesOptions = r.data;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },

    createOrganismsConfig() {
      if (this.organismTypeId === '' || this.organismConfigName === '' || this.functions.length === 0) {
        this.$q.notify('Preencha o tipo de organismo, o nome da configuração e insira uma função para prosseguir')
        return
      }
      this.functions.forEach((func) => {
        func.visions.forEach((vision) => {
          delete vision.permissions;
        });
      });
      const opt = {
        route: "/desktop/config/createOrganismsConfig",
        body: {
          requiresLinkOrganismConfigId: this.childOfOrganism,
          organismTypeId: this.organismTypeId,
          organismConfigName: this.organismConfigName,
          requiresLink: this.requiresLink,
          organismFields: this.organismFields,
          functions: this.functions,
          organismStyle: this.selectedColor
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Configuração de organismo cadastrado com sucesso!");
          this.multiple = "";
          this.newFunction.visions = [];
          this.childOfOrganism = ''
          this.organismConfigName = ''
          this.functions = []
          this.requiresLink = false
          this.getOrganismsTypes()
        }
      });
    },
    updateOrganismConfig() {
      const organismConfigId = this.$route.query.organismConfigId;
      this.functions.forEach((func) => {
        func.visions.forEach((vision) => {
          delete vision.permissions;
        });
      });
      const opt = {
        route: "/desktop/config/updateOrganismConfig",
        body: {
          organismConfigName: this.organismConfigName,
          functions: this.functions,
          organismConfigId: organismConfigId,
          organismFields: this.organismFields,
          requiresLink: this.requiresLink,
          organismStyle: this.selectedColor
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Os campos foram atualizados com sucesso!");
          this.$router.push('/config/organismConfigurationList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getOrganismConfigById() {
      const organismConfigId = this.$route.query.organismConfigId;
      const opt = {
        route: "/desktop/config/getOrganismConfigById",
        body: {
          _id: organismConfigId,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          if(r.data.organismConfigData){
            this.parentOrganismConfigName = r.data.parentOrganismConfigData.parentOrganismConfigName
            this.organismConfigName = r.data.organismConfigData.organismConfigName;
            this.organismFields = r.data.organismConfigData.organismFields;
            r.data.organismConfigData.functions[0].organismFunctionId ?
            this.functions = r.data.organismConfigData.functions :
            this.functions = []
            this.selectedType = r.data.organismConfigData.organismConfigName;
            this.requiresLink = r.data.organismConfigData.requiresLink
            
          } else{
            this.organismConfigName = r.data.organismConfigName;
            this.organismFields = r.data.organismFields;
            r.data.functions[0].organismFunctionId ?
            this.functions = r.data.functions :
            this.functions = []
            this.selectedType = r.data.organismConfigName;
            this.requiresLink = r.data.requiresLink
          }
        }
      });
    },
    clkSaveConfig() {
      console.log(this.requiresLink)
      if (this.$route.path === "/config/organismConfigDetail") {
        this.updateOrganismConfig();
      } else {
        this.createOrganismsConfig();
      }
    },
    addFunction () {
      if (this.newFunction.name && this.newFunction.description ) {
        if (this.$route.path === '/config/organismConfigDetail') {
          this.createOrganismFunctionConfig()
          this.getVisions()
        } else {
          this.functions.push({...this.newFunction})
          this.getVisions()
        }
        this.newFunctionDialog = false
      } else this.$q.notify('preencha os campos obrigatórios!')
    },
    createOrganismFunctionConfig() {
      const organismConfigId = this.$route.query.organismConfigId;
      const opt = {
        route: "/desktop/config/createOrganismFunctionConfig",
        body: {
          organismConfigId: organismConfigId,
          functionData: this.newFunction
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.newFunctionDialog = false
          this.getOrganismConfigById()
        }
      });
    },
    functionDialogClosed () {
      this.newFunction = {
        name: '',
        description: '',
        requiredTitleId: null,
        functionGroupId: null,
        functionProperties: {
          canManageFuncAndOrgSolicitations: false,
          canCreateAndEditChildOrganism: false,
          numRequired: false,
        },
        isRequired: true,
        visions: []
      }
    },
    editFunction (item) {
      this.editFunctionDialog.function = item
      this.editFunctionDialog.open = true
      this.editFunctionDialog.function.visions.forEach((dialogVision,i) => {
        this.visionsList.forEach(vision => {
          if (dialogVision.visionId === vision.visionId) {
            this.editFunctionDialog.function.visions[i] = dialogVision 
          }
        })
      });
      this.editFunctionDialog.function.requiredTitleId = item.requiredTitle;
      this.editFunctionDialog.function.numOfOccupants = item.numOfOccupants;
    },
    updateOrganismFunctionConfig () {
      const opt = {
        route: "/desktop/config/updateOrganismFunctionConfig",
        body: {
          organismFunctionConfigId: this.editFunctionDialog.function.organismFunctionId,
          functionData: this.editFunctionDialog.function
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.editFunctionDialog.open = false
          this.getOrganismConfigById()
        }
      });
    },
    deleteFunction (item) {
      this.dialogDeleteFunction.open = true
      this.dialogDeleteFunction.function = item
    },
    confirmDeleteFunction () {
      const opt = {
        route: "/desktop/config/updateOrganismFunctionConfig",
        body: {
          organismFunctionConfigId: this.dialogDeleteFunction.function.organismFunctionId,
          isActive: 0
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.dialogDeleteFunction.open = false
          this.getOrganismConfigById()
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getVisions() {
      const opt = {
        route: "/desktop/config/getVisions",
        body: {
          isActive: 1,
        },
      };
      useFetch(opt).then((r) => {
        this.visionsList = r.data.map(vision => {
          return {
            name: vision.visionInfo.name,
            visionId: vision._id, 
            description: vision.visionInfo.description,
            permissions: vision.visionInfo.permissions
          }
        });
      });
    },
    getOrganismsConfigsList() {
      const opt = {
        route: "/desktop/config/getOrganismsConfigsList",
        body: {
          searchString: this.searchString
        }
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          console.log("Erro getOrganismConfigsList")
          return
        }
        this.organismConfigsList = r.data
      })
    },
    confirmChildOf() {
      this.$q.notify("Organismo agrupado com sucesso")
      this.requiresLink = true;confirmColor
      this.dialogCreateAffiliation = false
    },
    dialogCancelAffiliation() {
      this.requiresLink = false;
      this.$q.notify("Filiação cancelada");
      this.dialogCreateAffiliation = false;
    },
    getOccupantsOptions() {
      const opt = {
        route: "/desktop/config/getFuctionsSizeOptions"
      }
      useFetch(opt).then((r) => {
        if(!r.error) {
          this.occupantsOptions = r.data
        } else {
          console.log("erro em getOccupantsOptions")
        }
      })
    },
    confirmColor() {
      this.selectedColor = this.newColor;
      if(this.selectedColor !== '') {
        this.$q.notify("Cor selecionada com sucesso")
      } else {
        this.$q.notify("Selecione uma cor para confirmar")
        return
      }
      this.dialogSelectColor = false
    }
  },
});
</script>
<style scoped>
.visions-field {
  border: 1px solid #c2c2c2;
  padding: 7px;
  border-radius: 0.2rem;
  max-height: 300px;
  overflow-y: auto;
}
.selected-chip {
  background-color: #4caf50; /* Cor de fundo para chips selecionados */
  color: white; /* Cor do texto para chips selecionados */
}
</style>