<template>
  <q-dialog :model-value="props.open">
    <q-card
      style="width: 1000px;"
    > 
      <q-card-section>
        <q-list bordered class="q-ma-md">
          <div class="text-center text-h6">
            <strong>Informações do Cadastro da IELB</strong>
          </div>
          <q-list bordered class="q-ma-sm">
            <div class="text-h6 text-center">
              <strong class="text-center">Identificação, endereço, e-mail e telefones</strong>
            </div>
            <div class="q-ml-sm" v-if="  props.data &&  props.data[0]">
              <div>
                <p>Nome : <strong>{{  props.data[0].fields[0].value }}</strong></p>
                <p>Profissão - falta</p>
                <p>Nacionalidade - falta</p>
                <p>Endereço: {{ props.data[3].fields[0].value[0].street}}, {{  props.data[3].fields[0].value[0].number }} </p>
                <p>Bairro: {{  props.data[3].fields[0].value[0].district }}</p>
                <p>Cidade: {{  props.data[3].fields[0].value[0].city }}</p>
                <p>Estado: {{  props.data[3].fields[0].value[0].state }}</p>
                <p>CEP: {{  props.data[3].fields[0].value[0].cep }}</p>
                <div>
                  <span>Caixa postal - falta</span> <span class="q-ml-md" >Cep caixa postal - falta</span>
                </div>
                <p>Telefone Celular: {{  props.data[2].fields[2].value[0].value }}</p>
                <p v-if=" props.data[2].fields[2].value[1]" >Telefone: {{  props.data[2].fields[2].value[1].value }}</p>
                <p v-if=" props.data[2].fields[2].value[2]" >Telefone: {{  props.data[2].fields[2].value[2].value }}</p>
                <p v-if=" props.data[2].fields[2].value[3]" >Telefone: {{  props.data[2].fields[2].value[3].value }}</p>
                <p>Data Ordenação - falta</p>
                <p>Local Ordenação: falta</p>
                <p>Código IELB: falta</p>
                <p>Data de nascimento: {{  props.data[0].fields[2].value }}</p>
                <p>Estado Civil: {{ props.data[1].fields[3] && props.data[1].fields[3].value && props.data[1].fields[3].value[0] ? 'Casado' : 'Solteiro' }}</p>
                <p>Naturalidade: falta</p>
                <p>Estado naturalidade: falta</p>
                <p>Complemento: falta</p>
                <p v-if=" props.data[2].fields[0].value &&  props.data[2].fields[0].value[0]" >E-mail: {{  props.data[2].fields[0].value[0].value }}</p>
                <p v-if=" props.data[2].fields[0].value &&  props.data[2].fields[0].value[1]" >E-mail: {{  props.data[2].fields[0].value[1].value }}</p>
                <p v-if=" props.data[2].fields[0].value &&  props.data[2].fields[0].value[2]" >E-mail: {{  props.data[2].fields[0].value[2].value }}</p>
              </div>
              <div class="col-4">
              </div>
            </div>
          </q-list>
          <q-list bordered class="q-ma-sm">
            <div class="text-h6 text-center">
              <strong class="text-center">Casamento</strong>
            </div>
          </q-list>
        </q-list>
        {{ props.data[0] }}
      </q-card-section>
    OIIIIIII
    </q-card>
  </q-dialog>
</template>
<script setup>

  const props = defineProps(['open', 'data'])

</script>