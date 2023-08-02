<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Editar tipo de estrutura
        </div>
        <div class="col text-right">
          <q-btn
            @click="updateStructureType"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            Salvar edição
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
            v-model="structureTypeData.name"
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
                v-model="structureTypeData.description"
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
  name: "StructureTypeDetail",
  data() {
    return {
      titleName: "",
      structureTypeData: {
        name: '',
        description: '',
      },
      fields: [
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
      ],
      newField: {
        label: null,
        type: null,
        hint: null,
        required: true,
        multiple: false,
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getStructureTypeDetail();
  },
  methods: {
    getStructureTypeDetail() {
      const structureTypeId = this.$route.query.structureTypeId
      const opt = {
        route: "/desktop/config/getStructureTypeDetail",
        body: {
          structureTypeId: structureTypeId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.structureTypeData = r.data.structureTypeInfo
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    updateStructureType() {
      const structureTypeId = this.$route.query.structureTypeId
      const opt = {
        route: "/desktop/config/updateStructureType",
        body: {
          structureTypeId: structureTypeId,
          structureTypeInfo: this.structureTypeData,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Tipo de estrutura atualizada com sucesso!");
          this.getStructureTypeDetail()
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>
