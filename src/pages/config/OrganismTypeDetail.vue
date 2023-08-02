<template>
  <q-page-container class="no-padding">
    <q-page >
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{  organismData.name }}
          <q-chip outline v-if="organismData.isActive === 0" label="Inativo" color="red"/>
          <q-chip outline v-else-if="organismData.isActive === 1" label="Ativo" color="green"/>
        </div>
        <div class="col-3 text-right ">
          <q-btn 
            v-if="organismData.isActive === 1" 
            class="full-width"
            color="primary" 
            no-caps 
            outline 
            rounded
            label="Inativar" 
            @click="dialogInactiveOrganism.open = true"
          /> 
          <q-btn 
            v-else-if="organismData.isActive === 0"
            class="full-width"
            color="primary" 
            no-caps 
            outline 
            rounded
            label="Ativar" 
            @click="dialogInactiveOrganism.open = true"
          />
        </div>
      </div>
      <q-separator class="q-mx-md"></q-separator>
      <div class="row justify-center q-pa-md">
        <div class="col-6 q-gutter-md " align="center">
          <q-input 
            outlined
            readonly
            hint="Informe o nome do organismo"
            label="Nome do organismo"
            v-model="organismData.name"
          />
          <q-select 
            outlined
            label="É múltiplo?"
            hint="Informe se o organismo é multiplo"
            v-model="organismData.multiple"
            readonly
          />
          <q-select 
            outlined
            hint="Informe o nível de hierarquia, sendo 1 o mais alto nível e 10 o menor."
            label="Hierarquia"
            readonly
            v-model="organismData.position"
          />
        </div>
      </div>
      <q-dialog v-model="dialogInactiveOrganism.open" >
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div v-if="organismData.isActive === 1" class="text-h6 text-center">Tem certeza que deseja inativar esse tipo de organismo?</div>
            <div v-else-if="organismData.isActive === 0" class="text-h6 text-center">Tem certeza que deseja ativar esse tipo de organismo?</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat label="Depois" no-caps color="primary" @click="dialogInactiveOrganism.open = false" />
            <q-btn v-if="organismData.isActive === 1" unelevated rounded label="Confirmar" no-caps color="primary" @click="confirmInactiveOrganismType" />
            <q-btn v-else-if="organismData.isActive === 0" unelevated rounded label="Confirmar"  no-caps color="primary" @click="confirmActivateOrganismType" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from 'vue'
import useFetch from '../../boot/useFetch';
export default defineComponent({
  name: 'OrganismTypeDetail',
  data() {
    return {
      organismData: {
        position: '',
        name: '',
        multiple: '',
      },
      multiplePosition: [
        1, 2, 3, 4,
        5, 6, 7, 8, 
        9, 10
      ],
      dialogInactiveOrganism: {
        open: false,
      },
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismTypeDetailById()
  },
  methods: {
    confirmActivateOrganismType(){
      const organismTypeId = this.$route.query.organismTypeId
      const opt = {
        route: '/desktop/config/activateOrganismType',
        body: {
          _id: organismTypeId,
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Tipo inativado com sucesso!')
          this.getOrganismTypeDetailById()
          this.dialogInactiveOrganism.open = false
          return
        } else { this.$q.notify('Ocorreu um erro, tente novamente') }
      })
    },
    confirmInactiveOrganismType(){
      const organismTypeId = this.$route.query.organismTypeId
      const opt = {
        route: '/desktop/config/inactiveOrganismType',
        body: {
          _id: organismTypeId,
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Tipo inativado com sucesso!')
          this.getOrganismTypeDetailById()
          this.dialogInactiveOrganism.open = false
          return
        } else { this.$q.notify('Ocorreu um erro, tente novamente') }
      })
    },
    getOrganismTypeDetailById(){
      const organismTypeId = this.$route.query.organismTypeId
      const opt = {
        route: '/desktop/config/getOrganismTypeDetailById',
        body: {
          _id: organismTypeId,
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.organismData = r.data
          this.organismData.organismName = r.data.name
          this.organismData.position = r.data.position
          this.organismData.multiple = r.data.multiple
          return
        } else { this.$q.notify('Ocorreu um erro, tente novamente') }
      })
    },
  }
})
</script>


