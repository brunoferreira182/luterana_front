<template>
  <div
    style="width: 800px;"
  > 
    <q-card-section>
      <div :id="'pdf' + userId">
        <q-list bordered class="q-ma-md" v-if="props.data && props.data[0]">
          <div class="text-center text-h6 q-my-sm">
            <strong>Informações do Cadastro da IELB</strong>
          </div>
          <q-list bordered class="q-ma-sm">
            <div class="text-h6 text-center q-my-md">
              <strong class="text-center">Identificação, endereço, e-mail e telefones</strong>
            </div>
            <div class="q-ml-sm row">
              <div class="col-9">
                <p><span class="bold">Nome:</span> {{ props.data[0].fields[0].value }}</p>
                <p v-if="props.data[0].fields[1].value"><span class="bold">Email:</span> {{ props.data[0].fields[1].value }}</p>
                <p><span class="bold">Endereço:</span> {{ props.data[3].fields[0].value[0].street}}, {{ props.data[3].fields[0].value[0].number }} </p>
                <p><span class="bold">Bairro:</span> {{ props.data[3].fields[0].value[0].district }}</p>
                <p><span class="bold">Cidade:</span> {{ props.data[3].fields[0].value[0].city }}</p>
                <p><span class="bold">Estado:</span> {{ props.data[3].fields[0].value[0].state }}</p>
                <p><span class="bold">CEP:</span> {{ props.data[3].fields[0].value[0].cep }}</p>
                <p><span class="bold">Telefone Celular:</span> {{ props.data[2].fields[2].value[0].value }}</p>
                <p v-if="props.data[2].fields[2].value[1]"><span class="bold">Telefone:</span> {{ props.data[2].fields[2].value[1].value }}</p>
                <p v-if="props.data[2].fields[2].value[2]"><span class="bold">Telefone:</span> {{ props.data[2].fields[2].value[2].value }}</p>
                <p v-if="props.data[2].fields[2].value[3]"><span class="bold">Telefone:</span> {{ props.data[2].fields[2].value[3].value }}</p>
                <p v-if="userIdLegado.id"><span class="bold">Código IELB:</span> {{ userIdLegado.id }}</p>
                <p><span class="bold">Data de nascimento:</span> {{ props.data[0].fields[2].value }}</p>
                <p><span class="bold">Estado Civil:</span> {{ props.data[1].fields[3] && props.data[1].fields[3].value && props.data[1].fields[3].value[0] ? 'Casado' : 'Solteiro' }}</p>
                <p><span class="bold">Cpf:</span> {{ props.data[0].fields[4].value }}</p>
                <p v-if="props.data[2].fields[0].value && props.data[2].fields[0].value[0]"><span class="bold">E-mail:</span> {{ props.data[2].fields[0].value[0].value }}</p>
                <p v-if="props.data[2].fields[0].value && props.data[2].fields[0].value[1]"><span class="bold">E-mail:</span> {{ props.data[2].fields[0].value[1].value }}</p>
                <p v-if="props.data[2].fields[0].value && props.data[2].fields[0].value[2]"><span class="bold">E-mail:</span> {{ props.data[2].fields[0].value[2].value }}</p>
              </div>
              <div class="">
                <q-img
                  style="left: 20px"
                  :src="imageSrc"
                  width="106px" 
                  height="106px"
                  @load="onImageLoad"
                />
              </div>
            </div>
          </q-list>
          <q-list bordered class="q-ma-sm">
            <div class="text-h6 text-center">
              <strong class="text-center">Casamento</strong>
            </div>
            <div class="q-ml-sm" v-if="props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[3] && props.data[1].fields[3].value && props.data[1].fields[3].value[0] && props.data[1].fields[3].value[0].partner && props.data[1].fields[3].value[0].partner.name">
              <p><span class="bold">Cônjuge:</span> {{ props.data[1].fields[3].value[0].partner.name }}</p>
              <p><span class="bold">Data de nascimento cônjuge:</span> {{ partnerData.birthDate }}</p>
              <p><span class="bold">Data início:</span> {{ props.data[1].fields[3].value[0].partner.dates.initialDate }}</p>
              <p><span class="bold">Data fim:</span> {{ props.data[1].fields[3].value[0].partner.dates.finalDate }}</p>
            </div>
          </q-list>
          <q-list class="q-ma-sm" bordered>
            <div class="text-h6 text-center">
              <strong class="text-center">Pais</strong>
            </div>
            <div class="q-ml-sm">
              <p v-if="props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[0] && props.data[1].fields[0].value && props.data[1].fields[0].value[0] && props.data[1].fields[0].value[0].userName"><span class="bold">Pai:</span> {{ props.data[1].fields[0].value[0].userName }}</p>
              <p v-if="props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[1] && props.data[1].fields[1].value && props.data[1].fields[1].value[0] && props.data[1].fields[1].value[0].userName"><span class="bold">Mãe:</span> {{ props.data[1].fields[1].value[0].userName }}</p>
            </div>
          </q-list>
          <q-list class="q-ma-sm" bordered>
            <div class="text-h6 text-center">
              <strong class="text-center">Filhos</strong>
            </div>
            <div class="q-ml-sm" v-if="props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[2] && props.data[1].fields[2].value">
              <p v-for="child in props.data[1].fields[2].value" :key="child"><span class="bold">Nome:</span> {{ child.userName }} - <span class="bold">Data de nascimento:</span> {{ child.birthDate }}</p>
            </div>
          </q-list>
          <q-list class="q-ma-sm" bordered>
            <div class="text-h6 text-center">
              <strong class="text-center">Formação</strong>
            </div>
            <div v-if="formationData.data">
              <q-item v-for="formation in formationData.data" :key="formation" class="bg-grey-2 q-ma-sm" style="border-radius: 1rem;">
                <q-item-section>
                  <q-item-label lines="1"><span class="bold">Nome:</span> {{ formation.formationId }}</q-item-label>
                  <q-item-label lines="2"><span class="bold">Nível:</span> {{ formation.formationLevelId }}</q-item-label>
                  <q-item-label lines="3"><span class="bold">Ano de conclusão:</span> {{ formation.conclusionYear }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
          <q-list bordered class="q-ma-sm">
            <div class="text-h6 text-center">
              <strong class="text-center">Vínculos</strong>
            </div>
            <div v-if="linkData.data">
              <q-item v-for="link in linkData.data" :key="link" class="bg-grey-2 q-ma-sm" style="border-radius: 1rem;">
                <q-item-section>
                  <q-item-label lines="1">{{ link.functionName }} - {{ link.organismName }}</q-item-label>
                  <q-item-label lines="2"><span class="bold">Data inicial:</span> {{ link.dates.initialDate }} / <span class="bold">Data final:</span> {{ link.dates.finalDate }}</q-item-label>
                  <q-item-label v-if="link.deadline" lines="3"><span class="bold">Prazo:</span> {{ link.deadline }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-list>
      </div>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn v-if="$route.path !== '/admin/pastoralArchive'" label="Baixar pdf" rounded color="primary" no-caps unelevated @click="generatePdf" />
    </q-card-actions>
  </div>
</template>

<script setup>
  const props = defineProps(['data', 'userImage', 'userId'])
  import useFetch from 'src/boot/useFetch';
  import utils from '../boot/utils'
  import avatar from '../assets/avatar.svg'
  import { watchEffect, ref } from 'vue'
  import html2pdf from 'html2pdf.js'
  const imageSrc = props.userImage ? utils.makeFileUrl(props.userImage) : avatar

  const imageLoaded = ref(false)
  const onImageLoad = () => {
    imageLoaded.value = true
  }

  watchEffect(() => {
    getParterInfo();
    getPartnerBirthDate()
    getChildsBirthDate()
    getUserFormationsFromSga()
    getIdLegadoByUserId()
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
    let pdf = document.getElementById('pdf' + props.userId)
    let configs = {
      margin: 0,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { useCORS: true },
      filename: `Ficha cadastral de ${props.data[0].fields[0].value}`,
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all'] }
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
    if (props && props.data && props.data[1] && props.data[1].fields && props.data[1].fields[3] && props.data[1].fields[3].value && props.data[1].fields[3].value[0] && props.data[1].fields[3].value[0].partner && props.data[1].fields[3].value[0].partner.partnerId) {
      const opt = {
        route: "/desktop/adm/getUserBirthDate",
        body: {
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
      }
    }
  }

  async function getUserFormationsFromSga() {
    const opt = {
      route: '/desktop/adm/getUserFormationsFromSga',
      body: {
        userId: props.userId
      }
    }
    let r = await useFetch(opt)
    if (r.error) return
    formationData.value.data = r.data
  }

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

  async function getIdLegadoByUserId() {
    const opt = {
      route: '/desktop/adm/getIdLegadoByUserId',
      body: {
        userId: props.userId
      }
    }
    let r = await useFetch(opt)
    if (r.error) return
    userIdLegado.value.id = r.data.idLegado
  }
</script>

<style scoped>

</style>
