<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Novo arquivo
        </div>
        <div class="col text-right">
          <q-btn
            rounded
            color="primary"
            unelevated
            no-caps
            @click="addAttachFiles"
            label="Criar arquivo"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-12 q-gutter-md" align="start">
          <div class="text-h5">Nome</div>
          <q-input
            label="Escreva o nome"
            outlined
            hint="Nome do arquivo"
            v-model="attachTitle"
          />
          <div class="text-h5">Escreva uma descrição de forma sugestiva</div>
          <q-input
            outlined
            autogrow
            hint="Uma descrição completa sobre o arquivo"
            label="Descrição"
            v-model="attachDescription"
          />
          <q-file
            v-model="attachData"
            label="Clique para inserir seu arquivo"
            outlined
            clearable
            class="full-width q-pl-md"
            max-files="5"
            multiple
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import utils from "../../boot/utils";
export default defineComponent({
  name: "CreateAttachments",
  data() {
    return {
      attachTitle: '',
      attachDescription: '',
      attachData: null,
    }
  },
  beforeMount(){
    this.startView()
  },
  methods: {
    async startView () {
      const permStatus = await utils.getPermissionStatus('USER')
      if (permStatus.data === 'onMaitenance') {
        this.$router.push('/maitenancePage')
        return
      }
      this.isMobile = useScreenStore().isMobile
    },
    addAttachFiles() {
      if (!this.attachData || this.attachTitle === '' || this.attachDescription === '') {
        this.$q.notify('Preencha todos os campos para prosseguir')
        return
      }
      const opt = {
        route: "/desktop/commonUsers/addAttachFiles",
        body: {
          attachTitle : this.attachTitle,
          attachDescription: this.attachDescription
        },
        file: null
      };
      if(this.attachData !== null){
        opt.file = [ { file: this.attachData, name: this.attachData.name } ]
      }
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Arquivo anexado com sucesso!");
          this.$router.back()
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>
<style scoped>

.separator {
  position: fixed;
  top: 68px;
  border-left: 2px solid rgb(216, 216, 216);
  height: 806px;
}
</style>
