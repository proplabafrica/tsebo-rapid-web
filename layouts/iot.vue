<template>
  <iot-layout>
    <!-- slim-navbar -->
    <div class="slim-mainpanel">
      <nuxt />
    </div>
  </iot-layout>
</template>

<script>
import layoutMixin from "@/mixins/layout";

export default {
  components: {
    "iot-layout": () => import("@/components/layouts/iot")
  },
  mixins: [layoutMixin]
};
</script>
