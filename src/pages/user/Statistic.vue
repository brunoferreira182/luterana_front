<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-capitalize"> 
          <div class="text-center text-h5 q-mb-sm">
            Estatística 2023
          </div>
          <q-tabs class="bg-primary text-white shadow-2" v-model="tab">
            <q-tab name="Dados iniciais" icon="diversity_2" label="Dados iniciais"/>
            <q-tab name="Dados pastorais" icon="description" label="Dados pastorais"/>
            <q-tab name="Atividades" icon="description" label="Atividades"/>
          </q-tabs>
        </div>
      </div>
      <div>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Dados iniciais" class="q-ma-xm">
            <div class="text-h5">
              Este bloco é dedicado às congregações e paróquias.
            </div>
            <div>
              - Para correções, clique na canetinha ao lado da informação;
            </div>
            <div>
              - Caso não deseje concluir a seção no momento, salve as alterações no botão 'Salvar' Rascunho;
            </div>
            <div>
              - Ao terminar a conferência, clique em 'Seguir' para prosseguir.
            </div>
            
          </q-tab-panel>

          <q-tab-panel name="Dados pastorais">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus eu lectus sit amet viverra. 
            Sed faucibus lectus sed est accumsan, id interdum metus sagittis. Nullam viverra est at arcu 
            fringilla, eu sollicitudin nisi condimentum. Vivamus at semper urna. Phasellus ante justo, 
            tristique nec lacus non, volutpat euismod quam. Curabitur et diam eget magna fringilla 
            sollicitudin. Praesent vulputate turpis sed enim mollis, ut euismod urna ultricies. 
            Sed aliquet consequat tellus, nec congue purus consectetur ut. Nullam non fringilla odio. 
            Proin ac massa lacinia, interdum felis vitae, luctus arcu. Morbi non malesuada magna. Morbi 
            porta erat nec fermentum auctor. Praesent ac leo mollis, placerat turpis ut, consectetur mauris. 
            Nullam venenatis augue eget ante pellentesque, eu viverra erat aliquam.
            Mauris aliquam sed ipsum eget ornare. Nullam ornare, mauris eu finibus efficitur, tellus felis
            malesuada est, 
            at egestas leo libero eget neque. Nam sit amet gravida purus. Donec tempus augue nunc, quis vehicula 
            diam tempus eu. Quisque sit amet arcu elit. Phasellus cursus elit quis porttitor mollis. Curabitur non
            metus est. Morbi non risus molestie, tristique purus et, ultricies eros. Sed non bibendum ipsum, non 
          </q-tab-panel>

          <q-tab-panel name="Atividades">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus eu lectus sit amet viverra. 
            Sed faucibus lectus sed est accumsan, id interdum metus sagittis. Nullam viverra est at arcu 
            fringilla, eu sollicitudin nisi condimentum. Vivamus at semper urna. Phasellus ante justo, 
            tristique nec lacus non, volutpat euismod quam. Curabitur et diam eget magna fringilla 
            sollicitudin. Praesent vulputate turpis sed enim mollis, ut euismod urna ultricies. 
            Sed aliquet consequat tellus, nec congue purus consectetur ut. Nullam non fringilla odio. 
            Proin ac massa lacinia, interdum felis vitae, luctus arcu. Morbi non malesuada magna. Morbi 
            porta erat nec fermentum auctor. Praesent ac leo mollis, placerat turpis ut, consectetur mauris. 
            Nullam venenatis augue eget ante pellentesque, eu viverra erat aliquam.
            Mauris aliquam sed ipsum eget ornare. Nullam ornare, mauris eu finibus efficitur, tellus felis
            malesuada est, 
            at egestas leo libero eget neque. Nam sit amet gravida purus. Donec tempus augue nunc, quis vehicula 
            diam tempus eu. Quisque sit amet arcu elit. Phasellus cursus elit quis porttitor mollis. Curabitur non
            metus est. Morbi non risus molestie, tristique purus et, ultricies eros. Sed non bibendum ipsum, non 
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name:"Statistics",
  data() {
    return {
      tab: null
    }
  }
})
</script>

<style scoped>
.custom-border {
  border: 1px solid #027be3;
}
</style>