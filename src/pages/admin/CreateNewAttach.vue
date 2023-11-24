<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between text-h5">
        Novo anexo
      </div>
      <div>
        <q-input
          class="q-mx-md q-my-sm"
          label="Nome"
          hint="O nome do documento"
          outlined
          v-model="documentName"
        />
        <q-input
          class="q-mx-md q-my-sm"
          hint="A descrição do documento"
          label="Descrição"
          outlined
          v-model="documentDescription"
        />
        <q-file 
          class="q-mx-md q-my-sm"
          multiple 
          outlined
          label="Clique aqui para adicionar anexos" 
          hint="Adicione aqui os anexos"
          v-model="documentFiles"
        />
        <q-checkbox 
          class="q-mx-md q-my-sm"
          v-model="onlyPastor" 
          label="Somente visível para pastores?"
        />
      </div>
      <div class="col text-right self-center q-mr-md">
        <q-btn
          no-caps
          color="primary"
          rounded
          outline
          icon="add"
          unelevated
          label="Adicionar documento"
          @click="addDocument"
        />
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
  import { defineComponent } from "vue";
  import useFetch from "../../boot/useFetch";
  export default defineComponent({
    name: "CreateNewAttach",
    data() {
      return {
        documentName: '',
        documentDescription: '',
        documentFiles: [],
        filesToSend: [],
        onlyPastor: false
      };
    },
    methods: {
      addDocument() {
        if (this.documentName === '' || this.documentDescription === '' || this.documentFiles.lenght > 0) {
        this.$q.notify("Preencha todos os campos antes de enviar")
        return
        }
        this.documentFiles.forEach((file, ifile) => {
          this.filesToSend.push({ file: this.documentFiles[ifile], name: this.documentFiles[ifile].name})
        })
        const opt = {
          route: "/desktop/adm/addAttachFiles",
          body: {
            attachTitle: this.documentName,
            attachDescription: this.documentDescription,
            onlyPastor: this.onlyPastor
          },
          file: this.filesToSend
        };
        useFetch(opt).then((r) => {
          if (r.error) {
            this.$q.notify('Ocorreu um erro, tente novamente')
            return
          } else {
            this.$q.notify('Anexo criado com sucesso')
            this.$router.push('/admin/admDocuments')
          }
        });
        }
      }
  })
</script>