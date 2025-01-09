<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Tender Processes</li>
      </ol>
      <h6 class="slim-pagetitle">Tender Processes</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/hagul/purchase/tender-processes"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          to="/hagul/purchase/tender-processes/create"
          class="nav-link"
          active-class="active"
        >
          <i class="icon ion-compose"></i> Create
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child />
  </div>
  <!-- container -->
</template>

<script>
import authMixin from "@/mixins/hagul/auth";

export default {
  meta: {
    pageName: "tender-processes.index"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
