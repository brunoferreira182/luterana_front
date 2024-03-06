<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-h5 text-capitalize">novo organismo</div>
        <div class="col text-right self-center">
          <q-btn
            @click="createOrganism()"
            no-caps
            color="primary"
            rounded
            unelevated
            label="Criar organismo"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-ma-md">
        <div class="col q-gutter-md" align="start">
          <div class="text-h5">Selecione o tipo de configuração de organismo</div>
          <q-select
            outlined
            label="Nome da configuração"
            option-label="organismConfigName"
            :option-value="(item) => item"
            emit-value
            map-options
            hint="Informe qual o tipo de configuração que está aplicando"
            v-model="organismData.organismConfigId"
            :options="organismConfigOptions"
            @update:modelValue="getOrganismConfigById"
          />
          <q-dialog v-model="dialogOrganismNotCreatedInSGA">
            <q-card class="text-center q-pa-md" style="border-radius: 1rem; width: 350px;">
              <q-item-section>
                <q-item-label class="text-h5">
                  Aviso
                </q-item-label>
                <q-item-label class="text-subtitle1">
                  O organismo não foi criado no SGA
                </q-item-label>
              </q-item-section>
              <q-card-actions align="center">
                <q-btn flat label="Entendi" no-caps @click="dialogOrganismNotCreatedInSGA = false"/>
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-separator class="q-ma-md" v-if="organismList.length"/>
          <div v-if="organismList.length && $route.path.includes('/admin')">
            <q-btn
              label="Gerenciar Vínculos"
              color="primary"
              rounded
              no-caps
              unelevated
              @click="dialogLinks = true"
            />
          </div>
          <q-separator v-if="organismData.fields.length" />
          <div v-if="organismData.fields.length" class="text-h5">
            Preencha os dados necessários:
          </div>
          <div v-for="(field, fieldIndex) in organismData.fields" :key="fieldIndex">
            <div v-if="
              field.type.type === 'string'
              || field.type.type === 'int'
              || field.type.type === 'date'
              || field.type.type === 'cpf'
              || field.type.type === 'cnpj'
              || field.type.type === 'money'
              || field.type.type === 'textarea'
              "
            >
              <q-input
                :label="field.label"
                :hint="field.hint"
                :mask="field.type.mask"
                v-model="field.value"
                outlined
                :rules="field.type.mask ? [validateAtaKeyFormat] : []"
                :readonly="field.onlyAdm"
              >
              </q-input>
            </div>
            <q-file
              v-if="field.type.type === 'image'"
              v-model="files"
              @rejected="onRejected"
              :filter="checkFileType"
              label="Clique aqui para adicionar imagem de perfil"
              outlined
              :readonly="field.onlyAdm"
            >
              <template #append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <div class="text-right" v-if="field.type.type === 'options'">
              <q-select
                outlined
                :label="field.label"
                option-label="optionName"
                emit-value
                map-options
                :hint="field.hint"
                v-model="field.value"
                :options="field.options"
                :readonly="field.onlyAdm"
              >
              </q-select>
            </div>
            <div v-if="field.type.type === 'attach'">
              <q-item class="bg-grey-3" style="border-radius: 1rem">
                <q-item-section>
                  <q-item-label class="text-h5">
                    {{ field.label }}
                  </q-item-label>
                  <q-item-label class="text-subtitle1">
                    {{ field.hint }}
                  </q-item-label>
                  <q-item-label>
                    <q-file
                      class="bg-white"
                      v-model="field.value"
                      label="Escolha um ou mais arquivos"
                      outlined
                      use-chips
                      multiple
                      :readonly="field.onlyAdm"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" />
                      </template>
                    </q-file>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <q-checkbox
              v-if="field.type.type === 'boolean'"
              class="q-pt-lg"
              :label="field.label"
              :hint="field.hint"
              v-model="field.value"
              :readonly="field.onlyAdm"
            />  
            <div v-if="field.type.type === 'address'">
              <q-btn
                label="Endereço"
                no-caps
                rounded
                unelevated
                flat
                color="primary"
                icon="add"
                @click="clkOpenAddressDialog(fieldIndex)"
                class="q-mt-xs"
                :disable="field.onlyAdm"
              />
              <CardAddress
                :data="field.value"
                :fieldIndex="fieldIndex"
                @edit="editThisAddress"
                @remove="removeThisAddress"
              />
            </div>

            <div v-if="
              field.type.type === 'email'
              || field.type.type === 'phone'
              || field.type.type === 'mobile'
              "
            >
              <q-btn
                :label="`${field.type.label}`"
                no-caps
                flat
                v-if="field.multiple || (!field.multiple && (!field.value || field.value.length === 0))"
                icon="add"
                color="primary"
                rounded
                @click="addPhoneMobileEmail(fieldIndex, field)"
                class="q-mt-xs"
                :disable="field.onlyAdm"
              />
              <CardPhoneMobileEmail
                :data="field.value"
                :fieldIndex="fieldIndex"
                @edit="editPhoneMobileEmail"
                @remove="removePhoneMobileEmail"
              />
            </div> 
          </div>
        </div>
        <q-dialog full-height full-width v-model="dialogLinks" @hide="clearDialogAndFunctions" animated>
          <q-card>
            <q-card-section>
              <div class="text-h6 text-center">
                Vínculos
              </div>
            </q-card-section>
            <q-card-section>
              <div  class="text-subtitle2 q-mb-sm">
                Organismos vinculados:
              </div>
              <q-input 
                v-if="organismLinks.length" 
                label="Buscar" 
                outlined
                v-model="organismVinculated"
                type="search"
              >
                <template #append>
                  <q-icon v-if="organismVinculated !== ''" name="close" @click="organismVinculated = ''" class="cursor-pointer" />
                  <q-icon name="search" />
                </template>
              </q-input>
              <div v-if="organismLinks.length">
                <q-chip removable @remove="removeLink(chip,i)" v-for="(chip, i) in organismLinks" :key="i">
                  {{ chip.nome }}
                </q-chip>
              </div>
              <div v-else class="text-center q-mt-md">Nenhum vínculo.</div>
            </q-card-section>
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">
                Vincular novo organismo:
              </div>
              <q-input 
                label="Buscar"
                outlined
                type="search"
                v-model="organismSelected"
                hint="Faça uma busca para visualizar os organismos disponíveis"
                @update:model-value="getOrganismsList"
              >
                <template #append>
                  <q-icon v-if="organismSelected !== ''" name="close" @click="organismSelected = ''" class="cursor-pointer" />
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-list bordered class="q-mt-sm">
                <q-item
                  clickable
                  :disable="organismLinks.includes(organism)"
                  @click="addNewLink(organism,i)"
                  v-for="(organism,i) in organismList"
                  :key="i"
                >
                  <q-item-section>
                    {{ organism.nome }}
                  </q-item-section>
                  <q-item-section class="text-primary" side>
                    {{ organismLinks.includes(organism) ? 'Adicionado' : 'Adicionar'}}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="Fechar"
                no-caps
                rounded
                color="primary"
                @click="dialogLinks = false"
              />
              <q-btn 
                label="Salvar vínculo"
                no-caps
                rounded
                unelevated
                @click="dialogLinks = false"
                color="primary"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <DialogPhoneMobileEmail
          :open="dialogAddPhoneMobileEmail.open"
          :dataProp="dialogAddPhoneMobileEmail.data"
          :type="dialogAddPhoneMobileEmail.type"
          @confirm="confirmAddPhoneMobileEmail"
          @closeDialog="clearDialogAddPhoneMobileEmail"
        />
        <DialogAddress
          :open="dialogConfirmAddress.open"
          :addressDataProp="dialogConfirmAddress.data"
          @confirmAddress="confirmAddress"
          @closeDialog="clearAddressInputs"
        />
        
      </div>
    </q-page>
  </q-page-container>
