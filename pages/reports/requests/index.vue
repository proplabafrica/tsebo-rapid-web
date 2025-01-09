<template>
  <div class="mg-x-5">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Work Request Reporting</li>
      </ol>
      <h6 class="slim-pagetitle">Work Request Reporting</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/reports/requests"
          class="nav-link"
          exact-active-class="active"
          >Client Requests</nuxt-link
        >
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          v-for="(statuses, scope) in scopeStatuses"
          :key="scope"
          :to="`/reports/requests/by-scope?scope=${scope}`"
          >{{ scope }}</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :scopeStatuses="scopeStatuses" />
  </div>
  <!-- container -->
</template>

<script>
import authMixin from "@/mixins/auth";
export default {
  beforeDestroy() {
    this.$store.commit("maintenance/clientRequests/toggleRefresh");
    this.$store.commit("maintenance/workRequests/toggleRefresh");
  },
  created() {
    this.$store.commit("maintenance/clientRequests/toggleRefresh");
    this.$store.commit("maintenance/workRequests/toggleRefresh");
  },
  data: () => ({
    scopeStatuses: {
      scoping: ["01", "05", "20"],
      costed: ["35", "100", "105"],
      started: ["60"],
      completed: ["65", "80"]
    }
  }),
  head: () => ({
    title: "Request Monitoring"
  }),
  meta: {
    pageName: "reports.requests"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
