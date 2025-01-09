<template></template>

<script>
import authMixin from "@/mixins/auth";

export default {
  head: () => ({
    title: "Subscription Package Details · Tsebo-Rapid"
  }),
  meta: {
    pageName: "subscription-packages.show"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
