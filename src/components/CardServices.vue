<template>
  <q-card
    class="bg-grey-2"
    style="border-radius: 1rem"
    separator
    flat
  >
    <q-item 
      v-for="(data, iValue) in props.data"
      :key="data"
    >
      <q-item-section>
        <div
          
        >
          <div>
            Dia da semana: {{ data.dayOfWeek.label }}
          </div>
          <div>
            Horário: {{ data.time }}
          </div>
          <div v-if="data.configLabel">
            Semanas: {{ data.configLabel }}
          </div>
        </div>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            color="primary"
            icon="edit"
            rounded
            flat
            unelevated
            @click="edit"
          />
          <q-btn
            color="red"
            icon="delete"
            rounded
            flat
            unelevated
            @click="remove(fieldIndex, iValue)"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import { onBeforeMount, defineProps } from 'vue'
onBeforeMount(() => {
  nSeiONome()
})
const props = defineProps(['data', 'fieldIndex'])
const emits = defineEmits(['edit', 'remove'])

function nSeiONome() {
  console.log('CUAHSUYIASHDSAHB')
  for (let i = 0; i < props.data.length; i++) {
    let data = props.data[i];
    data.configLabel = '';
    let configs = data.configs;
    let firstConfig = true; 
    if (configs.everyWeek) {
      data.configLabel += 'Todas as semanas';
      firstConfig = false;
      return
    }
    if (configs.firstWeek) {
      data.configLabel += (firstConfig ? '' : ', ') + 'Primeira semana';
      firstConfig = false;
    }
    if (configs.secondWeek) {
      data.configLabel += (firstConfig ? '' : ', ') + 'Segunda semana';
      firstConfig = false;
    }
    if (configs.thirdWeek) {
      data.configLabel += (firstConfig ? '' : ', ') + 'Terceira semana';
      firstConfig = false;
    }
    if (configs.fourthWeek) {
      data.configLabel += (firstConfig ? '' : ', ') + 'Quarta semana';
      firstConfig = false;
    }
    if (configs.fifthWeek) {
      data.configLabel += (firstConfig ? '' : ', ') + 'Quinta semana';
      firstConfig = false;
    }
}
}

function edit(fieldIndex) {
  emits('edit', fieldIndex)
}

function remove(fieldIndex, iValue) {
  emits('remove', fieldIndex, iValue)
}


</script>
