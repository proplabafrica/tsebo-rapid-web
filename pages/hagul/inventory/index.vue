<template></template>

<script>
import authMixin from "@/mixins/hagul/auth";

export default {
  head: () => ({
    title: "Inventory System · Hagul"
  }),
  meta: {
    pageName: "sales-orders.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
