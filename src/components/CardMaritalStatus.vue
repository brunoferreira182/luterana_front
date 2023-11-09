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
        <q-item-label>
          
          {{ item.partner.name}}
        </q-item-label>
        <q-item-label>
          Data inicial: {{ item.partner.dates.initialDate }}
        </q-item-label>
        <q-item-label v-if="item.partner.dates.finalDate !== ''">
          Data final: {{ item.partner.dates.finalDate }}
        </q-item-label>
        <q-item-label v-if="item.partner.endReason && item.partner.endReason!== ' '">
          Motivo: {{ item.partner.endReason }}
        </q-item-label>
      </q-item-section>
      <!-- <q-item-section side>
        <q-item-label>
          <q-btn
            icon="edit"
            flat
            color="primary"
            @click="edit(fieldIndex, tabsIndex, i)"
            :disable="disableButtons"
          />
        </q-item-label> 
      </q-item-section> -->
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons'])
// const emits = defineEmits(['edit'])

// function edit(fieldIndex, tabsIndex, i) {
//   emits('edit', fieldIndex, tabsIndex, i)
// }


</script>
