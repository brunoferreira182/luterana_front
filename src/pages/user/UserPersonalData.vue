<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">Preencher dados pessoais</div>
        <div class="col text-right">
          <q-btn
            no-caps
            rounded
            unelevated
            class="q-pa-sm"
            color="primary"
            icon="bookmark"
            flat
            :label="isSaving ? '' : 'Salvar Dados'"
            @click="salvar"
            :disable="isSaving"
          >
            <q-spinner-dots v-if="isSaving" color="white" size="1em" />
          </q-btn>
        </div>
      </div>
      <q-separator/>
      <div class="row" style="height: 100vh;">
        <div class="col-1">
          <q-tabs
            v-model="tab"
            vertical
            no-caps
            active-color="primary"
            indicator-color="primary"
            inline-label
            @update:model-value="addBar = false"
          >
            <q-tab 
              v-for="(tabs, i) in userData.userDataTabs"
              :key="i"
              class="edit-tab"
              :name="tabs.tabValue" 
              :label="tabs.tabLabel" 
            />
          </q-tabs>
        </div>
        <q-separator
          vertical
        />
        <div class="col-10 full-height">
          <q-tab-panels 
            animated 
            swipeable
            transition-prev="jump-up"
            transition-next="jump-up"
            class="bg-accent"
            :model-value="tab"
          >
          
            <q-tab-panel 
              v-for="(tabs, tabsIndex) in userData.userDataTabs"
              :key="tabsIndex"
              :name="tabs.tabValue" 
              
            >
            <div class="row justify-center ">
              <div class="col q-gutter-md" >
                <div
                  v-for="(field, fieldIndex) in tabs.fields"
                  :key="fieldIndex"
                  class="q-my-md"
                >
                  <div class="row q-gutter-sm justify-center items-center">
                    <div class="col-8">
                      <div v-if="field.type.type !== 'boolean' && field.type.type !== 'address' && field.type.type !== 'options' ">
                        <q-input
                          :label="field.label"
                          :hint="field.hint"
                          :type="field.type.type"
                          v-model="field.value"
                          outlined
                        >
                          <template
                            v-if="field.multiple"
                            #append
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
                        >
                        </q-select>
                      </div>
                      <div
                        v-if="field.type.type === 'address' && !field.address"
                        class="text-subtilte1 text-start"
                      >
                        <div class="text-h6">Endereços</div>
                        Nenhum endereço vinculado
                      </div>
                      <div
                        v-else-if="field.type.type === 'address' && !field.address[0]"
                        class="text-subtilte1 text-start"
                      >
                        <div class="text-h6">Endereços</div>
                        Nenhum endereço vinculado
                      </div>
                      <div class="text-right" v-if="field.type.type === 'address'">
                        <q-btn v-if="!(field.address)"
                          label="Adicionar um endereço"
                          no-caps
                          rounded
                          unelevated
                          outline
                          style="margin-top: -15%;"
                          color="primary"
                          @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
                        />
                        <q-btn v-else-if="!(field.address[0])"
                          label="Adicionar um endereço"
                          no-caps
                          rounded
                          unelevated
                          outline
                          style="margin-top: -15%;"
                          color="primary"
                          @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
                        />
                      </div>
                        <q-list
                          class="no-margin"
                          v-if="field.address"
                        >
                          <q-item
                            v-for="(item, i) in field.address"
                            :key="item + i"
                            style="border-radius: 1rem"
                            class="bg-grey-3 q-ma-sm q-pa-md"
                          >
                            <q-item-section>
                              <q-item-label lines="3" class="text-capitalize">
                                {{ item.street }}, {{ item.number }}
                              </q-item-label>
                              <q-item-label caption>
                                {{ item.district }} - {{ item.city }}
                              </q-item-label>
                              <q-item-label caption>
                                CEP
                                {{ item.cep }}
                              </q-item-label>
                              <q-item-label></q-item-label>
                            </q-item-section>
                            <q-item-section side top>
                              <q-item-label caption class="text-capitalize">{{
                                item.type
                              }}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                              <q-btn
                                icon="delete"
                                flat
                                style="width: 15px;"
                                class="absolute-right"
                                @click="removeThisAddress(fieldIndex, tabsIndex, i)"
                              >
                              </q-btn>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      <q-checkbox
                        v-if="field.type.type === 'boolean'"
                        class="q-pt-lg"
                        readonly
                        :label="field.label"
                        :hint="field.hint"
                        v-model="field.value"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      </div>
      
      
      <q-dialog v-model="dialogConfirmEmail.open">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione o tipo de e-mail</div>
          </q-card-section>
          <q-card-section>
            <q-select
              outlined
              :options="emailType"
              label="Tipo (opcional)"
              v-model="typeSelectedEmail"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogConfirmEmail.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addEmail"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogConfirmPhone.open">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione o tipo de telefone</div>
          </q-card-section>
          <q-card-section>
            <q-select
              outlined
              :options="phoneType"
              label="Tipo (opcional)"
              v-model="typeSelectedPhone"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogConfirmPhone.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addPhone"
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
              label="Informe o tipo de endereço"
              hint="Exemplo: Casa, trabalho, etc..."
              v-model="addressType"
            />
            <q-input outlined label="Logradouro" v-model="street" />

            <q-input outlined label="Número" type="number" v-model="number" />
            <q-input outlined label="Bairro" v-model="district" />
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
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "UserPersonalData",
  data() {
    return {
      tab: "",
      isSaving: false,
      newPhone: "",
      addressType: "",
      newEmail: "",
      value: '',
      typeSelectedPhone: null,
      typeSelectedAddress: null,
      typeSelectedEmail: null,
      dialogConfirmPhone: {
        open: false,
      },
      dialogConfirmEmail: {
        open: false,
      },
      fieldIndex: null,
      tabsIndex: null,
      dialogConfirmAddress: {
        open: false,
      },
      cep: "",
      street: "",
      number: "",
      city: "",
      state: "",
      district: "",
      userData: {},
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUsersConfig()
  },
  methods: {
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
    clkOpenAddressDialog(fieldIndex, tabIndex){
      this.dialogConfirmAddress.open = true
      this.fieldIndex = fieldIndex
      this.tabsIndex = tabIndex
    },
    salvar() {
      this.isSaving = true;
      this.clkCreateUser();
      setTimeout(() => {
        this.isSaving = false;
      }, 1000);
    },

    addPhone() {
      this.dialogConfirmPhone.open = false;
      this.userData.generalData.phones.push({
        phone: this.newPhone,
        type: this.typeSelectedPhone,
      });
      this.newPhone = "";
    },

    addEmail() {
      if (this.newEmail === "") {
        this.$q.notify("Preencha o campo e-mail antes de continuar");
        return;
      } else {
        this.userData.generalData.email.push({
          email: this.newEmail,
          type: this.typeSelectedEmail,
        });
        this.newEmail = "";
        this.dialogConfirmAddress.open = false;
      }
    },
    addMultipleField(){
      this.$q.notify('Diálogo de multiplos dados não implementado')
    },
    addAddress() {
      const fieldIndex = this.fieldIndex
      const tabsIndex = this.tabsIndex
      if (!this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address) {
        this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address = [];
        this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address.push({
          type: this.addressType,
          cep: this.cep,
          street: this.street,
          number: this.number,
          city: this.city,
          state: this.state,
          district: this.district,
        });
        this.dialogConfirmAddress.open = false;
        this.clearAddressInputs()
      } else {
        this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address.push({
          type: this.addressType,
          cep: this.cep,
          street: this.street,
          number: this.number,
          city: this.city,
          state: this.state,
          district: this.district,
        });
        this.clearAddressInputs()
        this.dialogConfirmAddress.open = false;
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
    },
    removePhone(i) {
      this.userData.generalData.phones.splice(i, 1);
    },
    removeAddress(i) {
      this.userData.generalData.address.splice(i, 1);
    },
    removeEmail(i) {
      this.userData.generalData.email.splice(i, 1);
    },
    getUsersConfig() {
      const opt = {
        route: "/desktop/adm/getUsersConfig",
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.userData = r.data
          this.tab = r.data.userDataTabs[0].tabValue
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente");
        }
      });
    },
    clkCreateUser() {
      // if(
      //   this.userData.name === '' ||
      //   this.userData.email === '' ||
      //   this.userData.user === '' ||
      //   this.userData.mobile === ''
      // ){ this.$q.notify('Preencha todos os campos'); return; }
      const opt = {
        route: "/desktop/user/updateUserData",
        body: {
          userDataTabs: this.userData.userDataTabs,
          userId: this.userData._id
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Usuário cadastrado com sucesso!");
          this.$router.push("/admin/usersList");
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente");
        }
      });
    },
    removeThisAddress(fieldIndex, tabsIndex, addressIndex) {
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address.splice(addressIndex, 1);
    }
  },
});
</script>
<style scoped>
.edit-tab{
  text-align: left;
  float: left;
  width: 100%;
}
</style>

