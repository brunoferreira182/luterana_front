<template>
  <q-dialog :model-value="open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Informe os dados de endereço</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-input
          mask="#####-###"
          outlined
          label="CEP"
          v-model="addressData.cep"
          @keyup="checkCEP"
        />
        <q-input
          outlined
          label="Informe o tipo de endereço (obrigatório)"
          hint="Exemplo: Casa, trabalho, etc..."
          v-model="addressData.addressType"
        />
        <q-input outlined label="Logradouro" v-model="addressData.street" />
        <q-input outlined label="Número" type="number" v-model="addressData.number" />
        <q-input outlined label="Bairro" v-model="addressData.district" />
        <q-input outlined label="Complemento" v-model="addressData.complement" />
        <div class="row">
          <div class="col">
            <q-input outlined label="Cidade" v-model="addressData.city" />
          </div>
          <div class="col q-pl-md">
            <q-input outlined mask="AA" label="Estado" v-model="addressData.state" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Depois"
          no-caps
          color="primary"
          @click="closeDialog"
        />
        <q-btn
          unelevated
          rounded
          label="Confirmar"
          no-caps
          color="primary"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import useFetch from "../boot/useFetch";
// import utils from '../../boot/utils'
import { ref, watch } from 'vue'
import { Loading } from 'quasar'

const props = defineProps(['open', 'addressDataProp'])
const emits = defineEmits(['closeDialog', 'confirmAddress'])

watch(() => props.addressDataProp, (nV) => {
  addressData.value = nV
}, { deep: true })


const addressData = ref({
  cep: '',
  addressType: null,
  city: '',
  state: '',
  street: '',
  number: '',
  complement: '',
  district: ''
})

function confirm () {
  emits('confirmAddress', addressData.value)
}

function checkCEP(ev) {
  addressData.value.cep = ev.target.value;
  if (addressData.value.cep.length === 9) {
    const opt = {
      route: "/utils/consultZipCode",
      body: {
        zipCode: addressData.value.cep.replace('-', ''),
      },
    };
    Loading.show();
    useFetch(opt).then((r) => {
      Loading.hide();
      addressData.value = {
        cep: ev.target.value,
        city: r.data.localidade,
        state: r.data.uf,
        street: r.data.logradouro,
        district: r.data.bairro
      }
    });
  }
}


function closeDialog() {
  emits('closeDialog')
}

</script>
