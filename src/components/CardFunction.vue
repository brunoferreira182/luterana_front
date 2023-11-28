<template>
  <q-card
    style="border-radius: 1rem"
    :class="isPastor ? 'bg-grey-3 q-ma-sm q-pa-sm' : 'bg-blue-grey-1 q-ma-sm q-pa-sm'"
    flat
  >
    <q-item>
      <q-item-section top>
        <div class="text-subtitle2 text-capitalize">{{ props.func.functionName }}</div>
        <div  v-if="!props.isMobile">Descrição: {{ props.func.functionDescription }}</div>
        <div  v-if="!props.isMobile" class="text-caption text-grey-7">Título necessário: {{ props.func.functionRequiredTitleName ? props.func.functionRequiredTitleName : 'nenhum' }}</div>
      </q-item-section>
      <q-item-section top side>
        <div class="text-subtitle2">
          <q-badge color="orange-8" v-if="props.func.isRequired">
            Obrigatório
          </q-badge>
        </div>
      </q-item-section>
    </q-item>
    <q-expansion-item
      v-if="!props.isMobile"
      color="primary"
      icon="visibility"
      :label="props.func.visions ? `${props.func.visions.length} Visões` : '0 Visões'"
    >
      <q-chip
        v-for="(vision,i) in props.func.visions"
        :key="i"
        class="q-ml-xs"
      >{{ vision.name }}</q-chip>
      <span 
        class="text-caption text-grey-7"
        v-if="!props.func.visions || !props.func.visions.length"
      >Nenhuma visão</span>
    </q-expansion-item>
    <q-expansion-item
      default-opened
      color="primary"
      icon="group"
      :label="props.func.users ? `${props.func.users.length} Participantes` : '0 Participantes'"
    >
      <q-item
        v-for="user in props.func.users"
        :key="user"
        style="border-radius: 0.5rem;"
        class="bg-white q-ma-xs"
      >
        <q-item-section avatar>
          <q-img 
          style="border-radius: 1rem"
          :src="user.userImage ? utils.makeFileUrl(user.userImage) : avatar" 
          width="46px" 
          height="46px"
        />
        </q-item-section>
        <q-item-section class="text-wrap" lines="2">
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
        <q-item-section side v-if="!props.isMobile">
          <div class="text-grey-8 q-gutter-xs">
            <q-btn
              @click="insertObservation(user)"
              class="gt-xs"
              size="12px"
              color="secondary"
              flat
              dense
              round
              icon="library_books"
            >
              <q-tooltip> Observações </q-tooltip>
            </q-btn>
            <q-btn
              @click="deleteUserFromFunction(user)"
              class="gt-xs"
              size="12px"
              color="red-8"
              flat
              dense
              round
              icon="delete"
            >
              <q-tooltip> Deletar usuário da função </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-expansion-item
      color="primary"
      icon="forward_to_inbox"
      :label="props.func.functionDescription.toLowerCase() === 'pastor' ? 'Convites' : `${props.func.functionsSolicitations.length} Convites`"
    >
      <q-item
        v-for="user in props.func.functionsSolicitations"
        :key="user"
        style="border-radius: 0.5rem;"
        class="bg-white q-ma-xs"
      >
        <q-item-section avatar>
          <q-img 
            style="border-radius: 1rem"
            :src="user.userImage ? utils.makeFileUrl(user.userImage) : avatar" 
            width="208px" 
            height="208px"
          />
        </q-item-section>
        <q-item-section class="text-wrap" lines="2">
          Enviado por {{ user.sendBy }}
          <div>
            para {{ user.sendTo }}
          </div>
          <div class="text-caption text-grey-7" v-if="user.createdAt">
            Data de envio:
            {{ user.createdAt }}
          </div>
        </q-item-section>
        <q-item-section side v-if="!props.isMobile">
          <div class="text-grey-8 q-gutter-xs">
            <q-btn
              @click="insertObservation(user)"
              class="gt-xs"
              size="12px"
              color="secondary"
              flat
              dense
              round
              icon="library_books"
            >
              <q-tooltip> Observações </q-tooltip>
            </q-btn>
            <q-btn
              @click="deleteUserFromFunction(user)"
              class="gt-xs"
              size="12px"
              color="red-8"
              flat
              dense
              round
              icon="delete"
            >
              <q-tooltip> Deletar usuário da função </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <div 
      class="text-caption text-grey-7 q-mx-md"
      v-if="props.func.functionProperties && props.func.functionProperties.numRequired === true"
    >
      Esta função requer {{ props.func.functionNumOfOccupants }} participantes
    </div>
    <div 
      class="text-caption text-grey-7 q-mx-md"
      v-else
    >
      Esta função permite {{ props.func.functionNumOfOccupants }} participantes
    </div>
    <q-item-section class="q-pa-xs">
      <q-btn
        v-if="showInviteUserButton"
        label="Convidar pessoa"
        color="primary"
        dense
        icon="add"
        rounded
        flat
        no-caps
        @click="clkOpenDialogSolicitation"
      />
      <!-- <div class="text-center q-pa-md" v-if="!showInviteUserButton && $route.path.includes('/user')">
        Mudança de pastor é via administrativa
      </div> -->
      <q-btn
        v-if="showAddUserButton"
        label="Adicionar pessoa"
        color="primary"
        dense
        icon="add"
        rounded
        flat
        no-caps
        @click="linkUserToFunction"
      />
    </q-item-section>
  </q-card>
</template>

<script setup>
// import { defineComponent } from "vue";
import utils from '../boot/utils'
import avatar from '../assets/avatar.svg'
const props = defineProps(['func', 'funcIndex', 'showAddUserButton', 'showInviteUserButton', 'isMobile', 'isPastor'])

const emits = defineEmits(['insertObservation', 'deleteUserFromFunction', 'linkUserToFunction', 'clkOpenDialogSolicitation'])

function insertObservation(user) {
  emits('insertObservation', user)
}

function deleteUserFromFunction (user) {
  emits('deleteUserFromFunction', user)
}
function clkOpenDialogSolicitation () {
  emits('clkOpenDialogSolicitation', props.func, props.funcIndex)
}

function linkUserToFunction () {
  emits('linkUserToFunction', props.func, props.funcIndex)
}

// export default defineComponent({
//   name: "CardFunction",
// })
</script>