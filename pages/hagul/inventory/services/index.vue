<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Services</li>
      </ol>
      <h6 class="slim-pagetitle">Services</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/hagul/inventory/services"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          to="/hagul/inventory/services/bulk-import"
          class="nav-link"
          active-class="active"
        >
          <i class="icon ion-ios-cloud-upload"></i> Bulk Import
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <keep-alive>
      <nuxt-child />
    </keep-alive>
  </div>
  <!-- container -->
</template>

<script>
import authMixin from "@/mixins/hagul/auth";

export default {
  head: () => ({
    title: "Services · Hagul"
  }),
  meta: {
    pageName: "services.index"
  },
  mixins: [authMixin]
};
</script>
