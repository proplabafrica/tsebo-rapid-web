<template></template>

<script>
import authMixin from "@/mixins/hagul/auth";

export default {
  head: () => ({
    title: "Ware Houses · Hagul"
  }),
  meta: {
    pageName: "ware-houses.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
