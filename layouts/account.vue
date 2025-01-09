<template>
  <account-layout>
    <!-- slim-navbar -->
    <div class="slim-mainpanel">
      <nuxt />
    </div>
  </account-layout>
</template>

<script>
import layoutMixin from "@/mixins/layout";

export default {
  components: {
    "account-layout": () => import("@/components/layouts/account")
  },
  head: () => ({
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: process.env.APP_URL + "/favicon.ico"
      }
    ]
  }),
  mixins: [layoutMixin]
};
</script>
