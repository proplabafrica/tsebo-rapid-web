<template></template>

<script>
export default {
  middleware: ["auth", "dashboard"],
  meta: {
    pageName: "index"
  }
};
</script>
