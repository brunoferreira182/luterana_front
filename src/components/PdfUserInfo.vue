<template>
  <q-card
    style="width: 100vw;"
  > 
    <q-card-section>
      <div :id="'pdf' + userId">
        <q-list bordered class="q-ma-md" v-if="  props.data &&  props.data[0]">
          <div class="text-center text-h6">
            <strong>Informações do Cadastro da IELB</strong>
          </div>
          <q-list bordered class="q-ma-sm">
            <div class="text-h6 text-center">
              <strong class="text-center">Identificação, endereço, e-mail e telefones</strong>
            </div>
            <div class="q-ml-sm row">
              <div class="col-9">
                <p>Nome : <strong>{{  props.data[0].fields[0].value }}</strong></p>
                <p>Endereço: {{ props.data[3].fields[0].value[0].street}}, {{  props.data[3].fields[0].value[0].number }} </p>
                <p>Bairro: {{  props.data[3].fields[0].value[0].district }}</p>
                <p>Cidade: {{  props.data[3].fields[0].value[0].city }}</p>
                <p>Estado: {{  props.data[3].fields[0].value[0].state }}</p>
                <p>CEP: {{  props.data[3].fields[0].value[0].cep }}</p>
                <p>Telefone Celular: {{  props.data[2].fields[2].value[0].value }}</p>
                <p v-if=" props.data[2].fields[2].value[1]" >Telefone: {{  props.data[2].fields[2].value[1].value }}</p>
                <p v-if=" props.data[2].fields[2].value[2]" >Telefone: {{  props.data[2].fields[2].value[2].value }}</p>
                <p v-if=" props.data[2].fields[2].value[3]" >Telefone: {{  props.data[2].fields[2].value[3].value }}</p>
                <p v-if="userIdLegado.id">Código IELB: {{ userIdLegado.id }}</p>
                <p>Data de nascimento: {{  props.data[0].fields[2].value }}</p>
                <p>Estado Civil: {{ props.data[1].fields[3] && props.data[1].fields[3].value && props.data[1].fields[3].value[0] ? 'Casado' : 'Solteiro' }}</p>
                <p v-if=" props.data[2].fields[0].value &&  props.data[2].fields[0].value[0]" >E-mail: {{  props.data[2].fields[0].value[0].value }}</p>
                <p v-if=" props.data[2].fields[0].value &&  props.data[2].fields[0].value[1]" >E-mail: {{  props.data[2].fields[0].value[1].value }}</p>
                <p v-if=" props.data[2].fields[0].value &&  props.data[2].fields[0].value[2]" >E-mail: {{  props.data[2].fields[0].value[2].value }}</p>
              </div>
              <div class="col-3"> 
                <q-img 
                  style="border-radius: 1rem"
                  :src="props.userImage ? utils.makeFileUrl(userProfileImage) : avatar" 
                  width="74px" 
                  height="74px"
                />
              </div>
            </div>
          </q-list>
          <q-list bordered class="q-ma-sm">
            <div class="text-h6 text-center">
              <strong class="text-center">Casamento</strong>
            </div>
            <div class="q-ml-sm" v-if="props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[3] && props.data[1].fields[3].value && props.data[1].fields[3] && props.data[1].fields[3].value && props.data[1].fields[3].value[0] && props.data[1].fields[3].value[0].partner && props.data[1].fields[3].value[0].partner.name">
              <p>Cônjuge: {{props.data[1].fields[3].value[0].partner.name}}</p>
              <p>Data de nascimento cônjuge: {{ partnerData.birthDate }}</p>
              <p>Data início: {{ props.data[1].fields[3].value[0].partner.dates.initialDate }}</p>
              <p>Data fim: {{ props.data[1].fields[3].value[0].partner.dates.finalDate }}</p>
            </div>
          </q-list>
          <q-list class="q-ma-sm" bordered>
            <div class="text-h6 text-center">
              <strong class="text-center">Pais</strong>
            </div>
            <div
              class="q-ml-sm"
              v-if="props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[0] && props.data[1].fields[0].value && props.data[1].fields[0].value[0] && props.data[1].fields[1] && props.data[1].fields[1].value && props.data[1].fields[1].value[0] && props.data[1].fields[1].value[0].userName && props.data[1].fields[1].value[0].userName"
            >
              {{ props.data[1].fields[0].value[0].userName }} e {{ props.data[1].fields[1].value[0].userName }}
            </div>
          </q-list>
          <q-list
            class="q-ma-sm"
            bordered  
          >
            <div class="text-h6 text-center">
              <strong class="text-center">Filhos</strong>
            </div>
            <div
              class="q-ml-sm"
              v-if="props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[2] && props.data[1].fields[2].value"
            >
              <p 
              v-for="child in props.data[1].fields[2].value"
              :key="child"
              >
                Nome: {{ child.userName }} - Data de nascimento: {{ child.birthDate }}
              </p>
            </div>
          </q-list>
          <q-list
            class="q-ma-sm"
            bordered
          >
            <div class="text-h6 text-center">
              <strong class="text-center">Formação</strong>
            </div>
            <div v-if="formationData.data">
              <q-item
                v-for="formation in formationData.data"
                :key="formation"
                class="bg-grey-2 q-ma-sm"
                style="border-radius: 1rem;"
              >
                <q-item-section>
                  <q-item-label lines="1">
                    Nome: {{ formation.formationId }}
                  </q-item-label>
                  <q-item-label lines="2">
                    Nível: {{ formation.formationLevelId }}
                  </q-item-label>
                  <q-item-label lines="3">
                    Ano de conclusão: {{ formation.conclusionYear }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
          <q-list 
            bordered 
            class="q-ma-sm"
          >
            <div class="text-h6 text-center">
              <strong class="text-center">Vínculos</strong>
            </div>
            <div v-if="linkData.data">
              <q-item
                v-for="link in linkData.data"
                :key="link"
                class="bg-grey-2 q-ma-sm"
                style="border-radius: 1rem;"
              >
                <q-item-section>
                  <q-item-label lines="1">
                    {{ link.functionName }} - {{ link.organismName }}
                  </q-item-label>
                  <q-item-label lines="2">
                    Data inicial: {{ link.dates.initialDate }} / Data final: {{ link.dates.finalDate }}
                  </q-item-label>
                  <q-item-label v-if="link.deadline"  lines="3">
                    Prazo: {{ link.deadline }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-list>
      </div>
    </q-card-section>
    <q-card-actions align="center">
      <!-- <q-btn
        label="Voltar"
        rounded
        color="primary"
        no-caps
        unelevated
        flat
        @click="closeDialog"
      /> -->
      <q-btn
        v-if="$route.path !== '/admin/pastoralArchive'"
        label="Baixar pdf"
        rounded
        color="primary"
        no-caps
        unelevated
        @click="generatePdf"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup>

  const props = defineProps([ 'data', 'userImage','userId'])
  import useFetch from 'src/boot/useFetch';
  import utils from '../boot/utils'
  import avatar from '../assets/avatar.svg'
  import { watchEffect, ref } from 'vue'
  import html2pdf from 'html2pdf.js'


  watchEffect(() =>  {
    getParterInfo();
    getPartnerBirthDate()
    getChildsBirthDate()
    // getUserFormationsFromSga()
    // getIdLegadoByUserId()
    getAllLinksByUserId()
});

  const userData = ref({
    partners: []
  })
 
  const partnerData = ref({
    birthDate: null
  })

  const formationData = ref({
    data: null
  })

  const linkData = ref({
    data: null
  })

  const userIdLegado = ref({
    id: null
  })


  function generatePdf() {
    let pdf = document.getElementById('pdf'+ props.userId)
    let configs = {
      margin: 0,
      filename: `Ficha cadastral de ${props.data[0].fields[0].value}`,
      jsPDF: { unit:'mm', format: 'letter', orientation: 'portrait'},
      pagebreak: {mode: ['avoid-all']}
    }
    html2pdf().set(configs).from(pdf).save()
  }

  async function getParterInfo() {
    const opt = {
      route: '/desktop/adm/getParents',
      body: {
        userId: props.userId
      }
    }
    let r = await useFetch(opt)
    if (r.error) return
    userData.value.partners = r.data
  }

  async function getPartnerBirthDate() {
    if (props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[3] && 
      props.data[1].fields[3].value && props.data[1].fields[3].value[0] && props.data[1].fields[3].value[0].partner &&
      props.data[1].fields[3].value[0].partner.partnerId
    ) {
      const opt = {
        route: "/desktop/adm/getUserBirthDate",
        body:{
          userId: props.data[1].fields[3].value[0].partner.partnerId
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      partnerData.value.birthDate = r.data.birthDate
    }
  }

  async function getChildsBirthDate() {
    if (props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[2].value) {
      for (let i = 0; i < props.data[1].fields[2].value.length; i++) {
        let child = props.data[1].fields[2].value[i]
        const opt = {
          route: '/desktop/adm/getUserBirthDate',
          body: {
            userId: child._id
          }
        }
        let r = await useFetch(opt)
        if (r.error) return
        child.birthDate = r.data.birthDate
        console.log("🚀 ~ getChildsBirthDate ~ r.data:", r.data)
      }
    }
  }

  // async function getUserFormationsFromSga() {
  //   const opt = {
  //     route: '/desktop/adm/getUserFormationsFromSga',
  //     body: {
  //       userId: props.userId
  //     }
  //   }
  //   let r = await useFetch(opt)
  //   if (r.error) return
  //   formationData.value.data = r.data
  // }

  async function getAllLinksByUserId() {
    const opt = {
      route: '/desktop/adm/getAllLinksByUserId',
      body: {
        userId: props.userId
      }
    }
    let r = await useFetch(opt)
    if (r.error) return
    linkData.value.data = r.data
  }

  // async function getIdLegadoByUserId() {
  //   const opt = {
  //     route: '/desktop/adm/getIdLegadoByUserId',
  //     body: {
  //       userId: props.userId
  //     }
  //   }
  //   let r = await useFetch(opt)
  //   if (r.error) return
  //   userIdLegado.value.id = r.data.idLegado
  // }

</script>
