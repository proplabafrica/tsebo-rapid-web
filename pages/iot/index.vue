<template>
  <div>
    <div class="container">
      <div class="slim-pageheader">
        <ol class="breadcrumb slim-breadcrumb">
          <li class="breadcrumb-item">
            <nuxt-link to="/hagul">Home</nuxt-link>
          </li>
          <li class="breadcrumb-item">
            <nuxt-link to="/hagul">Power & Utility Systems</nuxt-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Diesel Tanks
          </li>
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
  </div>
  <!-- <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/iot">Power & Utility Systems</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Generator Metrics
        </li>
      </ol>
      <h6 class="slim-pagetitle" v-if="authUser">
        Hi,
        <span v-text="authUser.name"></span>
      </h6>
      <h6 class="slim-pagetitle" v-else>Welcome</h6>
    </div>
    <generator-metrics />
  </div> -->
  <!-- <div
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
        <li class="breadcrumb-item active" aria-current="page">
          Generator Metrics
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
  </div> -->
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
      import("@/components/iot/dashboard/power-systems/diesel-tanks"),
    "generator-metrics": () =>
      import("@/components/iot/dashboard/power-systems/generator-metrics")
  },
  head: () => ({
    title: "Dashboard · IOT"
  }),
  meta: {
    pageName: "diesel-tanks.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
