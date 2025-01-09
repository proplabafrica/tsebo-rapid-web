<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Power & Utility Systems</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Diesel Tanks</li>
      </ol>
      <h6 class="slim-pagetitle" v-if="authUser">
        Hi,
        <span v-text="authUser.name"></span>
      </h6>
      <h6 class="slim-pagetitle" v-else>Welcome</h6>
    </div>
    <!-- slim-pageheader -->

    <!-- diesel-tank -->
    <diesel-tanks />
  </div>
</template>

<script>
import requests from "@/components/hagul/dashboard/requests";
import performanceTabs from "@/components/performance/hagul/tabs";
import authMixin from "@/mixins/iot/auth";

export default {
  components: {
    requests,
    performanceTabs,
    "diesel-tanks": () =>
      import("@/components/iot/dashboard/power-systems/diesel-tanks")
  },
  head: () => ({
    title: "Dashboard · IOT"
  }),
  meta: {
    pageName: "diesel-tanks.index"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
