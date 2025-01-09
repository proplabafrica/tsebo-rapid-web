<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Technicians</li>
      </ol>
      <h6 class="slim-pagetitle">Technicians</h6>
    </div>
    <!-- slim-pageheader -->
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/people/technicians"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          to="/people/technicians/create"
          class="nav-link"
          active-class="active"
        >
          <i class="icon ion-compose"></i> Register
        </nuxt-link>
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
    pageName: "technicians.index"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
