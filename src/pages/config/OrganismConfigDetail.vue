<template>
  <OrganismConfig />
</template>
<script>
import OrganismConfig from "../../components/OrganismConfig.vue";
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  components: { OrganismConfig },
  name: "CreateOrganismsConfig",
  data() {
    return {};
  },
});
</script>
