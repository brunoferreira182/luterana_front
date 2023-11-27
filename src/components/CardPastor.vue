<template>
  <q-card
    style="border-radius: 1rem"
    class="bg-white q-ma-sm q-pa-sm"
    flat
  >
    <q-item
      v-for="(user) in props.func.users"
      :key="user"
      style="border-radius: 0.5rem;"
      class="bg-grey-3 q-ma-xs"
    >
      <q-item-section avatar>
        <q-img 
          style="border-radius: 1rem"
          :src="user.userImage ? utils.makeFileUrl(user.userImage) : avatar" 
          width="46px" 
          height="46px"
        />
      </q-item-section>
      <q-item-section class="text-wrap" lines="2" v-if="user.userName">
        {{ user.userName }}
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            v-if="canEditPastor"
            icon="sync"
            flat
            dense
            rounded
            color="primary"
            @click="swapPastorToFunctionPastor(user)"
            :disable="disableButtons"
          >
            <q-tooltip>Trocar pastor</q-tooltip>
          </q-btn>
          <q-btn
            v-if="canEditPastor"
            icon="delete"
            flat
            dense
            rounded
            color="red"
            @click="deleteUserFromFunction(user)"
            :disable="disableButtons"
          >
            <q-tooltip>Remover pastor</q-tooltip>
          </q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
// import { defineComponent } from "vue";
import avatar from '../assets/avatar.svg'
import utils from '../boot/utils'
const props = defineProps(['func', 'funcIndex', 'showAddUserButton', 'showInviteUserButton', 'isMobile', 'photo', 'canEditPastor', 'disableButtons'])
const emits = defineEmits(['remove', 'deleteUserFromFunction', 'swapPastorToFunctionPastor'])



function deleteUserFromFunction (user) {
  emits('deleteUserFromFunction', user)
}
function swapPastorToFunctionPastor (user) {
  emits('swapPastorToFunctionPastor', user)
}

</script>