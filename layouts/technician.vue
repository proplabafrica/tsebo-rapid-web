<template>
  <app-layout>
    <div class="slim-mainpanel technician">
      <nuxt />
    </div>
  </app-layout>
</template>

<script>
import layoutMixin from "@/mixins/layout";

export default {
  components: {
    "app-layout": () => import("@/components/layouts/app")
  },
  mixins: [layoutMixin]
};
</script>