</template>
<script setup>
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import DialogPhoneMobileEmail from '../../components/DialogPhoneMobileEmail.vue'
import CardAddress from '../../components/CardAddress.vue'
import DialogAddress from '../../components/DialogAddress.vue'
</script>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { date } from "quasar";
export default defineComponent({
  name: "CreateOrganism",
  data() {
    return {
      userInput: '',
      userSelected: '',
      selectedFunc: "",
      selectedFuncIndex: "",
      usersOptions: [],
      organismConfigOptions: [],
      organismFunctionConfigId: null,
      dialogInsertUserInFunction:{
        initialDate: '',
        open: false,
      },
      dialogDeleteUserFromFunction: {
        obsText: "",
        finalDate: "",
        functionUserId: "",
        open: false,
        data: {},
      },
      newOrganism: {},
      newMultipleValue: "",
      newFunctionDialog: false,
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      functions: [],
      organismList: [],
      organismLinks: [],
      organismLinkEvent: '',
      organismSelected: '',
      organismVinculated: '',
      dialogLinks: false,
      dialogConfirmAddress: {
        open: false,
        fieldIndex: null,
        valueIndex: null,
        data: {
          cep: "",
          street: "",
          number: "",
          city: "",
          state: "",
          district: "",
          complement: "",
          addressType: ''
        }
      },
      dialogAddPhoneMobileEmail: {
        type: null,
        open: false,
        fieldIndex: null,
        data: {
          value: '',
          type: ''
        },
        action: null,
        iValue: null
      },
      dialogOrganismNotCreatedInSGA: false,
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismsConfigs()
  },
  methods: {
    validateAtaKeyFormat(value) {
      const regex = /^([A-Z]{3}-[A-Z]{3}-\d{3}-\d{4}-\d{2}-[a-z])$/;
      if (regex.test(value)) {
        this.$q.notify({
          message: 'Chave ata validada!',
          color: 'green-8'
        })
        return true;
      }else{
        return this.$q.notify('Formato inválido. Por favor, revise os dados digitados na chave-ata');
      }
    },
    clearAddressInputs(){
      this.dialogConfirmAddress.data = {
        addressType: '',
        type: "",
        cep: "",
        street: "",
        number: "",
        city: "",
        state: "",
        district: "",
        complement: ""
      }
      this.dialogConfirmAddress.open = false;
    },
    clkOpenAddressDialog(fieldIndex) {
      this.dialogConfirmAddress.action = 'add'
      this.dialogConfirmAddress.open = true
      this.dialogConfirmAddress.fieldIndex = fieldIndex
    },
    clearDialogAddPhoneMobileEmail () {
      this.dialogAddPhoneMobileEmail = {
        type: null,
        open: false,
        fieldIndex: null,
        data: {
          value: '',
          type: ''
        },
        options: ['Pessoal', 'Profissional', 'Outro'],
        action: null,
        iValue: null
      }
      this.dialogAddPhoneMobileEmail.open = false
    },
    removeThisAddress(fieldIndex, valueIndex) {
      this.organismData.fields[fieldIndex].value.splice(valueIndex, 1);
    },
    editThisAddress(fieldIndex, valueIndex){
      this.dialogConfirmAddress = {
        open: true,
        fieldIndex,
        tabsIndex,
        valueIndex,
        action: 'edit',
        data: {
          cep: this.organismData.fields[fieldIndex].value[valueIndex].cep,
          addressType: this.organismData.fields[fieldIndex].value[valueIndex].type,
          street: this.organismData.fields[fieldIndex].value[valueIndex].street,
          number: this.organismData.fields[fieldIndex].value[valueIndex].number,
          district: this.organismData.fields[fieldIndex].value[valueIndex].district,
          complement: this.organismData.fields[fieldIndex].value[valueIndex].complement,
          city: this.organismData.fields[fieldIndex].value[valueIndex].city,
          state: this.organismData.fields[fieldIndex].value[valueIndex].state,
        }
      }
    },
    confirmAddress(data) {
      const fieldIndex = this.dialogConfirmAddress.fieldIndex
      const valueIndex = this.dialogConfirmAddress.valueIndex
      if (this.dialogConfirmAddress.action === 'add') {
        if (!this.organismData.fields[fieldIndex].value)
          this.organismData.fields[fieldIndex].value = []
        this.organismData.fields[fieldIndex].value.push({
          type: data.addressType,
          cep: data.cep,
          street: data.street,
          number: data.number,
          city: data.city,
          state: data.state,
          district: data.district,
          complement: data.complement
        });
      } else if (this.dialogConfirmAddress.action === 'edit') {
        this.organismData.fields[fieldIndex].value[valueIndex] = {
          type: data.addressType,
          cep: data.cep,
          street: data.street,
          number: data.number,
          city: data.city,
          state: data.state,
          district: data.district,
          complement: data.complement
        }
      }
      this.clearAddressInputs()
    },
    confirmAddPhoneMobileEmail (data) {
      if (this.dialogAddPhoneMobileEmail.action === 'add') {
        if (!this.organismData.fields[this.dialogAddPhoneMobileEmail.fieldIndex].value){
          this.organismData.fields[this.dialogAddPhoneMobileEmail.fieldIndex].value = []
        }
        this.organismData.fields[this.dialogAddPhoneMobileEmail.fieldIndex].value.push({...data})
      } else if (this.dialogAddPhoneMobileEmail.action === 'edit') {
        this
          .organismData
          .fields[this.dialogAddPhoneMobileEmail.fieldIndex]
          .value[this.dialogAddPhoneMobileEmail.iValue] = {...data}
      }
      this.dialogAddPhoneMobileEmail.open = false
    },
    removePhoneMobileEmail (fieldIndex, iValue) {
      this
        .organismData
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    addPhoneMobileEmail(fieldIndex, field) {
      this.dialogAddPhoneMobileEmail.action = 'add'
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
    },
    editPhoneMobileEmail (fieldIndex, field, value, iValue) {
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.data = {...value}
      this.dialogAddPhoneMobileEmail.action = 'edit'
      this.dialogAddPhoneMobileEmail.iValue = iValue
    },
    addDoubleSelection(i){
      if (!this.organismData.fields[i].value) {
        this.organismData.fields[i].value = []
      }
      this.organismData.fields[i].value.push([])
    },
    getOrganismsList() {
      const opt = {
        route: "/desktop/adm/getOrganismsList",
        body: {
          searchString: this.organismSelected
        }
      };
      useFetch(opt).then(r => {
        this.organismList = r.data.list;
      })
    },
    dialogInsertObservation(user) {
      this.dialogOpenObservation.data = user;
      this.dialogOpenObservation.open = true;
      this.dialogOpenObservation.functionUserId = user._id;
    },
    deleteUserFromFunction(user, funcIndex){
      const functionData = this.functions[funcIndex];
      const userId = user.functionUserId;
      const userIndex = functionData.users.findIndex(user => user._id === userId);
      if (userIndex !== -1) {
        functionData.users.splice(userIndex, 1);
      }
    },
    dialogOpenDeleteUserFromFunction(user, funcIndex) {
      this.dialogDeleteUserFromFunction.open = true;
      this.dialogDeleteUserFromFunction.data = user;
      this.dialogDeleteUserFromFunction.functionUserId = user._id;
      this.dialogDeleteUserFromFunction.funcIndex = funcIndex;
    },
    linkUserToFunction(func, funcIndex ) {
      if (!this.functions[funcIndex].users) {
        this.functions[funcIndex].users = [];
      }
      if (func.numOfOccupants && func.numOfOccupants === func.users.length) {
        this.$q.notify("A função completou o número de participantes máximo")
        return
      }
      this.selectedFuncIndex = funcIndex;
      this.selectedFunc = func;
      this.dialogInsertUserInFunction.open = true;
    },
    inactivateUserFromFunction() {
      const funcIndex = this.dialogDeleteUserFromFunction.funcIndex;
      const functionData = this.functions[funcIndex];
      const userId = this.dialogDeleteUserFromFunction.functionUserId;
      const userIndex = functionData.users.findIndex(user => user._id === userId);
      if (userIndex !== -1) {
        functionData.users.splice(userIndex, 1);
        this.dialogDeleteUserFromFunction.open = false;
        this.dialogDeleteUserFromFunction.data = {};
        this.dialogDeleteUserFromFunction.functionUserId = "";
      }
    },
    assignUserToFunction() {
      const selectedFuncIndex = this.selectedFuncIndex;
      if (this.userSelected === "" || this.dialogInsertUserInFunction.initialDate === "") {
        this.$q.notify("Preencha usuário e a data início");
        return;
      }
      if (!this.functions[selectedFuncIndex].users) {
        this.functions[selectedFuncIndex].users = [];
      }
      this.functions[selectedFuncIndex].users.push({
        organismFunctionConfigId: this.selectedFunc.organismFunctionId,
        userName: this.userSelected.userName,
        functionName: this.selectedFunc.name,
        userId: this.userSelected._id,
        initialDate: this.dialogInsertUserInFunction.initialDate,
      });
      this.clearDialogAndFunctions();
    },
    saveUserFunction() {
      if (
        this.userSelected === "" ||
        this.dialogInsertUserInFunction.initialDate === ""
      ) {
        this.$q.notify("Preencha usuário e a data início");
        return;
      }
      const opt = {
        route: "/desktop/adm/saveUserFunction",
        body: {
          initialDate: this.dialogInsertUserInFunction.initialDate,
          userId: this.userSelected,
          organismFunctionConfigId:
            this.selectedFunc.organismStructureFunctionId,
          functionId: this.selectedFunc.functionId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Usuário vinculado na função com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    clearDialogAndFunctions() {
      this.selectedFunc = {};
      this.userSelected = "";
      this.functionSelected = "";
      this.dialogInsertUserInFunction.open = false;
    },
    checkOrganismSelected(){
      if(this.organismData.organismConfigId === null){
        this.$q.notify('Preencha o nome da configuração para adicionar funções')
        return
      }
      this.newFunctionDialog = true
    },
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
    },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/adm/getUsers",
        body: {
          searchString: val,
          isActive: 1,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        update(() => {
          this.usersOptions = r.data.list;
        })
      });
    },
    getOrganismConfigById() {
      if(
        this.organismData.organismConfigId.organismConfigName === 'Congregação' || 
        this.organismData.organismConfigId.organismConfigName === 'Ponto de Missão' ||
        this.organismData.organismConfigId.organismConfigName === 'Paróquia'
      ){
        this.dialogOrganismNotCreatedInSGA = true
      }
      const opt = {
        route: "/desktop/adm/getOrganismConfigById",
        body: {
          _id: this.organismData.organismConfigId._id
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor")
          return
        }
        this.organismConfigName = r.data.organismConfigData.organismConfigName;
        this.organismData.fields = r.data.organismConfigData.organismFields;
        this.mountUserData();
      });
    },
    addMultipleField(field) {
      if (!field.value) {
        field.value = [];
      }
      field.value.push(field.newMultipleValue);
    },
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/adm/getOrganismsTypes",
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.organismTypesOptions = r.data;
        }
      });
    },
    getOrganismsConfigs() {
      const opt = {
        route: "/desktop/adm/getOrganismsConfigs",
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.organismConfigOptions = r.data
        }
      });
    },
    createOrganism() {
      if (!this.checkRequiredFields()) {
        this.$q.notify("Há campos obrigatórios não preenchidos")
        return
      }
      const organismLinksIds = this.organismLinks.map(organism => organism.organismId)
      const opt = {
        route: "/desktop/adm/createOrganism",
        body: {
          organismData: this.organismData,
          // functions: this.functions,
          organismLinks: organismLinksIds
        },
      };
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify(r.errorMessage);
          this.functions = []
          return
        }
        this.$q.notify('Organismo criado com sucesso!');
        const organismId = r.data
        this.$router.push('/admin/organismDetail?organismId=' + organismId)
      });

    },
    checkRequiredFields() {
      let allRight = true;
      this.organismData.fields.forEach((field) => {
        if (field.required && (!field.value || field.value === "")) {
          allRight = false;
        }
      });
      return allRight;
    },
    getInputType(type) {
      switch (type) {
        case "date":
          return "date";
        case "int":
          return "number";
        default:
          return "text";
      }
    },
    addNewLink (organism) {
      this.organismLinks.push(organism)
    },
    removeLink(i) {
      this.organismLinks.splice(i,1)
    },
    mountUserData () {
      this.organismData.fields.forEach((field) => {
        if(!field.value) {
          field.value = []
        }
      })
    }
  } 
});
</script>


