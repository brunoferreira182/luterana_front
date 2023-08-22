<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ userName }}
        </div>
        <div class="col text-right">
          <q-btn
            rounded
            no-caps
            unelevated
            icon="bookmark"
            flat
            color="primary"
            label="Salvar Edição"
            @click="clkUpdateUser"
          />
        </div>
      </div>
      <q-separator class="q-mx-md"></q-separator>
      <q-tabs
        v-model="tab"
        dense
        no-caps
        class="text-grey q-py-sm"
        active-color="primary"
        indicator-color="primary"
        inline-label
        align="justify"
        narrow-indicator
        @update:model-value="addBar = false"
      >
        <q-tab 
          v-for="(tabs, i) in userData.userDataTabs"
          :key="i"
          :name="tabs.tabValue" 
          :label="tabs.tabLabel" 
        />
      </q-tabs>
      <q-separator />
      <q-tab-panels 
        animated 
        class="q-my-md bg-accent"
        :model-value="tab"
      >
        <q-tab-panel 
          v-for="(tabs, tabsIndex) in userData.userDataTabs"
          :key="tabsIndex"
          :name="tabs.tabValue" 
        >
          <div class="row justify-center q-pa-md">
          <div class="col-12 q-gutter-md" align="start">
            <div
              v-for="(field, fieldIndex) in tabs.fields"
              :key="fieldIndex"
              class="q-my-md"
            >
              <div class="row q-gutter-sm justify-center items-center">
                <div class="col-8">
                  <div v-if="field.type.type !== 'boolean' && field.type.type !== 'address' ">
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
                  <div class="text-right" v-if="field.type.type === 'address'">
                    <q-btn
                      label="Adicionar um endereço"
                      no-caps
                      rounded
                      unelevated
                      outline
                      color="primary"
                      @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
                    />
                  </div>
                  <div
                    v-if="field.type.type === 'address' && !field.address"
                    class="text-subtilte1 text-start"
                  >
                    <div class="text-h6">Endereços</div>
                    Nenhum endereço vinculado
                  </div>
                  
                    <q-list
                      class="no-margin"
                      v-if="field.address"
                    >
                      <div class="text-h6 q-px-md">Endereços</div>
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
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "UserDetail",
  data() {
    return {
      tab: "",
      isSaving: false,
      newPhone: "",
      newAddress: "",
      newEmail: "",
      allPermissions: [],
      userPermissions: [],
      formattedPermissions: [],
      userId: null,
      userData: [],
      dialogInactiveUser: {
        open: false,
      },
      phoneType: [
        { type: "Residencial" },
        { type: "Trabalho" },
        { type: "Outro" },
      ],
      genderOptions: ["Masculino", "Feminino", "Outro"],
      maritalOptions: [
        "Solteiro(a)",
        "Casado(a)",
        "Separado(a)",
        "Divorciado(a)",
        "Viúvo(a)",
      ],
      userName: '',
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUserDetailById();
  },
  methods: {
    salvar() {
      this.isSaving = true; 
      this.clkUpdateUser();
      setTimeout(() => {
        this.isSaving = false; 
      }, 1000); 
    },
    clkUpdateUser(){
      this.$q.notify('Edição não implementada')
    },
    getUserDetailById() {
      const userId = this.$route.query.userId;
      const opt = {
        route: "/desktop/adm/getUserDetailById",
        body: {
          _id: userId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        this.tab = r.data.userDataTabs[0].tabValue
        this.userName =  r.data.userDataTabs[0].fields[0].value
        this.userData = r.data;
        this.userId = r.data.userId;
        this.getCompanyPermissions();
      });
    },
    getCompanyPermissions() {
      const opt = {
        route: "/auth/getCompanyPermissions",
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.allPermissions = r.data;
        this.getUserPermissionsOnly();
      });
    },
    getUserPermissionsOnly() {
      const opt = {
        route: "/auth/getUserPermissionsOnly",
        body: {
          userId: this.userId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.userPermissions = r.data;
        this.formattedPermissions = this.allPermissions.map((permission) => {
          if (
            this.userPermissions.some((e) => e.id === permission.permissionId)
          ) {
            permission.value = true;
          } else permission.value = false;
          return permission;
        });
      });
    },
    changeUserPermission(permissionId, newStatus) {
      const opt = {
        route: "/auth/changeUserPermission",
        body: {
          userId: this.userId,
          permissionId: permissionId,
          newStatus: newStatus ? 1 : 0,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Permissão atualizada!");
        } else {
          this.$q.notify(
            "ERRO ao atualizar permissão! Tente novamente mais tarde."
          );
        }
        this.getCompanyPermissions();
      });
    },
  },
});
</script>
<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
.footer {
  height: 52px;
  position: fixed;
  bottom: 0px;
}
.separator {
  position: fixed;
  top: 118px;
  border-left: 2px solid rgb(216, 216, 216);
  height: 806px;
}
</style>
