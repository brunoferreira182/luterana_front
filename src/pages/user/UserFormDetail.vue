<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          class="col-6 text-h5 text-capitalize"> {{ formName }}
          <div class="text-caption">Formulário</div>
          <q-chip 
            v-if="formStatus === 'draft'"
            color="yellow-8" 
            text-color="white" 
            icon="cloud"
            align="right"
          >
            Status: Em rascunho
          </q-chip>
          <q-chip 
            v-if="formStatus === 'sent'"
            color="green-8" 
            text-color="white" 
            icon="cloud"
            align="right"
          >
            Status: Enviado
          </q-chip>
        </div>
        <div class="col text-right q-gutter-sm">
          <q-btn
            v-if="$route.query.savedFormId && formStatus === 'draft'"
            @click="updateDraftFormData"
            rounded
            color="primary"
            unelevated
            outline
            label="Salvar como rascunho"
            no-caps
          />
          <q-btn
            v-if="$route.query.savedFormId && formStatus === 'draft'"
            @click="updateSentFormData"
            rounded
            color="primary"
            unelevated
            label="Enviar"
            no-caps
          />
          <q-btn
            v-if="$route.query.formId"
            @click="saveFormSketchData"
            rounded
            color="primary"
            unelevated
            outline
            label="Salvar como rascunho"
            no-caps
          />
          <q-btn
            v-if="$route.query.formId"
            @click="saveFormData"
            rounded
            color="primary"
            unelevated
            label="Enviar"
            no-caps
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-12 q-gutter-md" align="start">
          <div
            class="text-h5"
          >
            Dados
          </div>
          <div
            class="q-gutter-sm"
            v-if="formFields.length"
          >
            <div v-for="(field, fieldIndex) in formFields" :key="fieldIndex">
              <q-input
                v-if="field.type.type !== 'boolean' &&
                  field.type.type !== 'person' &&
                  field.type.type !== 'address' &&
                  field.type.type !== 'options'&&
                  field.type.type !== 'attach' &&
                  field.type.type !== 'organism' &&
                  field.type.type !== 'multiple_select' &&
                  field.type.type !== 'image' &&
                  field.type.type !== 'wisiwig' &&
                  field.type.type !== 'textarea'"
                v-model="field.value" 
                outlined
                :type="getInputType(field.type.type)"
                :reverse-fill-mask="field.type.type === 'money'"
                :prefix="field.type.type === 'money' ? 'R$' : null"
                :label="field.label + (field.required ? '' : ' (Opcional)')"
                :mask="field.type.mask"
                :hint="field.hint"
              />
              <div
                v-if="field.type.type === 'textarea'"
              >
                <q-input
                  :label="field.label"
                  :hint="field.hint"
                  v-model="field.value"
                  filled
                  type="textarea"
                />
              </div>
              <div v-if="field.type.type === 'wisiwig'">
                <q-editor 
                  :label="field.label"
                  :hint="field.hint"
                  v-if="field.type.type === 'wisiwig'"
                  v-model="field.value" 
                  min-height="5rem" 
                />
              </div>
              <div v-if="field.type.type === 'multiple_select'">
                <div class="text-h5 q-pa-sm bg-grey-3" style="border-radius: 1rem">
                  <div class="q-pl-md q-py-sm">
                    {{ field.label }}:
                  </div>
                  <div 
                    class="q-pa-sm"
                  >
                    <q-btn
                      v-if="field.multiple || (!field.value || field.value.length === 0)"
                      icon="add"
                      color="primary"
                      outline
                      rounded
                      @click="addDoubleSelection(fieldIndex)"
                      no-caps
                    >
                      Adicionar nova seleção dupla
                    </q-btn>
                  </div>
                  <div>
                    <div v-if="field.value">
                      <div
                        v-for="(value, valueIndex) in field.value"
                        :key="valueIndex"
                        class="row wrap justify-left q-pa-sm items-left content-center"
                      >
                        <q-select 
                          v-for="(select, selectIndex) in field.selects"
                          :key="'internalSelect' + selectIndex"
                          :label="select.label"
                          option-label="options"
                          emit-value
                          map-options
                          v-model="formFields[fieldIndex].value[valueIndex][selectIndex]"
                          :options="select.options"
                          class="col-5"
                        />
                        <q-btn
                          icon="delete"
                          class="q-ml-lg"
                          rounded
                          flat
                          color="red"
                          @click="formFields[fieldIndex].value.splice(valueIndex, 1)" 
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="field.type.type === 'organism'">
                <div v-if="field.value && field.value.length > 0">
                  <div class="text-body">{{ field.label }}</div>
                  <q-list class="no-margin">
                    <q-item
                      v-for="(item, i) in field.value"
                      :key="item + i"
                      style="border-radius: 1rem"
                      class="bg-grey-3 q-ma-sm q-pa-md"
                    >
                      <q-item-section>
                        <q-item-label class="text-capitalize">
                          {{ item.organismName }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>
                          <q-btn
                            icon="delete"
                            flat
                            color="red"
                            @click="removeThisOrganism(fieldIndex, i)"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <q-btn
                  :label="`Adicionar ${field.label}`"
                  no-caps
                  rounded
                  unelevated
                  outline
                  color="primary"
                  icon="add"
                  v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                  @click="clkOpenAddOrganismDialog(fieldIndex)"
                />
              </div>
              <q-file
                      v-if="field.type.type === 'image'"
                      v-model="files"
                      @rejected="onRejected"
                      :filter="checkFileType"
                      label="Clique aqui para adicionar imagem de perfil"
                      outlined
                      @update="saveProfilePhoto"
                    >
                      <template #append>
                        <q-icon name="attach_file" />
                      </template>
                    </q-file>
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
                      >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div
                v-if="field.type.type === 'options'"
              > 
                <q-select
                  outlined
                  :label="field.label"
                  option-label="optionName"
                  :option-value="field.options"
                  emit-value
                  map-options
                  :hint="field.hint"
                  v-model="field.value"
                  :options="field.options"
                />
              </div>
              <div v-if="field.type.type === 'person'">
                <div v-if="field.value && field.value.length > 0">
                  <div class="text-body">{{ field.label }}</div>
                  <q-list class="no-margin">
                    <q-item
                      v-for="(item, i) in field.value"
                      :key="item + i"
                      style="border-radius: 1rem"
                      class="bg-grey-3 q-ma-sm q-pa-md"
                    >
                      <q-item-section>
                        <q-item-label class="text-capitalize">
                          {{ item.userName }}
                        </q-item-label>
                        <q-item-label caption>
                          {{ item.email }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>
                          <q-btn
                            icon="delete"
                            flat
                            color="red"
                            @click="removeThisPerson(fieldIndex, tabsIndex, i)"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <q-btn
                  :label="`Adicionar ${field.label}`"
                  no-caps
                  rounded
                  unelevated
                  outline
                  color="primary"
                  icon="add"
                  v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                  @click="clkOpenAddPersonDialog(fieldIndex)"
                />
              </div>
              <div v-if="field.type.type === 'address'">
                <q-list class="no-margin" v-if="field.value">
                  <q-item
                    v-for="(item, itemIndex) in field.value"
                    :key="item + itemIndex"
                    style="border-radius: 1rem"
                    class="bg-grey-3 q-ma-sm q-pa-md"
                  >
                    <q-item-section>
                      <q-item-label class="text-capitalize">
                        {{ item.street }}, {{ item.number }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ item.district }} - {{ item.city }}
                      </q-item-label>
                      <q-item-label caption>
                        CEP
                        {{ item.cep }}
                      </q-item-label>
                      <q-item-label caption>
                        Complemento:
                        {{ item.complement }}
                      </q-item-label>
                      <q-item-label></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption class="text-capitalize">
                        <q-badge>{{ item.type }}</q-badge>
                      </q-item-label>
                      <q-item-label>
                      <q-btn
                        icon="edit"
                        flat
                        color="primary"
                        @click="editThisAddress(fieldIndex, itemIndex)"
                      >
                      </q-btn>
                      <q-btn
                        icon="delete"
                        flat
                        color="red"
                        @click="removeThisAddress(fieldIndex, itemIndex)"
                      >
                      </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-btn
                  label="Adicionar endereço"
                  no-caps
                  rounded
                  unelevated
                  outline
                  color="primary"
                  icon="add"
                  @click="clkOpenAddressDialog(fieldIndex, fieldIndex)"
                />
              </div>
              <!-- <q-checkbox
                v-else-if="field.type.type === 'boolean'"
                :label="field.label"
                v-model="newOrganism[field.model]"
              ></q-checkbox> -->
            </div>
          </div>
        </div>
      </div>
      <q-dialog v-model="addOrganism.dialogOpen" @hide="clearOrganismInputs">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione o organismo</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-select
              v-model="addOrganism.organismSelected"
              filled
              use-input
              label="Nome do organismo"
              option-label="organismName"
              :options="addOrganism.organismsOptions"
              @filter="getOrganismByString"
              :option-value="(item) => item"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              color="primary"
              @click="addOrganism.dialogOpen = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="confirmAddOrganism"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogConfirmAddress.open" @hide="clearAddressInputs">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Informe os dados de endereço</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input mask="########" outlined label="CEP" v-model="cep" @keyup="checkCEP" />
            <q-input
              outlined
              label="Informe o tipo de endereço (obrigatório)"
              hint="Exemplo: Casa, trabalho, etc..."
              v-model="addressType"
            />
            <q-input outlined label="Logradouro" v-model="street" />
            <q-input outlined label="Número" type="number" v-model="number" />
            <q-input outlined label="Bairro" v-model="district" />
            <q-input outlined label="Complemento" v-model="complement" />
            <div class="row">
              <div class="col">
                <q-input outlined label="Cidade" v-model="city" />
              </div>
              <div class="col q-pl-md">
                <q-input outlined mask="AA" label="Estado" v-model="state" />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogConfirmAddress.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addAddress"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="addPerson.dialogOpen" @hide="clearPersonInputs">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione a pessoa</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-select
              v-model="addPerson.userSelected"
              filled
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="addPerson.usersOptions"
              @filter="getUsers"
              :option-value="(item) => item"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              color="primary"
              @click="addPerson.dialogOpen = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="confirmAddPerson"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "UserFormDetail",
  data() {
    return {
      addOrganism: {
        dialogOpen: false,
        fieldIndex: null,
        fieldIndex: null,
        organismsOptions: null,
        organismSelected: null,
        data: {
          name: ''
        },
      },
      cep: "",
      street: "",
      number: "",
      city: "",
      state: "",
      district: "",
      complement: "",
      addressType: "",
      dialogConfirmAddress: {
        open: false,
      },
      addPerson: {
        dialogOpen: false,
        fieldIndex: null,
        tabIndex: null,
        usersOptions: null,
        userSelected: null,
        data: {
          name: '',
        },
      },
      usersOptions: [],
      userSelected: '',
      formFields: [],
      formName: '',
      formStatus: '',
      formType: null,
    };
  },
  beforeMount() {
    if (this.$route.query.savedFormId !== undefined) {
      this.getSavedFormById()
    } else {
      this.getFormDetailById();
    }
  },
  mounted(){
    this.$q.loading.hide();
  },
  methods: {
    addDoubleSelection( fieldIndex){
      if (!this.formFields[fieldIndex].value) {
        this.formFields[fieldIndex].value = []
      }
      this.formFields[fieldIndex].value.push([])
    },
    confirmAddPerson () {
      if (!this.formFields[this.addPerson.fieldIndex].multiple)
        this.formFields[this.addPerson.fieldIndex].value = [ this.addPerson.userSelected ]
      else {
        if (!this.formFields[this.addPerson.fieldIndex].value
          || this.formFields[this.addPerson.fieldIndex].value === ''
          ) {
            this.formFields[this.addPerson.fieldIndex].value = [ this.addPerson.userSelected ]
        } else {
          this.formFields[this.addPerson.fieldIndex].value.push(this.addPerson.userSelected)
        }
      }
      this.clearPersonInputs()
      this.addPerson.dialogOpen = false
    },
    clearPersonInputs () {
      this.addPerson.userSelected = null
    },
    removeThisPerson(fieldIndex,i) {
      this.formFields[fieldIndex].value.splice(i, 1);
      this.clearPersonInputs()
    },
    clkOpenAddPersonDialog (fieldIndex) {
      this.addPerson.fieldIndex = fieldIndex
      this.addPerson.dialogOpen = true
    },
    removeThisOrganism(fieldIndex, i) {
      this.formFields[fieldIndex].value.splice(i, 1);
      this.clearOrganismInputs()
    },
    confirmAddOrganism() {
      if (!this.formFields[this.addOrganism.fieldIndex].multiple)
        this.formFields[this.addOrganism.fieldIndex].value = [ this.addOrganism.organismSelected ]
      else {
        if (!this.formFields[this.addOrganism.fieldIndex].value
          || this.formFields[this.addOrganism.fieldIndex].value === ''
          ) {
            this.formFields[this.addOrganism.fieldIndex].value = [ this.addOrganism.organismSelected ]
        } else {
          this.formFields[this.addOrganism.fieldIndex].value.push(this.addOrganism.organismSelected)
        }
      }
      this.clearOrganismInputs()
      this.addOrganism.dialogOpen = false
    },
    getOrganismByString(val, update) {
      if (val < 2) return
      const opt = {
        route: '/desktop/adm/getOrganismsNames',
        body: {
          searchString: val
        }
      }
      useFetch(opt).then(r => {
        if (r.error) return this.$q.notify(r.errorMessage)
        update(() => {
          this.addOrganism.organismsOptions = r.data
        })
      })
    },
    clearOrganismInputs() {
      this.addOrganism.organismSelected = null
    },
    clkOpenAddOrganismDialog(fieldIndex) {
      this.addOrganism.fieldIndex = fieldIndex
      this.addOrganism.dialogOpen = true
    },
    clkOpenAddressDialog(fieldIndex){
      this.dialogConfirmAddress.open = true
      this.fieldIndex = fieldIndex
    },
    removeThisAddress(fieldIndex, addressIndex) {
      this.formFields[fieldIndex].value.splice(addressIndex, 1);
    },
    editThisAddress(fieldIndex, addressIndex){
      this.dialogConfirmAddress.open = true
      this.cep = this.formFields[fieldIndex].value[0].cep
      this.addressType = this.formFields[fieldIndex].value[0].type
      this.street = this.formFields[fieldIndex].value[0].street
      this.number = this.formFields[fieldIndex].value[0].number
      this.district = this.formFields[fieldIndex].value[0].district
      this.complement = this.formFields[fieldIndex].value[0].complement
      this.city = this.formFields[fieldIndex].value[0].city
      this.state = this.formFields[fieldIndex].value[0].state
      this.formFields[fieldIndex].value.splice(addressIndex, 1);
    },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/commonUsers/getUsers",
        body: {
          searchString: val,
          isActive: 1,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){
          this.$q.notify(r.errorMessage)
          return
        }
        update(() => {
          this.addPerson.usersOptions = r.data.list;
        })
      });
    },
    addAddress() {
      if(this.addressType === "") {
        this.$q.notify("Preencha o tipo de endereço")
        return
      }
      const fieldIndex = this.fieldIndex
      if (!this.formFields[fieldIndex].value)
        this.formFields[fieldIndex].value = []
        this.formFields[fieldIndex].value.push({
          type: this.addressType,
          cep: this.cep,
          street: this.street,
          number: this.number,
          city: this.city,
          state: this.state,
          district: this.district,
          complement: this.complement
      });
      this.dialogConfirmAddress.open = false;
      this.clearAddressInputs()
    },
    checkCEP(ev) {
      this.cep = ev.target.value;
      if (this.cep.length === 8) {
        const opt = {
          route: "/utils/consultZipCode",
          body: {
            zipCode: this.cep,
          },
        };
        this.$q.loading.show();
        useFetch(opt).then((r) => {
          this.$q.loading.hide();
          this.street = r.data.logradouro;
          this.city = r.data.localidade;
          this.state = r.data.uf;
          this.district = r.data.bairro;
        });
      }
    },
    clearAddressInputs(){
      this.addressType = ''
      this.type = "";
      this.cep = "";
      this.street = "";
      this.number = "";
      this.city = "";
      this.state = "";
      this.district = "";
      this.complement = "";
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
    updateDraftFormData() {
      const opt = {
        route: "/desktop/commonUsers/updateFormData",
        body: {
          fields: this.formFields,
          formStatus: 'draft',
          savedFormId: this.$route.query.savedFormId
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify(r.errorMessage);
        } else {
          this.$q.notify("Formulário preenchido com sucesso!");
        }
      });
    },
    updateSentFormData() {
      const opt = {
        route: "/desktop/commonUsers/updateFormData",
        body: {
          fields: this.formFields,
          formStatus: 'sent',
          savedFormId: this.$route.query.savedFormId
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify(r.errorMessage);
        } else {
          this.$q.notify("Formulário preenchido com sucesso!");
        }
      });
    },
    saveFormSketchData() {
      const opt = {
        route: "/desktop/commonUsers/saveFormData",
        body: {
          fields: this.formFields,
          formStatus: 'draft',
          formId: this.$route.query.formId
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Rascunho de formulário preenchido com sucesso!");
          this.$router.push('/user/userFormDetail?savedFormId=' + r.data.savedFormId) 
        }
      });
    },
    saveFormData() {
      const opt = {
        route: "/desktop/commonUsers/saveFormData",
        body: {
          fields: this.formFields,
          formStatus: 'sent',
          formId: this.$route.query.formId
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Formulário preenchido com sucesso!");
          this.$router.push('/user/userFormDetail?SavedFormId=' + r.data.savedFormId) 
        }
      });
    },
    getSavedFormById() {
      const opt = {
        route: "/desktop/commonUsers/getSavedFormById",
        body: {
          savedFormId: this.$route.query.savedFormId
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.formName = r.data.formName
          r.data.status ? this.formStatus = r.data.status : this.formStatus = ''
          this.formFields = r.data.fields
        }
      });
    },
    getFormDetailById() {
      const opt = {
        route: "/desktop/commonUsers/getFormDetailById",
        body: {
          formId: this.$route.query.formId
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.formName = r.data.name
          r.data.status ? this.formStatus = r.data.status : this.formStatus = ''
          this.formFields = r.data.fields
        }
      });
    },
    updateForm() {
      const opt = {
        route: "/desktop/config/updateForm",
        body: {
          formId: this.$route.query.formId,
          organismConfigId: this.organismConfigId,
          formName: this.formConfigName,
          formFields: this.formFields,
          visions: this.visions
        },
      };
      if(this.noOrganism === true){
        opt.body.organismConfigId = this.noOrganismConfig
        opt.body.visions = []
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Configuração de formulário atualizado com sucesso!");
          this.multiple = "";
          this.$router.push('/config/formConfigList')
        }
      });
    },
  },
});
</script>