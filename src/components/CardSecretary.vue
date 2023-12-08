<template>
  <q-card
    style="border-radius: 1rem"
    class="bg-grey-2"
    flat
  >
    <q-item-label header  class="no-padding">
      <div class="q-pl-md q-pt-sm">
        Dados sobre a secretária:
      </div>
    </q-item-label>
    <q-item 
      v-for="(secretary, isecretary) in props.data"
      :key="secretary"
      class="bg-grey-2"
    >
      <q-item-section>
        <q-item-label>
          <strong>Nome:</strong> {{ secretary.user.userName }}
        </q-item-label>
        <strong>Horário de trabalho:</strong> 
        <q-item-label v-for="day in secretary.days" :key="day" class="q-ml-sm">
          {{ day.value.label }}:
          <div v-for="time in day.time" :key="time" class="text-subtitle1 q-ml-xl">
            {{ time.initial }} às {{ time.final }}
          </div>
        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="props.user !== 'true'">
        <q-item-label>
          <q-btn 
            icon="edit"
            color="primary"
            flat
            round
            size="md"
            rounded
            @click="edit"
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
  const props = defineProps(['data', 'fieldIndex', 'user'])
  const emits = defineEmits(['remove', 'edit'])

  function remove(fieldIndex, isecretary) {
    emits('remove', fieldIndex, isecretary)
  }
  function edit() {
    emits('edit', props.fieldIndex)
  }
</script>