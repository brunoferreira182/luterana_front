<template>
  <q-list
    class="bg-grey-3"
    style="border-radius: 1rem"
    separator
  >
    <q-item
      v-for="(value, iValue) in props.data.value"
      :key="'multField' + iValue"
    >
      <q-item-section>
        <q-item-label class="text-capitalize">
          {{ value.name }}
        </q-item-label>
        <q-item-label caption>
          Grau: {{ value.degree }}
        </q-item-label>
        <q-item-label caption>
          Instituição: {{ value.institution }}
        </q-item-label>
        <q-item-label caption>
          Data colação: {{ value.collationDate }}
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
        ><q-tooltip>Editar {{ props.data.type.label }}</q-tooltip></q-btn>
        <q-btn
          icon="delete"
          flat
          round
          color="red"
          @click="remove(fieldIndex, tabsIndex, props.data, value, iValue)"
        ><q-tooltip>Excluir {{ props.data.type.label }}</q-tooltip></q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex'])
const emits = defineEmits(['edit', 'remove'])


function edit(fieldIndex, tabsIndex, field, value, iValue) {
  console.log(value)
  emits('edit', fieldIndex, tabsIndex, field, value, iValue)
}

function remove(fieldIndex, tabsIndex, field, value, iValue) {
  emits('remove', fieldIndex, tabsIndex, field, value, iValue)
}


</script>
