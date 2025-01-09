<template>
  <div class="tx-center mg-t-40">
    <i
      class="icon icon ion-ios-close-outline tx-100 tx-danger lh-1 mg-t-20 d-inline-block"
    ></i>
    <h4 class="tx-danger mg-b-20">{{ error.title }}</h4>
    <nuxt-link class="btn btn-danger" :to="redirect.route"
      >&larr; {{ redirect.text }}</nuxt-link
    >
  </div>
</template>

<script>
export default {
  props: ["error", "redirect"]
};
</script>
