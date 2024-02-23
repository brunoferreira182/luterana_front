<template>
  <q-list
    style="border-radius: 1rem"
    class="bg-grey-3"
    separator
  >
    <q-item
      v-for="(item, i) in props.data"
      :key="item + i"
    >
      <q-item-section>
        <q-item-label v-if="item && item.partner && item.partner.name">
          {{ item.partner.name}}
        </q-item-label>
        <q-item-label v-if="item && item.partner && item.partner.dates">
          Data inicial: {{ item.partner.dates.initialDate }}
        </q-item-label>
        <q-item-label v-if="item && item.partner && item.partner.dates.finalDate !== ''">
          Data final: {{ item.partner.dates.finalDate }}
        </q-item-label>
        <q-item-label v-if="item && item.partner && item.partner.endReason && item.partner.endReason!== ' '">
          Motivo: {{ item.partner.endReason }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            icon="edit"
            flat
            rounded
            color="primary"
            @click="edit(fieldIndex, tabsIndex, i)"
            :disable="disableButtons"
          />
          <q-btn
            icon="delete"
            flat
            rounded
            color="red"
            @click="remove(fieldIndex, tabsIndex, i)"
            :disable="disableButtons"
          />
        </q-item-label> 
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons'])
const emits = defineEmits(['edit', 'remove'])
function edit(fieldIndex, tabsIndex, i) {
  emits('edit', fieldIndex, tabsIndex, i)
}
function remove(fieldIndex, tabsIndex, i) {
  emits('remove', fieldIndex, tabsIndex, i)
}


</script>
