<template>
  <!-- <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item" aria-current="page">
          Access Control
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          People-count
        </li>
      </ol>
      <h6 class="slim-pagetitle">
        Hi,
        <span v-text="authUser.name"></span>
      </h6>
    </div>
    <people-count />
  </div> -->

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
          <nuxt-link to="/iot">Access Control</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          People Counter
        </li>
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
import requests from "@/components/hagul/dashboard/requests";
import performanceTabs from "@/components/performance/hagul/tabs";
import authMixin from "@/mixins/iot/auth";

export default {
  components: {
    requests,
    performanceTabs,
    "people-count": () =>
      import("@/components/iot/dashboard/access-control/people-counter")
  },
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
