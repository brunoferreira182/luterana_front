<template>
  <EditAttachments />
</template>
<script>
import { defineComponent } from "vue";
import EditAttachments from "../../components/EditAttachments.vue";

export default defineComponent({
  name: "CreateAttachment",
  components: { EditAttachments },
});
</script>
