<template>
  <div
    class="container"
    style="display: flex; flex-direction: column; height: 90vh"
  >
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/iot">Power & Utility Systems</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">HVAC</li>
      </ol>
      <h6 class="slim-pagetitle" v-if="authUser">
        Hi,
        <span v-text="authUser.name"></span>
      </h6>
      <h6 class="slim-pagetitle" v-else>Welcome</h6>
    </div>
    <div
      style="
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
      "
    >
      <h1 style="color: orange; font-size: 25px">Coming soon...</h1>
    </div>
  </div>
</template>

<script>
import authMixin from "@/mixins/iot/auth";

export default {
  head: () => ({
    title: "Dashboard · IOT"
  }),
  meta: {
    pageName: "generator-metrics.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
