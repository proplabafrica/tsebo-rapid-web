<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Maintenance Requests</li>
      </ol>
      <h6 class="slim-pagetitle">Maintenance Requests</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/maintenance/requests"
          class="nav-link"
          exact-active-class="active"
          >Client Requests</nuxt-link
        >
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          v-for="(statuses, scope) in scopeStatuses"
          :key="scope"
          :to="`/maintenance/requests/by-scope?scope=${scope}`"
          >{{ scope }}</nuxt-link
        >
        <nuxt-link
          to="/maintenance/requests/create"
          class="nav-link"
          exact-active-class="active"
          >Create</nuxt-link
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
import { mapActions } from "vuex";


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
      billed:["72"],
      costed: ["35", "100", "105"],
      started: ["60"],
      "awaiting review": ["65"],
      reviewed: ["80"],
      units: []
    }
  }),
  head: () => ({
    title: "Request Monitoring"
  }),
  meta: {
    pageName: "requests.index"
  },
  created() {
    this.getUnits(this);
  },
  methods: {
    ...mapActions({
      getUnits: "location/units/getUnits"
    })
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
