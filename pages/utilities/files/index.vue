<template></template>

<script>
import authMixin from "@/mixins/auth";

export default {
  head: () => ({
    title: "Files · Tsebo-Rapid"
  }),
  meta: {
    pageName: "files.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
