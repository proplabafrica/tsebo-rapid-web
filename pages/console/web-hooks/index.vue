<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/console/web-hooks">Console</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Web Hooks</li>
      </ol>
      <h6 class="slim-pagetitle">Web Hooks</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/console/web-hooks"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          to="/console/web-hooks/create"
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
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  meta: {
    pageName: "console.web-hooks.index"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
