<template></template>

<script>
export default {
  created() {
    location.reload();
  },
  middleware: ["auth"]

  //   mixins: [authMixin]
};
</script>