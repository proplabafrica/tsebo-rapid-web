<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
      </ol>
      <h6 class="slim-pagetitle">
        Hi

        <span v-text="authUser.name"></span>
      </h6>
    </div>

    <!-- slim-pageheader -->
    <performance-tabs />

    <status-table class="mg-t-10" />
    <div class="spool-container">
      <spool-report class="price" :authUser="authUser" />
    </div>

    <div class="price-container">
      <price-check class="price" />
    </div>

  </div>
</template>

<script>
import authMixin from "@/mixins/auth";


export default {
  components: {
    "status-table": () =>
      import("@/components/maintenance/requests/status-table"),
    "performance-tabs": () => import("@/components/performance/tabs"),
    "price-check": () => import("@/components/ui/price-check.vue"),
    "spool-report": () => import("@/components/ui/spool-report.vue"),
  },

  head: () => ({
    title: "Admin Dashboard · Tsebo-Rapid"
  }),
  middleware: ["auth"],
  meta: {
    pageName: "dashboard.admin"
  },
  mixins: [authMixin]
};
</script>

<style>
.spool-container {
  position: fixed;
  bottom: 15%;
  left: 2%;
  display: flex;
}

.price-container {
  position: fixed;
  bottom: 15%;
  right: 2%;
  display: flex;
}
</style>
