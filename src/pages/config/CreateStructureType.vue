<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          nova configuração de tipo de estrutura
        </div>
        <div class="col text-right">
          <q-btn
            @click="CreateStructureType"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            Criar configuração
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-center q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
          <div class="text-h5">Nome</div>
          <q-input
            label="Escreva o nome"
            outlined
            hint="Nome do novo tipo de estrutura"
            v-model="structureTypeInfo.name"
          />
          <div class="text-h5">Escreva uma descrição de forma sugestiva</div>
          <div class="row q-gutter-x-sm q-mx-none">
            <div class="col">
              <q-input
                outlined
                class="q-ml-sm"
                autogrow
                hint="Escreva uma descrição completa"
                label="Descrição"
                v-model="structureTypeInfo.description"
              />
            </div>
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
  name: "CreateStructureType",
  data() {
    return {
      structureTypeInfo: {
        name: '',
        description: '',
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  // beforeMount() {
  //   this.getFieldTypes();
  // },
  methods: {
    CreateStructureType() {
      const opt = {
        route: "/desktop/config/CreateStructureType",
        body: {
          structureTypeInfo: this.structureTypeInfo,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Tipo de estrutura cadastrada com sucesso!");
          this.structureTypeInfo = {}
          this.$router.push('/config/structuresTypesList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>
