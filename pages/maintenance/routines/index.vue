<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Routines</li>
      </ol>
      <h6 class="slim-pagetitle">Routines</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/maintenance/routines"
          class="nav-link"
          exact-active-class="active"
          >Upcoming Jobs</nuxt-link
        >
        <nuxt-link
          to="/maintenance/routines/completed"
          class="nav-link"
          exact-active-class="active"
          >Completed Jobs
        </nuxt-link>
        <!-- <nuxt-link
          to="/maintenance/routines/maintenance-plans"
          class="nav-link"
          exact-active-class="active"
          >Maintenance Plans</nuxt-link
        > -->
        <nuxt-link
          v-if="authorized('maintenance-plans.store')"
          to="/maintenance/routines/create-maintenance-plan"
          class="nav-link"
          exact-active-class="active"
          >Create Plan</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child />
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  meta: {
    pageName: "maintenance-plans.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
