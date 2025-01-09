<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Invoices</li>
      </ol>
      <h6 class="slim-pagetitle">Invoices</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/finance/invoices"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          v-for="(statuses, scope) in invoiceScopeStatuses"
          :key="scope"
          :to="`/finance/invoices?scope=${scope}`"
          >{{ scope }}</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :invoiceScopeStatuses="invoiceScopeStatuses" />
  </div>
  <!-- container -->
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  data: () => ({
    invoiceScopeStatuses: {
      pending: ["pending"],
      "in negotiation": ["negotiating"],
      approved: ["approved"]
    }
  }),
  meta: {
    pageName: "invoices.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
