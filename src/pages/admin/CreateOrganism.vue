<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">novo organismo</div>
        <div v-if="organismData.fields.length" class="col-2">
          <q-btn
            @click="createOrganism"
            no-caps
            color="primary"
            rounded
            unelevated
            label="Criar organismo"
            />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-center q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
          <div class="text-h5">Selecione o tipo de configuração de organismo</div>
          <q-select
            outlined
            label="Nome da configuração"
            option-label="name"
            :option-value="(item) => item._id"
            emit-value
            map-options
            hint="Informe qual o tipo de configuração que está aplicando"
            v-model="organismData.organismTypeId"
            :options="organismTypesOptions"
            @update:modelValue="getOrganismConfigByType"
          />
          <q-separator v-if="organismData.fields.length" />
          <div v-if="organismData.fields.length" class="text-h5">
            Preencha os dados necessários:
          </div>
          <div v-for="(field, i) in organismData.fields" :key="i">
            <div v-if="field.multiple">
              <q-input
                v-model="organismData.fields[i].newMultipleValue"
                @blur="delete organismData.fields[i].newMultipleValue"
                outlined
                :type="getInputType(field.type.type)"
                :reverse-fill-mask="field.type.type === 'money'"
                :prefix="field.type.type === 'money' ? 'R$' : null"
                :label="field.label + (field.required ? '' : ' (Opcional)')"
                :mask="field.type.mask"
              >
                <template v-slot:append v-if="field.multiple">
                  <q-btn
                    icon="add"
                    color="primary"
                    flat
                    rounded
                    @click="addMultipleField(field)"
                  >
                    Adicionar
                  </q-btn>
                </template>
              </q-input>
              <div
                style="
                  border: 1px solid #c2c2c2;
                  border-radius: 3px;
                  padding: 5px;
                "
                v-if="field.value && field.value.length"
                class="q-mt-sm"
              >
                <q-chip
                  removable
                  @remove="field.value.splice(i, 1)"
                  color="secondary"
                  class="q-pa-md"
                  text-color="white"
                  v-for="(value, i) in field.value"
                  :key="i"
                >
                  {{ field.label }} {{ i + 1 }} - {{ value }}
                </q-chip>
              </div>
            </div>
            <q-input
              v-else-if="field.type.type !== 'boolean'"
              v-model="organismData.fields[i].value"
              outlined
              :type="getInputType(field.type.type)"
              :reverse-fill-mask="field.type.type === 'money'"
              :prefix="field.type.type === 'money' ? 'R$' : null"
              :label="field.label + (field.required ? '' : ' (Opcional)')"
              :mask="field.type.mask"
            />
            <q-checkbox
              v-else
              :label="field.label"
              v-model="organismData.fields[i].value"
            ></q-checkbox>
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateOrganism",
  data() {
    return {
      userSelected: '',
      usersOptions: [],
      organismTypesOptions: [],
      organismTypeId: null,
      newOrganism: {},
      newMultipleValue: "",
      structureInfo: {
        description: '',
        organismTypeId: null,
        functionId: null,
      },
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      
    };
  },
  mounted() {
    this.getOrganismsTypes();
  },
  methods: {
    addMultipleField(field) {
      if (!field.value) {
        field.value = [];
      }
      console.log(field.newMultipleValue);
      field.value.push(field.newMultipleValue);
      console.log(field);
    },
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/adm/getOrganismsTypes",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          
          this.organismTypesOptions = r.data;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getOrganismConfigByType() {
      const opt = {
        route: "/desktop/adm/getOrganismConfigByType",
        body: {
          organismTypeId: this.organismData.organismTypeId,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismData.organismConfigId = r.data.organismConfigId
          this.organismData.fields = r.data.organismFields;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    createOrganism() {
      if (this.checkRequiredFields()) {
        const opt = {
          route: "/desktop/adm/createOrganism",
          body: {
            organismData: this.organismData,
          },
        };
        useFetch(opt).then((r) => {
          if (!r.error) {
            this.$q.notify('Organismo criado com sucesso!')
            const organismId = r.data
            this.$router.push('/admin/organismDetail?organismId=' + organismId)
          } else {
            this.$q.notify("Ocorreu um erro, tente novamente por favor");
          }
        });
      } else console.log("Há campos obrigatórios não preenchidos");
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
  },
});
</script>


