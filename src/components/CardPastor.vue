<template>
  <q-card
    style="border-radius: 1rem"
    class="bg-grey-3 q-ma-sm q-pa-sm"
    flat
  >
    <q-item
      v-for="user in props.func.users"
      :key="user"
      style="border-radius: 0.5rem;"
      class="bg-white q-ma-xs"
    >
      <q-item-section avatar>
        <q-icon name="account_circle" size="38px" color="grey"/>
      </q-item-section>
      <q-item-section class="text-wrap" lines="2" v-if="user.userName">
        {{ user.userName }}
        <div class="text-caption text-grey-7" v-if="user.dates && user.dates.initialDate">
          Data início:
          {{ formatDate(user.dates.initialDate) }}
        </div>
        <div
          v-if="user.dates && user.dates.finalDate"
          class="text-caption text-grey-7"
        >
          Data Fim: {{ formatDate(user.dates.finalDate) }}
        </div>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
// import { defineComponent } from "vue";
const props = defineProps(['func', 'funcIndex', 'showAddUserButton', 'showInviteUserButton', 'isMobile'])

// export default defineComponent({
//   name: "CardFunction",
// })
</script>