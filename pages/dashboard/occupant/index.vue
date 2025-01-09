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
        Welcome
        <span v-text="authUser.name"></span>
      </h6>
    </div>
    <!-- slim-pageheader -->
    <performance-tabs />
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <!-- <nuxt-link
          to="/dashboard/occupant"
          class="nav-link"
          exact-active-class="active"
          >Create Request</nuxt-link
        > -->
        <nuxt-link to="/dashboard/occupant/track" class="nav-link" active-class="active" exact-active-class="active">
          <i class="icon ion-ios-analytics-outline"></i> Track
        </nuxt-link>
        <nuxt-link class="nav-link" exact-active-class="active" to="/dashboard/occupant/invoices">Invoices</nuxt-link>
        <nuxt-link class="nav-link" exact-active-class="active" to="/dashboard/occupant/declined">Declined Requests
        </nuxt-link>
        <nuxt-link v-if="false" to="/dashboard/occupant/units" class="nav-link" active-class="active">Units</nuxt-link>
      </nav>
      <create-request />
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child />
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";

import Vue from "vue";

export default {
  components: {
    "performance-tabs": () => import("@/components/performance/tabs"),
    "create-request": () =>
      import("@/components/maintenance/requests/status-table/create-modal")
  },
  created() {
  },
  head: () => ({
    title: "Occupant Dashboard · Tsebo-Rapid"
  }),
  meta: {
    pageName: "dashboard.occupant"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
