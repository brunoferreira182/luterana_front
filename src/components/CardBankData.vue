<template>
  <q-list
    style="border-radius: 1rem"
    class="bg-grey-3"
    separator
  >
    <q-item
      v-for="(value, iValue) in props.data.value"
      :key="value + iValue"
    >
      <q-item-section>
        <q-item-label class="text-capitalize">
          {{ value.bank }}
        </q-item-label>
        <q-item-label caption>
          Agência {{ value.agency }}
        </q-item-label>
        <q-item-label caption>
          Agência {{ value.account }}
        </q-item-label>
        <q-item-label caption v-if="value.pix !== ''">
          Pix {{ value.pix }}
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
          ><q-tooltip>Editar {{ props.data.type.label }}</q-tooltip></q-btn>
          <q-btn
            icon="delete"
            flat
            round
            color="red"
            @click="remove(fieldIndex, tabsIndex, props.data, value, iValue)"
            :disable="disableButtons"
          ><q-tooltip>Excluir {{ props.data.type.label }}</q-tooltip></q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons'])
const emits = defineEmits(['edit', 'remove'])


function edit(fieldIndex, tabsIndex, field, value, iValue) {
  emits('edit', fieldIndex, tabsIndex, field, value, iValue)
}

function remove(fieldIndex, tabsIndex, field, value, iValue) {
  emits('remove', fieldIndex, tabsIndex, field, value, iValue)
}


</script>
