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
      v-for="(value, iValue) in props.data"
      :key="iValue"
    >
      <q-item-section v-if="value.model === 'month'">
        <q-item-label>
          <strong class="q-mr-sm">Frequência:</strong> {{ value.label }}
        </q-item-label>
        <div
          v-for="week in value.weeks"
          :key="week"
          class="q-ml-xs q-py-md row"
        >
          <div class="col-4">
            {{ week.label }}:
          </div>
          <q-list class="col-8">
            <q-item
              class="no-padding"
              v-for="val in week.value"
              :key="val"
            >
              <q-item-label>
                {{ val.day.label }} às {{ val.time }}
              </q-item-label>
            </q-item>
          </q-list>
        </div>
      </q-item-section>
      <q-item-section v-else-if="value.model === 'week'">
        <q-item-label>
          <strong class="q-mr-sm">Frequência:</strong> {{ value.label }}
        </q-item-label>
        <div
          v-for="day in value.days"
          :key="day"
          class="q-ml-xs q-py-md row"
        >
          {{ day.value.label }} às {{ day.value.times.initial }}
        </div>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn 
            icon="edit"
            color="primary"
            flat
            round
            size="md"
            rounded
            @click="edit(fieldIndex)"
          />
          <q-btn 
            icon="delete"
            color="red"
            round
            flat
            size="md"
            rounded
            @click="remove(fieldIndex, isecretary)"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons', 'showHeader', 'user'])
const emits = defineEmits(['edit', 'remove'])

function edit(fieldIndex) {
  emits('edit', fieldIndex)
}

function remove(fieldIndex, tabsIndex, field, value, iValue) {
  emits('remove', fieldIndex, tabsIndex, field, value, iValue)
}


</script>
