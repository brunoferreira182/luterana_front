<template>
  <q-list
    class="bg-grey-3"
    style="border-radius: 1rem"
    separator
  >
    <q-item-label header v-if="props.data[0] && props.data[0].frequency">
      Dados sobre os cultos:
    </q-item-label>
    <q-item
      v-for="(value, iValue) in props.data"
      :key="'multField' + iValue"
    >
      <q-item-section>
        <q-item-label>
          Frequência: {{ value.frequency }}
        </q-item-label>
        <q-item-label>
          Dias do mês: {{ value.days }}
        </q-item-label>
        <q-item-label>
          Horário: {{ value.times }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
        <q-btn
          icon="edit"
          flat
          round
          color="primary"
          @click="edit(fieldIndex, tabsIndex, props.data, value, iValue)"
          :disable="disableButtons"
        />
        <q-btn
          icon="delete"
          flat
          round
          color="red"
          @click="remove(fieldIndex, tabsIndex, props.data, value, iValue)"
          :disable="disableButtons"
        />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons', 'showHeader'])
const emits = defineEmits(['edit', 'remove'])

function edit(fieldIndex, tabsIndex, field, value, iValue) {
  emits('edit', fieldIndex, tabsIndex, field, value, iValue)
}

function remove(fieldIndex, tabsIndex, field, value, iValue) {
  emits('remove', fieldIndex, tabsIndex, field, value, iValue)
}


</script>
