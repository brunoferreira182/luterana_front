<template>
  <q-card
    class="bg-grey-2"
    style="border-radius: 1rem"
    separator
    flat
  >
    <q-item-label header v-if="props.data[0] && props.data[0].frequency" class="no-padding">
      <div class="q-pl-md q-pt-sm">
        Dados sobre os cultos:
      </div>
    </q-item-label>
    <q-item
      class="no-margin"
      v-for="(value, iValue) in props.data"
      :key="'multField' + iValue"
    >
      <q-item-section>
        <q-item-label>
          <strong>Frequência:</strong>
          {{ value.frequency }}
        </q-item-label>
        <q-item-label>
          <strong>
            Dia: 
          </strong>
          {{value.days}}
        </q-item-label>
        <q-item-label>
          <strong>Horário:</strong>  {{ value.time }}
        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="props.user !== 'true'">
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
  </q-card>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons', 'showHeader', 'user'])
const emits = defineEmits(['edit', 'remove'])

function edit(fieldIndex, tabsIndex, field, value, iValue) {
  emits('edit', fieldIndex, tabsIndex, field, value, iValue)
}

function remove(fieldIndex, tabsIndex, field, value, iValue) {
  emits('remove', fieldIndex, tabsIndex, field, value, iValue)
}


</script>
