<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/dashboard/operation-manager">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
      </ol>
      <h6 class="slim-pagetitle">
        Hi
        <span v-text="authUser.name"></span>
      </h6>
    </div>
    <!-- slim-pageheader -->


    <performance />
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
    performance: () => import("@/components/performance/om-board/performance"),
    "price-check": () => import("@/components/ui/price-check.vue"),
    "spool-report": () => import("@/components/ui/spool-report.vue"),
  },
  head: () => ({
    title: "Operations Manager · Tsebo-Rapid",
  }),
  middleware: ["auth"],
  meta: {
    pageName: "dashboard.org-admin",
  },
  mixins: [authMixin],
};
</script>

<style scoped>
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
